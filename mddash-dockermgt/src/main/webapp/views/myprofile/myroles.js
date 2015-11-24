'use strict';

var mod = angular.module('myApp.myroles', ['ngRoute', 'ngMockE2E']);

mod
    .run(function ($httpBackend) {


        if (TEST) {
            $httpBackend
                .when('GET', PREFIX_RQ + '/api/app/account/role')
                .respond(
                function (method, url, data, headers) {
                    var data = '{"roles":{"role":[{"id":1,"name":"Family","type":"Social","permission":[{"id":1,"action":"Read","object":"Read content"},{"id":2,"action":"Comment","object":"Comment content"},{"id":3,"action":"Post","object":"Post content"},{"id":4,"action":"Delete","object":"Delete content"}]},{"id":2,"name":"Friends","type":"Social","permission":[{"id":3,"action":"Post","object":"Post content"},{"id":4,"action":"Delete","object":"Delete content"}]},{"id":3,"name":"Public","type":"Social","permission":[{"id":4,"action":"Delete","object":"Delete content"},{"id":5,"action":"Contact","object":"Watch contact list"}]}]}}';
                    var header = {};
                    return [200, data, {}];

                });

            $httpBackend
                .when('GET', PREFIX_RQ + '/api/app/account/permission')
                .respond(
                function (method, url, data, headers) {
                    var data = '{"permissions":{"permission":[{"id":1,"action":"Read","object":"Read content"},{"id":2,"action":"Comment","object":"Comment content"},{"id":3,"action":"Post","object":"Post content"},{"id":4,"action":"Delete","object":"Delete content"},{"id":5,"action":"Contact","object":"Watch contact list"},{"id":6,"action":"%BOXRead","object":"read stored information on the box"},{"id":7,"action":"%BOXText","object":"store text(comment,link,... ) on the box"},{"id":8,"action":"%BOXContent","object":"store content(video, picture,...) on the box"},{"id":9,"action":"%BOXContact","object":"Can add relation"}]}}';
                    var header = {};
                    return [200, data, {}];

                });

            $httpBackend.when('POST', /api\/app\/account\/role\/[^//]+$/).respond(
                function (method, url, data, headers) {
                  return [200,"", {}];
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
    .controller('RoleCtrl', [function () {

    }])
    .controller('MyRolesController', ['$scope', '$http', '$window', '$modal', '$log', function ($scope, $http, $window, $modal, $log) {

        var roles = this;

        roles.list = [];
        roles.roles = [];  // List of role
        roles.permissions = [];

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
                                roles.list.push(data.roles.role);
                        }
                        else {
                            roles.list = $.grep(data.roles.role, function (o) {
                                return o.type === "Social"
                            });
                            console.log(roles.list)
                        }
                    }

                })
                .error(function (data, status, headers, config) {
                    console.log("Failed while getting roles Informations");
                })
        };
        this.generateLink = function (role) {
            if (role.status == 1) {
                return role.link + "/original.jpg";
            }
            else {
                return "";
            }
        };
        this.addRole = function (rolename) {
            $http.post(PREFIX_RQ + "/api/app/account/role/" + rolename)
                .success(function () {

                    console.log("success");
                    var r = {"name": rolename, "type": "Social"};
                    roles.list.push(r);
                })
                .error(function () {
                    console.log("error");
                });
            
        };
        this.getIndex = function (role) {
            return roles.list.indexOf(role);
        }


        // **** Function to update a role
        this.updateRole = function (role) {
            var data = {"role": role};
            $http.put(PREFIX_RQ + "/api/app/account/role/" + role.name, data)
                .success(function () {

                    console.log("success");
                })
                .error(function () {
                    console.log("error");
                });
        }

        // ***** Remove a role *****
        this.delete = function (role) {
            $http.delete(PREFIX_RQ + "/api/app/account/role/" + role.name)
                .success(function (data, status, headers, config) {
                    var index = roles.getIndex(role);
                    if (index > -1) {
                        roles.list.splice(index, 1);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("Failed");
                });
        }

        // ***************** Get Permission list ****************

        this.getPermissionList = function () {
            $http.get(PREFIX_RQ + "/api/app/account/permission")
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    if (data.contacts !== "") {
                        if (angular.isArray(data.permissions.permission)) {
                            angular.forEach(data.permissions.permission, function (permission, key) {
                                if (permission.action.indexOf("%") != 0) {
                                    roles.permissions.push(permission);
                                }
                            })
                            // roles.permissions = data.permissions.permission;
                        } else {
                            roles.permissions.push(data.permissions.permission);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("Failed getting Friend list");
                })
        };
        this.getPermissionList();

        // ************************************************************

        this.showPermission = function (role) {
            $scope.open(role);
        }
        this.getroles();


        $scope.open = function (role, size) {
            var modalInstance = $modal.open({
                templateUrl: 'PermissionModalRole.html',
                controller: 'PermissionModalInstanceCtrl',
                size: size,
                resolve: {
                    roles: function () {
                        return roles.roles;
                    },
                    role: function () {
                        return role;
                    },
                    permissions: function () {
                        return roles.permissions;
                    }
                }
            });

            modalInstance.result.then(function (role) {
                roles.updateRole(role);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }


    }])
    .controller('PermissionModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'role', 'permissions', function ($scope, $modalInstance, roles, role, permissions) {

        $scope.permissions = angular.copy(permissions);
        if (role.permission === undefined) {
        } else {
            if (angular.isArray(role.permission)) {
                angular.forEach(role.permission, function (id) {
                    var index = searchItemIntoArrayWithAttribute($scope.permissions, "action", id.action, "");
                    if (index != null) {
                        $scope.permissions[index].value = true;
                    }
                });
            }
        }
        // console.log(roles);
        //
        //$scope.rolesUsers = angular.copy(rolesUsers);
        //if (role.permission === undefined) {
        //} else {
        //    if ( angular.isArray(role.permission) ) {
        //        angular.forEach(role.permission, function (id) {
        //            var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", id,"%");
        //            if (index!=null){
        //                $scope.rolesUsers[index].value = true;
        //            }
        //        });
        //    }
        //    else {
        //        var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", role.permission,"%");
        //        if (index!=null){
        //            $scope.rolesUsers[index].value=true;
        //        }
        //    }
        //}

        $scope.ok = function () {
            // console.log($scope.roles);
            role.permission = [];
            angular.forEach($scope.permissions, function (permission) {
                if (permission.value == true) {
                    role.permission.push(permission)
                }
            });


            $modalInstance.close(role);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);


