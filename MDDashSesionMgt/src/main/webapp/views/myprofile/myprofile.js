'use strict';

var mod = angular.module('myApp.myprofile', ['ngRoute', 'ngMockE2E']);

mod
    .run(function ($httpBackend) {

        // returns the current list of phones

        if (TEST) {
            $httpBackend
                .when('GET', PREFIX_RQ + '/api/app/account/')
                .respond(
                function (method, url, data, headers) {
                    var data = '{"user":{"uuid":"48b3c4ca-fa5d-499d-b7de-f2b4b0027d57","userID":"test@test.com","firstname":"David","surname":"Bourasseau"}}';
                    var header = {};
                    return [200, data, {}];

                });

            $httpBackend
                .when('GET', /^\/api\/app\/properties\/Snapmail/)
                .respond(
                function (method, url, data, headers) {
                    var data = '{"propertyGroups":{"property":{"key":"google","value":"1\/Y3MeDweziyve0mjp_Rru0bJnu5-F6-OjMchDEbFx5VfBactUREZofsF9C7PrpE-j"},"name":"Snapmail"}}';
                    var header = {};
                    return [200, data, {}];

                });

            $httpBackend.when('PUT', /api\/app\/account\/[^//]+$/).respond(
                function (method, url, data, headers) {
                    var user = JSON.parse(data).user;
                    if (user.userID.indexOf("@") > -1)
                        return [200, {}, {}];
                    else
                        return [409, {}, {}];
                });

            $httpBackend.whenGET(/views/).passThrough();

        } else {
            $httpBackend.whenGET(/.*/).passThrough();
            $httpBackend.whenPUT(/.*/).passThrough();
            $httpBackend.whenDELETE(/.*/).passThrough();
            $httpBackend.whenPOST(/.*/).passThrough();
        }
    });

mod
    .controller('ProfileCtrl', [function () {

    }])
    .controller(
    'ProfileController',
    [
        '$http',
        '$location',
        function ($http, $location) {

            var user = this;

            user.person = {};
            user.smtp = {};
            user.class = "";
            this.tab = 0;
            this.smtpManualSettings = false;
            this.smtpTab = 0;

            this.setTab = function (value) {
                user.class = "";
                if (this.tab == value) {
                    this.tab = 0;
                } else {
                    this.tab = value;
                }
            };
            this.isSetTab = function (value) {
                return this.tab === value;
            };

            this.getUser = function () {
                $http
                    .get(
                    PREFIX_RQ + "/api/app/account/")
                    .success(
                    function (data, status, headers,
                              config) {
                        if (headers('Content-Type') != null) {
                            if (headers('Content-Type').indexOf("text/html") == 0) {
                                window.location.replace("/");
                            }
                        }
                        user.person = data.user;
                    })
                    .error(
                    function (data, status, headers,
                              config) {
                        console
                            .log("Failed while getting User Informations");
                    })
            };

            this.putUser = function (person) {
                var data = {};
                data.user = person;
                $http
                    .put(PREFIX_RQ + "/api/app/account/",
                    data)
                    // + this.person.userID, data)
                    .success(
                    function (data, status, headers,
                              config) {
                        console.log("Succeed");
                        user.class = "btn-success";
                    })
                    .error(
                    function (data, status, headers,
                              config) {
                        console
                            .log("Failed while editing User Informations");
                        user.class = "btn-danger";
                    });
            };

            this.getUser();

        }]);
