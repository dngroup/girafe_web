'use strict';
var mod = angular.module('myApp.myvideos', ['ngRoute', 'ui.bootstrap', 'ngMockE2E'])
mod.run(function ($httpBackend) {

    // returns the current list of phones
    if (TEST) {

        $httpBackend
            .when('GET', /^\/api\/app\/content$/)
            .respond(
            function (method, url, data, headers) {
                var data = '{ "contents": { "content": [ {"contentsID": "1d3742b64cb04324b5ba68f9ce5ee48f","name": "holiday.mp4", "actorID": "test@test.fr","metadata": ["Family", "Pro"],"unix_time": "1430376221","link": "/dev/videos","status": 1,"type": "video" }, { "contentsID": "120d1872788b4f908666bf3020e72119","name": "week.mp4", "actorID": "test@test.fr","unix_time": "1430377750","link": "/dev/videos","status": 0,"type": "video" }, { "contentsID": "7ad7ac91918246b29262dcdcca317eb5","name": "doc.pdf", "actorID": "test@test.fr","unix_time": "1430378104","link": "/dev/document","status": 3,"type": "application" }, { "contentsID": "ff0a9ae6265e41e1a7dae732d2630134","name": "info.jpg", "actorID": "test@test.fr","unix_time": "1430378104","link": "/dev/picture","status": 1,"type": "image" }, { "contentsID": "f8224d615764402f88c0686653e99a65","name": "parameter.txt","actorID": "test@test.fr","unix_time": "1430378145","link": "/dev/document","status": 1, "type": "application" }, {"contentsID": "f97103baf72344309fc1c04c0b87aea5","name": "me.jpg","actorID": "test@test.fr","unix_time": "1430378145","link": "/dev/picture","status": 1,"type": "image", "metadata": ["Public","Family"] } ] } }'
                // headers('Content-Type')=application/json;
                // var headers =
                // '{"headers":{"Content-Type":"application/json"}}'

                return [200, data, [{'Content-Type': 'application/json'}]];

            });

        $httpBackend.when('DELETE', /api\/app\/content\/[^//]+$/)
            .respond(
            function (method, url, data, headers) {
                return [200, {}, {}];
            });

        $httpBackend.when('PUT', /api\/app\/content\/[^//]+$/)
            .respond(
            function (method, url, data, headers) {
                return [200, {}, {}];
            });


        $httpBackend.whenGET(/views/).passThrough();
    }
    else {
        $httpBackend.whenGET(/.*/).passThrough();
        $httpBackend.whenPUT(/.*/).passThrough();
        $httpBackend.whenDELETE(/.*/).passThrough();
        $httpBackend.whenPOST(/.*/).passThrough();
    }

});


mod.controller('MyVideosCtrl', [function ($scope, $http) {


}]);

mod.controller('MyVideosController', ['$scope', '$http', '$window', '$modal', '$log', function ($scope, $http, $window, $modal, $log) {

    var videos = this;

    // Determine the right steraming protocol.
    var userAgent = $window.navigator.userAgent;
    console.log(userAgent);
    if (userAgent.indexOf("Chrome") >= 0 || userAgent.indexOf("Windows") >= 0 || userAgent.indexOf("Chromium") >= 0) {
        videos.prefix = 'dash';
        videos.suffix = 'dash/playlist.mpd';
    }
    else {
        videos.prefix = 'hls';
        videos.suffix = 'hls/playlist.m3u8';
    }


    videos.list = [];
    //videos.roles = [
    //                {"roleID":"Public" , "roleName":"public", "info":"Seen by all your relations"},
    //                {"roleID":"Family" , "roleName":"Family", "info":"Seen by all your family only"},
    //                {"roleID":"Friends" , "roleName":"Friends", "info":"Seen by all your friends only"},
    //                {"roleID":"Pro" , "roleName":"Pro", "info":"Seen by all your professional contacts"},
    //                ];  // List of role
    videos.roles = [];

    videos.rolesUsers = [];


    this.getVideos = function () {
        $http.get(PREFIX_RQ + "/api/app/content")
            .success(function (data, status, headers, config) {
                if (headers('Content-Type') != null) {
                	if (headers('Content-Type').indexOf("text/html") == 0) {
                		window.location.replace("/");
                	}
                }
                if (data.contents !== "") {
                	if (angular.isArray(data.contents.content) == false) {
                		if (data.contents.content.type.indexOf("video") > -1)
                			videos.list.push(data.contents.content);
                	}
                	else {
                		videos.list = $.grep(data.contents.content, function (o) {
                			return o.type.indexOf("video") > -1
                		});
                	}
                }

            })
            .error(function (data, status, headers, config) {
                console.log("Failed while getting Videos Informations");
            })
    };
    this.generateLink = function (content) {
        if (content.status == 1) {
        	console.log("LINK IS " + videos.prefix + ".html?url=" + content.link + "/" + videos.suffix);
            return videos.prefix + ".html?url=" + content.link + "/" + videos.suffix;
        }
        else {
            return "";
        }
    };
    this.videoInProgress = function (content) {
        if (content.status == 1) {
            return "";
        }
        else {
            return "disabled";
        }
    };
    this.getIndex = function (content) {
        return videos.list.indexOf(content);
    }


    // **** Function to update a content
    this.updateContent = function (content) {
        var data = {"content": content};
        $http.put(PREFIX_RQ + "/api/app/content/" + content.contentsID, data)
            .success(function () {
                console.log("success");
            })
            .error(function () {
                console.log("error");
            });
    }

    // ***** Remove a video *****
    this.removeVideo = function (content) {
        $http.delete(PREFIX_RQ + "/api/app/content/" + content.contentsID)
            .success(function (data, status, headers, config) {
                var index = videos.getIndex(content);
                if (index > -1) {
                    videos.list.splice(index, 1);
                }
            })
            .error(function (data, status, headers, config) {
                console.log("Failed");
            });
    }

    // ***************** Get RoleList****************


    this.getroles = function () {
        $http.get(PREFIX_RQ + "/api/app/account/role")
            .success(function (data, status, headers, config) {

                if (headers('Content-Type') != null) {
                    if (headers('Content-Type').indexOf("text/html") == 0) {
                        window.location.replace("/");
                    }
                }
                if (data.roles !== "") {
                    if (angular.isArray(data.roles.role) == false) {
                        if (data.roles.role.type === "Social")
                            videos.roles.list.push(data.roles.role);
                    }
                    else {
                        videos.roles.list = $.grep(data.roles.role, function (o) {
                            return o.type === "Social"
                        });
                        console.log(data.roles.list)
                    }
                }

            })
            .error(function (data, status, headers, config) {
                console.log("Failed while getting roles Informations");
            })
    };
    this.getroles();

    // ***************** Get FriendList ****************

    this.getPermissionList = function () {
        $http.get(PREFIX_RQ + "/api/app/relation")
            .success(function (data, status, headers, config) {
                if (headers('Content-Type') != null) {
                    if (headers('Content-Type').indexOf("text/html") == 0) {
                        window.location.replace("/");
                    }
                }
                if (data.contacts !== "") {
                    if (angular.isArray(data.contacts.contact) == false) {
                        videos.rolesUsers.push(data.contacts.contact);
                    }
                    else {
                        videos.rolesUsers = data.contacts.contact;
                    }
                }
            })
            .error(function (data, status, headers, config) {
                console.log("Failed getting Friend list");
            })
    };
    this.getPermissionList();

    // ************************************************************

    this.showDetails = function (content) {
        $scope.open(content);
    }
    this.getVideos();


    $scope.open = function (content, size) {
        var modalInstance = $modal.open({
            templateUrl: 'VideosModalContent.html',
            controller: 'VideosModalInstanceCtrl',
            size: size,
            resolve: {
                roles: function () {
                    return videos.roles;
                },
                video: function () {
                    return content;
                },
                rolesUsers: function () {
                    return videos.rolesUsers;
                }
            }
        });

        modalInstance.result.then(function (video) {
            videos.updateContent(video);
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    }


}]);
mod.controller('VideosModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'video', 'rolesUsers', function ($scope, $modalInstance, roles, video, rolesUsers) {

    $scope.roles = angular.copy(roles.list);
    if (video.metadata === undefined) {
    } else {
        if (angular.isArray(video.metadata)) {
            angular.forEach(video.metadata, function (metadata) {
                var index = searchItemIntoArrayWithAttribute($scope.roles, "name", metadata, "");
                if (index != null) {
                    $scope.roles[index].value = true;
                }
            });
        }
        else {
            var index = searchItemIntoArrayWithAttribute($scope.roles, "name", video.metadata, "");
            if (index != null) {
                $scope.roles[index].value = true;
            }
        }
    }


    $scope.rolesUsers = angular.copy(rolesUsers);
    if (video.permission === undefined) {
    } else {
        if (angular.isArray(video.permission)) {
            angular.forEach(video.permission, function (id) {
                var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", id, "%");
                if (index != null) {
                    $scope.rolesUsers[index].value = true;
                }
            });
        }
        else {
            var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", video.permission, "%");
            if (index != null) {
                $scope.rolesUsers[index].value = true;
            }
        }
    }

    // var a =
    // angular.element(document.getElementById('FriendsListController')).scope().friends;
    // $scope.rolesUser = angular.copy($Friends.frie);
    // console.log(roles);

    $scope.ok = function () {
        // console.log($scope.roles);
        video.metadata = [];
        angular.forEach($scope.roles, function (role) {
            if (role.value == true) {
                video.metadata.push(role.name)
            }
        });
        angular.forEach($scope.rolesUsers, function (roleUser) {
            if (roleUser.value == true) {
                video.metadata.push("%" + roleUser.uuid)
            }
        });

        $modalInstance.close(video);
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}]);
mod.controller('MyVideosCtrl2', [function ($scope, $http) {


}]);