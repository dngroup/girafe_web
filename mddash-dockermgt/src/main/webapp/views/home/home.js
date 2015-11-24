'use strict';
var home = angular.module('myApp.home', ['ngRoute', 'ui.bootstrap', 'ngMockE2E'])
home.run(function ($httpBackend) {

    // returns the current list of phones
    if (TEST) {

        $httpBackend
            .when('GET', /^\/api\/app\/content\/wall.rss$/)
            .respond(
            function (method, url, data, headers) {
                var data = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><title>Medi@home</title><link rel="alternate" href="http://10.211.55.5:9998" /><subtitle>RSS Feed</subtitle><updated>2015-07-15T08:07:18Z</updated><dc:date>2015-07-15T08:07:18Z</dc:date><entry><title>moi.png</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:3" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="image/png" scheme="http://10.211.55.5:9998/api/app/content/image" /><author><name>ad13fe72-5830-4057-9991-689091a467bf</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:3</id><updated>2015-07-14T10:14:48Z</updated><published>2015-07-14T10:14:48Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-14T10:14:48Z</dc:date></entry><entry><title>3840x2400.jpg</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:4" /><link rel="enclosure" type="application" href="/dev/picture/small.jpg" /><category term="image/jpeg" scheme="http://10.211.55.5:9998/api/app/content/image" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:4</id><updated>2015-07-12T10:14:40Z</updated><published>2015-07-12T10:14:40Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-12T10:14:40Z</dc:date></entry><entry><title>38.exe</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:5" /><link rel="enclosure" type="application" href="/assets/img/file.png" /><category term="application/octet-stream" scheme="http://10.211.55.5:9998/api/app/content/cloud" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:5</id><updated>2015-07-06T10:14:40Z</updated><published>2015-07-06T10:14:40Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-06T10:14:40Z</dc:date></entry><entry><title>eirb-mmk.mp4</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:7" /><link rel="enclosure" type="video" href="/dev/videos/folder.jpg" /><category term="video/mp4" scheme="http://10.211.55.5:9998/api/app/content/video" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:7</id><updated>2015-07-05T10:14:33Z</updated><published>2015-07-05T10:14:33Z</published><content type="status">-1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-05T10:14:33Z</dc:date></entry><entry><title>eirb-mmk2.mp4</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:8" /><link rel="enclosure" type="video" href="/dev/picture/small.jpg" /><category term="video/ogg" scheme="http://10.211.55.5:9998/api/app/content/video" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:8</id><updated>2015-07-04T10:14:33Z</updated><published>2015-07-04T10:14:33Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-04T10:14:33Z</dc:date></entry><entry><title>ME.mp3</title><link rel="alternate" href="/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:9" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="audio/mpeg" scheme="http://10.211.55.5:9998/api/app/content/audio" /><author><name>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</name><uri>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</uri></author><id>/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:9</id><updated>2015-06-25T18:36:35Z</updated><published>2015-06-25T18:36:35Z</published><content type="status">1</content><summary type="text/plain" /><dc:creator>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</dc:creator><dc:date>2015-06-25T18:36:35Z</dc:date></entry><entry><title>ME2.mp3</title><link rel="alternate" href="/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:10" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="audio/mpeg" scheme="http://10.211.55.5:9998/api/app/content/audio" /><author><name>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</name><uri>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</uri></author><id>/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:10</id><updated>2015-06-25T17:36:35Z</updated><published>2015-06-25T17:36:35Z</published><content type="status">0</content><summary type="text/plain" /><dc:creator>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</dc:creator><dc:date>2015-06-25T17:36:32Z</dc:date></entry></feed>'
                // headers('Content-Type')=application/json;
                // var headers =
                // '{"headers":{"Content-Type":"application/json"}}'

                return [200, data, [{'Content-Type': 'application/xml'}]];

            });
        $httpBackend
            .when('GET', /^\/api\/app\/content\/wallForcedUpdate.rss$/)
            .respond(
            function (method, url, data, headers) {
                var data = '<?xml version="1.0" encoding="UTF-8"?>' +
                    '<feed xmlns="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><title>Medi@home</title><link rel="alternate" href="http://10.211.55.5:9998" /><subtitle>RSS Feed</subtitle><updated>2015-07-15T08:07:18Z</updated><dc:date>2015-07-15T08:07:18Z</dc:date><entry><title>moi.png</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:3" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="image/png" scheme="http://10.211.55.5:9998/api/app/content/image" /><author><name>ad13fe72-5830-4057-9991-689091a467bf</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:3</id><updated>2015-07-14T10:14:48Z</updated><published>2015-07-14T10:14:48Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-14T10:14:48Z</dc:date></entry><entry><title>3840x2400.jpg</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:4" /><link rel="enclosure" type="application" href="/dev/picture/small.jpg" /><category term="image/jpeg" scheme="http://10.211.55.5:9998/api/app/content/image" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:4</id><updated>2015-07-12T10:14:40Z</updated><published>2015-07-12T10:14:40Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-12T10:14:40Z</dc:date></entry><entry><title>38.exe</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:5" /><link rel="enclosure" type="application" href="/assets/img/file.png" /><category term="application/octet-stream" scheme="http://10.211.55.5:9998/api/app/content/cloud" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:5</id><updated>2015-07-06T10:14:40Z</updated><published>2015-07-06T10:14:40Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-06T10:14:40Z</dc:date></entry><entry><title>eirb-mmk.mp4</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:7" /><link rel="enclosure" type="video" href="/dev/videos/folder.jpg" /><category term="video/mp4" scheme="http://10.211.55.5:9998/api/app/content/video" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:7</id><updated>2015-07-05T10:14:33Z</updated><published>2015-07-05T10:14:33Z</published><content type="status">-1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-05T10:14:33Z</dc:date></entry><entry><title>eirb-mmk2.mp4</title><link rel="alternate" href="/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:8" /><link rel="enclosure" type="video" href="/dev/picture/small.jpg" /><category term="video/ogg" scheme="http://10.211.55.5:9998/api/app/content/video" /><author><name>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</name><uri>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</uri></author><id>/detail:58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762:8</id><updated>2015-07-04T10:14:33Z</updated><published>2015-07-04T10:14:33Z</published><content type="status">1</content><summary type="text" /><dc:creator>58e4ecc2-2e17-4a86-9ad6-1bcaf68ba762</dc:creator><dc:date>2015-07-04T10:14:33Z</dc:date></entry><entry><title>ME.mp3</title><link rel="alternate" href="/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:9" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="audio/mpeg" scheme="http://10.211.55.5:9998/api/app/content/audio" /><author><name>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</name><uri>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</uri></author><id>/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:9</id><updated>2015-06-25T18:36:35Z</updated><published>2015-06-25T18:36:35Z</published><content type="status">1</content><summary type="text/plain" /><dc:creator>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</dc:creator><dc:date>2015-06-25T18:36:35Z</dc:date></entry><entry><title>ME2.mp3</title><link rel="alternate" href="/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:10" /><link rel="enclosure" type="image" href="/dev/picture/small.jpg" /><category term="audio/mpeg" scheme="http://10.211.55.5:9998/api/app/content/audio" /><author><name>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</name><uri>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</uri></author><id>/detail:ad9779ef-992e-4841-b4c5-f6f7e8cd8a56:10</id><updated>2015-06-25T17:36:35Z</updated><published>2015-06-25T17:36:35Z</published><content type="status">0</content><summary type="text/plain" /><dc:creator>ad9779ef-992e-4841-b4c5-f6f7e8cd8a56</dc:creator><dc:date>2015-06-25T17:36:32Z</dc:date></entry></feed>'
                // headers('Content-Type')=application/json;
                // headers('Content-Type')=application/json;
                // var headers =
                // '{"headers":{"Content-Type":"application/json"}}'

                return [200, data, [{'Content-Type': 'application/xml'}]];

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


home.controller('HomeCtrl', [function ($scope, $http) {


}]);


home.controller('HomeController', ['$scope', '$http', '$window', '$q', '$location', '$modal',
    function ($scope, $http, $window, $q, $location, $modal) {

        var rssFeed = this;
        rssFeed.contact = [];
        rssFeed.rolesUsers = [];


        this.getContactList = function () {
            var http1 = $http.get(PREFIX_RQ + "/api/app/relation")
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    if (data.contacts !== "") {
                        var contact = [];
                        if (angular.isArray(data.contacts.contact) == false) {
                            rssFeed.contact.push(data.contacts.contact);
                        }
                        else {
                            angular.extend(rssFeed.contact, data.contacts.contact);
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log("Failed getting Contact list");
                })

            var http2 = $http.get(PREFIX_RQ + "api/app/account")
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    var userContact = [];
                    userContact.actorID = "YOU";
                    userContact.uuid = data.user.uuid;
                    userContact.firstname = "YOU";
                    userContact.surname = "YOU";
                    rssFeed.contact.push(userContact);
                })
                .error(function (data, status, headers, config) {
                    console.log("Failed getting your information");
                });
            $q.all([http1, http2]).then(function () {
                rssFeed.getVideos("wall.rss")

            });
        };

        this.getVideos = function (wall) {


            $http.get(PREFIX_RQ + "/api/app/content/" + wall)
                .success(function (data, status, headers, config) {
                    if (headers('Content-Type') != null) {
                        if (headers('Content-Type').indexOf("text/html") == 0) {
                            window.location.replace("/");
                        }
                    }
                    var x2js = new X2JS();
                    var json = x2js.xml_str2json(data);
                    if (angular.isArray(json.feed.entry) == false) {
                        var entry = json.entry;
                        json.feed.entry = [];
                        json.feed.entry.push(entry)
                    }
                    rssFeed.feed = json.feed;


                    angular.forEach(rssFeed.feed.entry, function (entrie) {
                        var type = entrie.category._term.split("/");
                        entrie.category._term = type;
                        var date = new Date(entrie.published);
                        console.log(date);
                        entrie.published = date;


                        var index = searchItemIntoArrayWithAttribute(rssFeed.contact, "uuid", entrie.author.name, "");
                        if (index != null) {
                            entrie.author.name = rssFeed.contact[index].firstname;
                            console.log(rssFeed.contact[index].firstname);
                        }

                    });

                    console.log("success to get wall");

                })
                .error(function (data, status, headers, config) {
                    console.log("Failed while getting wall Informations");
                })
        };

        this.getPreviewLink = function (entrie) {
            if (entrie.link.length >= 2) {
                var link = entrie.link[1];
                return link._href;
            }
            return "/assets/img/file.png";
        };

        this.getStatus = function (entrie) {
            if (entrie.content.__text == 1) {
                return "";
            }
            else if (entrie.content.__text == -1) {
                return "error";
            }
            else {
                return "disabled";
            }
        };

        this.getContactList();

        this.updateForced = function () {
            this.getVideos("wallForcedUpdate.rss");
        };


        this.predicate = 'published';
        this.reverse = true;
        this.order = function (predicate) {
            rssFeed.reverse = (rssFeed.predicate === predicate) ? !rssFeed.reverse : false;
            rssFeed.predicate = predicate;
        };

        this.print = function () {
            console.log("predicate =" + this.predicate + " reverse = " + this.reverse);
        };

        this.dateShow = function (entity, entityold) {
            if (this.predicate != 'published') {
                return false;
            }

            if (angular.isUndefined(entityold)) {
                return true;
            }
            if (entity.published.getDate() - entityold.published.getDate() != 0) {
                console.log(entity.published.getDate() + entityold.published.getDate());
                return true;
            }
            else {
                return false;
            }

        };


        this.showDetails = function (entity) {
            console.log("clic ...");
            //detail.ActorId = function () {
            //    var actorID = $routeParams.ActorId;
            //    if (angular.isUndefined(actorID)) {
            //       ;
            //    }
            //    return actorID;
            //}
            //
            //
            //detail.ContentId = function () {
            //    var contentId = $routeParams.ContentId;
            //    if (angular.isUndefined(actorID)) {
            //        contentId = entity;
            //    }
            //    return contentId;
            //}
            var actorID = entity.author.uri
            return '/detail'
            //$location.path('/detail');
            // $scope.changeView("/detail");
        }


        $scope.changeView = function (path) {

            $location.path(path); // path not hash
        };


        this.openShort = function () {
            $scope.open("short");
        };
				
				 this.showSearchField = function () {
					 // $('#homeSub input').val("");
					 // searchText.clear();
					 $scope.searchQuery = "";
            $("#homeSub").toggleClass('subStandard subSearch');
        };


        $scope.open = function (type, size) {
            if (type == "short")
                var modalInstance = $modal.open({
                    templateUrl: 'ShortModalContent.html',
                    controller: 'ShortModalContentCtrl',
                    size: size,
                  
                });

            modalInstance.result.then(function (video) {
                videos.updateContent(video);
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }
]);
//
//
home.controller('ShortModalContentCtrl', ['$scope', '$modalInstance',
    function ($scope, $modalInstance) {

        var short = this;

        var test = "blabla"
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

home.controller('VideosModalInstanceCtrl', ['$scope', '$modalInstance', 'roles', 'video', 'rolesUsers',
    function ($scope, $modalInstance, roles, video, rolesUsers) {

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
