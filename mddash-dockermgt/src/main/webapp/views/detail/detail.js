'use strict';
var detail = angular.module('myApp.detail', ['ngRoute', 'ui.bootstrap', 'ngMockE2E']);
detail.run(function ($httpBackend) {

    // returns the current list of phones
    if (TEST) {

        $httpBackend
            .when('GET', '/api/app/relation/58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762/content/3')
            .respond(
            function (method, url, data, headers) {
                var data = '{"content":{"contentsID":9,"name":"bh.png","actorID":"928f3090-1f6a-4c48-965c-12337f0c03b0","unix_time":1437125157,"link":"http:\/\/10.211.55.5:9998\/pictures\/928f3090-1f6a-4c48-965c-12337f0c03b0\/a2f9f013-491d-4bc2-9e65-a1f3f29c4d8a","previewLink":"http:\/\/10.211.55.5:9998\/pictures\/928f3090-1f6a-4c48-965c-12337f0c03b0\/a2f9f013-491d-4bc2-9e65-a1f3f29c4d8a\/small.jpg","status":1,"type":"image\/png"}}'
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



mod.controller('DetailCtrl', [function ($scope, $http) {


}]);

detail.controller('DetailController', [
    '$scope', '$http', '$window', '$modal', '$log', '$routeParams',
    function ($scope, $http, $window, $modal, $log, $routeParams) {

        var detail = this;

        // Determine the right steraming protocol.
        var userAgent = $window.navigator.userAgent;
        console.log(userAgent);
        if (userAgent.indexOf("Chrome") >= 0 || userAgent.indexOf("Windows") >= 0 || userAgent.indexOf("Chromium") >= 0) {
            detail.prefix = 'dash';
            detail.suffix = 'dash/playlist.mpd';
        }
        else {
            detail.prefix = 'hls';
            detail.suffix = 'hls/playlist.m3u8';
        }

        detail.ContentId = $routeParams.ContentId;
        detail.actorID = $routeParams.ActorId.replace(":","").replace(":","");
        detail.list = [];
        detail.roles = [];
        detail.rolesUsers = [];
        detail.one = "1";
        detail.content = [];

        this.getDetail = function () {
            $http.get(PREFIX_RQ + "/api/app/relation/" + detail.actorID + "/content/" + detail.ContentId)
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    detail.content= data.content;
                    detail.content.type= detail.content.type.split("/");
                    
                })
                .error(function (data, status, headers, config) {
                    console.log("Failed while getting Videos Informations");
                })
        };
        this.getDetail();

        this.getStatus = function (content) {
            if (content.__text == 1) {
                return "";
            }
            else if (content.__text == -1) {
                return "error";
            }
            else {
                return "disabled";
            }
        };
        //this.getDetail();
        //this.generateLink = function (content) {
        //    if (content.status == 1) {
        //        return detail.prefix + ".html?url=" + content.link + "/" + detail.suffix;
        //    }
        //    else {
        //        return "";
        //    }
        //};
        //this.videoInProgress = function (content) {
        //    if (content.status == 1) {
        //        return "";
        //    }
        //    else {
        //        return "disabled";
        //    }
        //};
        //this.getIndex = function (content) {
        //    return detail.list.indexOf(content);
        //}
        //
        //
        //// **** Function to update a content
        //this.updateContent = function (content) {
        //    var data = {"content": content};
        //    $http.put(PREFIX_RQ + "/api/app/content/" + content.contentsID, data)
        //        .success(function () {
        //            console.log("success");
        //        })
        //        .error(function () {
        //            console.log("error");
        //        });
        //}
        //
        //// ***** Remove a video *****
        //
        //
        //// ***************** Get RoleList****************
        //
        //
        //this.getroles = function () {
        //    $http.get(PREFIX_RQ + "/api/app/account/role")
        //        .success(function (data, status, headers, config) {
        //
        //            if (headers('Content-Type') != null) {
        //                if (headers('Content-Type').indexOf("text/html") == 0) {
        //                    window.location.replace("/");
        //                }
        //            }
        //            if (data.roles !== "") {
        //                if (angular.isArray(data.roles.role) == false) {
        //                    if (data.roles.role.type === "Social")
        //                        detail.roles.list.push(data.roles.role);
        //                }
        //                else {
        //                    detail.roles.list = $.grep(data.roles.role, function (o) {
        //                        return o.type === "Social"
        //                    });
        //                    console.log(data.roles.list)
        //                }
        //            }
        //
        //        })
        //        .error(function (data, status, headers, config) {
        //            console.log("Failed while getting roles Informations");
        //        })
        //};
        //this.getroles();
        //
        //// ***************** Get FriendList ****************
        //
        //this.getPermissionList = function () {
        //    $http.get(PREFIX_RQ + "/api/app/relation")
        //        .success(function (data, status, headers, config) {
        //            if (headers('Content-Type') != null) {
        //                if (headers('Content-Type').indexOf("text/html") == 0) {
        //                    window.location.replace("/");
        //                }
        //            }
        //            if (data.contacts !== "") {
        //                if (angular.isArray(data.contacts.contact) == false) {
        //                    detail.rolesUsers.push(data.contacts.contact);
        //                }
        //                else {
        //                    detail.rolesUsers = data.contacts.contact;
        //                }
        //            }
        //        })
        //        .error(function (data, status, headers, config) {
        //            console.log("Failed getting Friend list");
        //        })
        //};
        //this.getPermissionList();
        //
        //// ************************************************************
        //
        //this.showDetails = function (content) {
        //    $scope.open(content);
        //}
        //this.getVideos();


        $scope.open = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'ssModalContent.html',
                controller: 'sssModalInstanceCtrl',
                size: size,
                resolve: {
                    roles: function () {
                        return detail.roles;
                    },
                    video: function () {
                        return content;
                    },
                    rolesUsers: function () {
                        return detail.rolesUsers;
                    }
                }
            });

            modalInstance.result.then(function (video) {
                detail.updateContent(video);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


    }]);
detail.controller('detailModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'video', 'rolesUsers', function ($scope, $modalInstance, roles, video, rolesUsers) {

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