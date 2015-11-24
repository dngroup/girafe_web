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
var TEST = false;
//test

var userID = getCookie("authentication");
console.log(userID);

var PREFIX_RQ = "";
//var PREFIX_RQ = "http://192.168.173.228:9998";

var searchItemIntoArrayWithAttribute = function (array, attr, value) {
    return searchItemIntoArrayWithAttribute(array, attr, value, "");
}

var searchItemIntoArrayWithAttribute = function (array, attr, value, special) {
    for (var i = 0; i < array.length; i++) {
        console.log("special + (array[i][attr] " + (special + (array[i][attr])));
        if (special + (array[i][attr]) == value) {
            return i;
        }
    }
    return null;
}


// Declare app level module which depends on views, and components
var app;
app = angular.module(
    'myApp',
    ['ngRoute', 'angularFileUpload', 'ui.bootstrap', 'myApp.index',
        'myApp.home', 'myApp.myvideos', 'myApp.mypictures', 'myApp.mypictures',
        'myApp.myprofile', 'myApp.mycloud', 'myApp.friends', 'myApp.detail',
        'myApp.friendSearch', 'myApp.newvideo', 'myApp.addon', 'myApp.myroles']);
////

// Declare route
app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'views/home/home.html',
            controller: 'HomeCtrl'
        })

        .when('/detail', {
            templateUrl: 'views/detail/detail.html',
            controller: 'DetailCtrl'
        })
        .when('/detail:ActorId:ContentId', {
            templateUrl: 'views/detail/detail.html',
            controller: 'DetailCtrl'
        })
        .when('/myvideos2', {
            templateUrl: 'views/detail/detail.html',
            controller: 'DetailCtrl'
        })
        .when('/myvideos', {
            templateUrl: 'views/myvideos/myvideos.html',
            controller: 'MyVideosCtrl'
        })

        .when('/mycloud', {
            templateUrl: 'views/mycloud/mycloud.html',
            controller: 'MyCloudCtrl'
        }).when('/mycloud:blabla', {
            templateUrl: 'views/mycloud/mycloud.html',
            controller: 'MyCloudCtrl'
        })
        .when('/myprofile', {
            templateUrl: 'views/myprofile/myprofile.html',
            controller: 'ProfileCtrl'
        })
        .when('/friends', {
            templateUrl: 'views/friends/friends.html',
            controller: 'FriendsCtrl'
        })
        .when('/newvideo', {
            templateUrl: 'views/newvideo/newvideo.html',
            controller: 'NewVideosCtrl'
        })
        .when('/addon', {
            templateUrl: 'views/addon/addon.html',
            controller: 'AddonCtrl'
        })
        .when('/myroles', {
            templateUrl: 'views/myprofile/myroles.html',
            controller: 'RoleCtrl'
        })

        .when('/friends', {
            templateUrl: 'views/friends/friends.html',
            controller: 'FriendsCtrl'
        })
        .when('/searchfriends', {
            templateUrl: 'views/friends/research.html',
            controller: 'FriendsCtrl'
        })
        .when('/mypictures', {
            templateUrl: 'views/mypictures/mypictures.html',
            controller: 'MyPicturesCtrl'
        }).otherwise({
            redirectTo: '/home'
        });
    ;


}]);
