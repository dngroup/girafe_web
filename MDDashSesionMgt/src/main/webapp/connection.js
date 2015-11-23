
var ConnectionForm = angular.module('ConnectionForm', ['ngMockE2E',
    'ngCookies']);

ConnectionForm.run(function ($httpBackend, $cookieStore) {
    if (TEST) {
        // returns the current list of phones
        $httpBackend
            .when('POST', PREFIX_RQ + '/api/authentication')
            .respond(
            function (method, url, data, headers) {
                data = data.slice(11, 23);
                if (data == "test@test.fr") {
                    $cookieStore.put("JSESSIONID", '7443678124586818821');
                    return [200, {}, {}];
                }
                data = data.slice(0, 8);
                if (data == "testtest") {
                    var user = '7443678124586818821';
                    console.log(user);
                    $cookieStore.put('JSESSIONID', user);

                    return [200, {}, {}];
                } else {
                    return [403, {}, {}];
                }
            });

        $httpBackend.when('GET', PREFIX_RQ + '/api/app/account')
            .respond(
            function (method, url, data, headers) {
                var data = '{"user":{"uuid":"48b3c4ca-fa5d-499d-b7de-f2b4b0027d57","userID":"test@test.com","firstname":"David","surname":"Bourasseau"}}';
                var header = {};
                return [200, data, {}];

            });

    } else {
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
    }
});

ConnectionForm.controller("mainController", function ($scope, $http, $rootScope) {
    var errorConnection = false;
    $scope.CredentialsCheck = function () {
        if (errorConnection == true) {
            return "btn-theme04";
        } else {
            return "btn-theme";
        }
    };


    $scope.testConnection = function () {
        $http
            .get(
            PREFIX_RQ + "/api/app/account/")
            .success(
            function (data, status, headers,
                      config) {
                if (headers('Content-Type') != null) {
                    if (headers('Content-Type').indexOf("text/html") == 0) {
                        //window.location.replace("/");
                    }
                    else {
                        $rootScope.person = data.user;
                        window.location.replace("/home.html");
                    }
                }

            })
            .error(
            function (data, status, headers,
                      config) {
                console
                    .log("Failed while getting User Informations");
            })
    };

    $scope.testConnection();


    $scope.submitData = function (person) {

        if (person.rememberMe != true) {
            person.rememberMe = false;
        }
        var data = 'j_username=' + encodeURIComponent(person.userID)
            + '&j_password=' + encodeURIComponent(person.password)
            + '&remember-me=' + encodeURIComponent(person.rememberMe) + '&submit=Login';
        return $http.post(PREFIX_RQ + '/api/authentication', data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).success(function (response) {
	    console.log("Success");
            window.location.replace("home.html");
            return response;
        }).error(function (response) {
            console.log("Failed");
            errorConnection = false;
        });

    }

});