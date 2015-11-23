/**
 * Created by David Bourasseau on 10/01/15.
 */
'use strict';

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

function userAuth() {
    console.log("Cookie : " + getCookie("JSESSIONID"));
    if (getCookie("JSESSIONID") == "") {
        console.log("Cookie : " + getCookie("JSESSIONID"));
//	 window.location.replace("/");
    }

}

var app;
app = angular.module('myApp.index', ['ngRoute','ngMockE2E']);

app.run(function ($httpBackend) {

    // returns the current list of phones
    if (TEST) {

        $httpBackend
            .when('GET', PREFIX_RQ + 'api/app/account')
            .respond(
            function (method, url, data, headers) {
                var data = '{"user":{"uuid":"48b3c4ca-fa5d-499d-b7de-f2b4b0027d57","userID":"test@test.com","firstname":"David","surname":"Bourasseau"}}';
                var header = {};
                return [200, data, {}];

            });
    }
    else {
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
    }

});



app.controller('IndexController', ['$http',
    function ($http, localStorageService) {
        var home = this;
        home.cookie = getCookie("authentication");
        home.user = [];
        // $scope.Cookie = getCookie("authentication");
        this.contact = function () {

            $http.get(PREFIX_RQ + 'api/app/account')
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    home.user = data.user;
                });
        }
        this.contact();

        this.logout = function () {
            $http.post(PREFIX_RQ + '/api/logout')

                .success(function (response) {
                    document.cookie = "JSESSIONID=; expires=-1";
                    // to get a new csrf token call the api
                    $http.get(PREFIX_RQ + '/api/app/account')
                        .success(function (data, status, headers, config) {
                            if (headers('Content-Type') != null) {
                                if (headers('Content-Type').indexOf("text/html") == 0) {
                                    window.location.replace("/");
                                }
                            }
                        });

                    // window.location.replace("/");
                    return response;
                });
        }
    }]);

//myApp.factory('redirectInterceptor', ['$location', '$q', function($location, $q) {
//    return function(promise) {
//        promise.then(
//            function(response) {
//                if (typeof response.data === 'string') {
//                    if (response.data.indexOf instanceof Function &&
//                        response.data.indexOf('<html id="ng-app" ng-app="loginApp">') != -1) {
//                        $location.path("/logout");
//                        window.location = url + "logout"; // just in case
//                    }
//                }
//                return response;
//            },
//            function(response) {
//                return $q.reject(response);
//            }
//        );
//        return promise;
//    };
//}]);