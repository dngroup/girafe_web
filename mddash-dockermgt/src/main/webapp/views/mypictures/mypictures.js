'use strict';

angular.module('myApp.mypictures', ['ngRoute', 'ui.bootstrap'])



    .controller('MyPicturesCtrl', [function ($scope, $http) {


    }])

    .controller('MyPicturesController', ['$scope', '$http', '$window', '$modal', '$log', function ($scope, $http, $window, $modal, $log) {

        var pictures = this;

        pictures.list = [];
        pictures.roles = [];
        //                   {"roleID":"Public" , "roleName":"public", "info":"Seen by all your relations"},
        //                   {"roleID":"Family" , "roleName":"Family", "info":"Seen by all your family only"},
        //                   {"roleID":"Friends" , "roleName":"Friends", "info":"Seen by all your friends only"},
        //                   {"roleID":"Pro" , "roleName":"Pro", "info":"Seen by all your professional contacts"},
        //];  // List of role
        pictures.rolesUsers = [];


        this.getPictures = function () {
            $http.get(PREFIX_RQ + "/api/app/content")
                .success(function (data, status, headers, config) {

                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    if (data.contents !== "") {
                        if (angular.isArray(data.contents.content) == false) {
                            if (data.contents.content.type === "image")
                                pictures.list.push(data.contents.content);
                        }
                        else {
                            pictures.list = $.grep(data.contents.content, function (o) {
                                return o.type === "image"
                            });
                        }
                    }

                })
                .error(function (data, status, headers, config) {
                    console.log("Failed while getting Pictures Informations");
                })
        };
        this.generateLink = function (content) {
            if (content.status == 1) {
                return content.link + "/original.jpg";
            }
            else {
                return "";
            }
        };
        this.pictureInProgress = function (content) {
            if (content.status == 1) {
                return "";
            }
            else {
                return "disabled";
            }
        };
        this.getIndex = function (content) {
            return pictures.list.indexOf(content);
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

        // ***** Remove a picture *****
        this.removePicture = function (content) {
            $http.delete(PREFIX_RQ + "/api/app/content/" + content.contentsID)
                .success(function (data, status, headers, config) {
                    var index = pictures.getIndex(content);
                    if (index > -1) {
                        pictures.list.splice(index, 1);
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
                                pictures.roles.list.push(data.roles.role);
                        }
                        else {
                            pictures.roles.list = $.grep(data.roles.role, function (o) {
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
                            pictures.rolesUsers.push(data.contacts.contact);
                        }
                        else {
                            pictures.rolesUsers = data.contacts.contact;
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
        this.getPictures();


        $scope.open = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'PicturesModalContent.html',
                controller: 'PicturesModalInstanceCtrl',
                size: size,
                resolve: {
                    roles: function () {
                        return pictures.roles;
                    },
                    picture: function () {
                        return content;
                    },
                    rolesUsers: function () {
                        return pictures.rolesUsers;
                    }
                }
            });

            modalInstance.result.then(function (picture) {
                pictures.updateContent(picture);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


    }])
    .controller('PicturesModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'picture', 'rolesUsers', function ($scope, $modalInstance, roles, picture, rolesUsers) {

        $scope.roles = angular.copy(roles.list);
        if (picture.metadata === undefined) {
        } else {
            if (angular.isArray(picture.metadata)) {
                angular.forEach(picture.metadata, function (metadata) {
                    var index = searchItemIntoArrayWithAttribute($scope.roles, "name", metadata, "");
                    if (index != null) {
                        $scope.roles[index].value = true;
                    }
                });
            }
            else {
                var index = searchItemIntoArrayWithAttribute($scope.roles, "name", picture.metadata, "");
                if (index != null) {
                    $scope.roles[index].value = true;
                }
            }
        }
        // console.log(roles);

        $scope.rolesUsers = angular.copy(rolesUsers);
        if (picture.permission === undefined) {
        } else {
            if (angular.isArray(picture.permission)) {
                angular.forEach(picture.permission, function (id) {
                    var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", id, "%");
                    if (index != null) {
                        $scope.rolesUsers[index].value = true;
                    }
                });
            }
            else {
                var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", picture.permission, "%");
                if (index != null) {
                    $scope.rolesUsers[index].value = true;
                }
            }
        }

        $scope.ok = function () {
            // console.log($scope.roles);
            picture.metadata = [];
            angular.forEach($scope.roles, function (role) {
                if (role.value == true) {
                    picture.metadata.push(role.name)
                }
            });
            angular.forEach($scope.rolesUsers, function (roleUser) {
                if (roleUser.value == true) {
                    picture.metadata.push("%" + roleUser.uuid)
                }
            });

            $modalInstance.close(picture);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
