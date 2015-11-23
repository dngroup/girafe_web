'use strict';

angular.module('myApp.mycloud', ['ngRoute', 'ui.bootstrap'])



    .controller('MyCloudCtrl', [function ($scope, $http) {


    }])

    .controller('MyCloudController', ['$scope', '$http', '$window', '$modal', '$log', function($scope, $http, $window, $modal, $log) {

        var documents = this;

        documents.list = [];
        documents.roles = [];
        //    {"roleID":"Public" 	, "roleName":"public"	, "info":"Seen by all your relations"},
        //    {"roleID":"Family" 	, "roleName":"Family"	, "info":"Seen by all your family only"},
        //    {"roleID":"Friends" , "roleName":"Friends"	, "info":"Seen by all your friends only"},
        //    {"roleID":"Pro" 	, "roleName":"Pro"		, "info":"Seen by all your professional contacts"},
        //];  // List of role
        documents.rolesUsers = [];
        
        this.getDocuments = function() {
            $http.get(PREFIX_RQ + "/api/app/content")
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null){
			if (headers('Content-Type').indexOf("text/html")==0) {
				window.location.replace("/");
			} 
		    }
                    if ( data.contents !== "" ) {
                        if (angular.isArray(data.contents.content) == false) {
                        	if(data.contents.content.type != "image" && data.contents.content.type != "video")
                        		documents.list.push(data.contents.content);
                        }
                        else {
                            documents.list = $.grep(data.contents.content, function(o){return (o.type != "image" && o.type != "video")});
                        }
                    }

                })
                .error(function (data, status, headers, config) {
                    console.log("Failed while getting Documents Informations");
                })
        };
        this.generateLink = function(content) {
             if (content.status == 1) {
                return content.link+"/"+content.name;
            }
            else {
                return "";
            }
        };
        this.documentInProgress = function(content) {
             if (content.status == 1) {
                 return "";
             }
             else {
                return "disabled";
             }
         };
        this.getIndex = function(content) {
            return documents.list.indexOf(content);
        }


        // **** Function to update a content
        this.updateContent = function(content) {
            var data = {"content" : content};
            $http.put(PREFIX_RQ+"/api/app/content/"+content.contentsID,  data)
                .success(function() {
                
                    console.log("success");
                })
                .error(function() {
                    console.log("error");
                });
        }

        // ***** Remove a document *****
        this.removeDocument = function(content) {
            $http.delete(PREFIX_RQ + "/api/app/content/"+content.contentsID)
                .success(function(data,status,headers,config) {
                
                    var index = documents.getIndex(content);
                    if (index > -1) {
                        documents.list.splice(index, 1);
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
                                documents.roles.list.push(data.roles.role);
                        }
                        else {
                            documents.roles.list = $.grep(data.roles.role, function (o) {
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

	this.getPermissionList = function() {
		$http.get(PREFIX_RQ+"/api/app/relation")
		.success(function(data, status, headers, config) {
		    if (headers('Content-Type') != null){
			if (headers('Content-Type').indexOf("text/html")==0) {
				window.location.replace("/");
			} 
		    }
			if ( data.contacts !== "" ) {
				if (angular.isArray(data.contacts.contact) == false) {
					documents.rolesUsers.push(data.contacts.contact);
				}
				else {
					documents.rolesUsers = data.contacts.contact;
				}
			}
		})
		.error(function (data, status, headers, config){
			console.log("Failed getting Friend list");
		})
	};
	this.getPermissionList();

	// ************************************************************
	
        this.showDetails = function(content) {
            $scope.open(content);
        }
        this.getDocuments();


        $scope.open = function (content, size) {
            var modalInstance = $modal.open({
                templateUrl: 'DocumentsModalContent.html',
                controller: 'DocumentsModalInstanceCtrl',
                size: size,
                resolve: {
                	roles: function () {
                        return documents.roles;
                    },
                    document: function () {
                        return content;
                    },
                    rolesUsers: function () {
			return documents.rolesUsers;
			}
                }
            });

            modalInstance.result.then(function (document) {
                documents.updateContent(document);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }



    }])
    .controller('DocumentsModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'document','rolesUsers', function ($scope, $modalInstance, roles, document,rolesUsers) {

        $scope.roles = angular.copy(roles.list);
        if (document.metadata === undefined) {
        } else {
            if ( angular.isArray(document.metadata) ) {
                angular.forEach(document.metadata, function (metadata) {
                    var index = searchItemIntoArrayWithAttribute($scope.roles, "name", metadata,"");
                   if (index!=null){
                    $scope.roles[index].value = true;}
                });
            }
            else {
                var index = searchItemIntoArrayWithAttribute($scope.roles, "name", document.metadata,"");
                if (index!=null){
                $scope.roles[index].value=true;
                }
            }
        }
        // console.log(roles);
$scope.rolesUsers = angular.copy(rolesUsers);
	if (document.permission === undefined) {
	} else {
		if ( angular.isArray(document.permission) ) {
			angular.forEach(document.permission, function (id) {
				var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", id,"%");
				if (index!=null){
					$scope.rolesUsers[index].value = true;
				}
			});
		}
		else {
			var index = searchItemIntoArrayWithAttribute($scope.rolesUsers, "uuid", document.permission,"%");
			if (index!=null){
				$scope.rolesUsers[index].value=true;
			}
		}
	}

      $scope.ok = function () {
		// console.log($scope.roles);
		document.metadata= [];
		angular.forEach($scope.roles, function(role) {
			if (role.value == true) {
				document.metadata.push(role.name)
			}
		});
		angular.forEach($scope.rolesUsers, function(roleUser) {
			if (roleUser.value == true) {
				document.metadata.push("%"+roleUser.uuid)
			}
		});

            $modalInstance.close(document);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);
