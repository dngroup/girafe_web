'use strict';

var mod = angular.module('myApp.newvideo', [ 'ngRoute', 'angularFileUpload',
		'ngMockE2E' ])
mod.run(function($httpBackend) {

	// returns the current list of phones

	if (TEST) {

		$httpBackend.when('POST', /api\/app\/[^//]+\/content$/).respond(
				function(method, url, data, headers) {
					return [ 200, {}, {} ];
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

.controller('NewVideosCtrl', [ function($scope, $http) {

} ])

.controller(
		'NewVideoController',
		[
				'$scope',
				'FileUploader',
				function($scope, FileUploader) {

					var uploader = $scope.uploader = new FileUploader({
						url : PREFIX_RQ + '/api/app/content'
					});

					// FILTERS

					uploader.filters
							.push({
								name : 'customFilter',
								fn : function(item /* {File|FileLikeObject} */,
										options) {
									return this.queue.length < 10;
								}
							});

					// CALLBACKS

					uploader.onWhenAddingFileFailed = function(
							item /* {File|FileLikeObject} */, filter, options) {
						console.info('onWhenAddingFileFailed', item, filter,
								options);
					};
					uploader.onAfterAddingFile = function(fileItem) {
						console.info('onAfterAddingFile', fileItem);
					};
					uploader.onAfterAddingAll = function(addedFileItems) {
						console.info('onAfterAddingAll', addedFileItems);
					};
					uploader.onBeforeUploadItem = function(item) {
						console.info('onBeforeUploadItem', item);
					};
					uploader.onProgressItem = function(fileItem, progress) {
						console.info('onProgressItem', fileItem, progress);
					};
					uploader.onProgressAll = function(progress) {
						console.info('onProgressAll', progress);
					};
					uploader.onSuccessItem = function(fileItem, response,
							status, headers) {
						console.info('onSuccessItem', fileItem, response,
								status, headers);
					};
					uploader.onErrorItem = function(fileItem, response, status,
							headers) {
						console.info('onErrorItem', fileItem, response, status,
								headers);
					};
					uploader.onCancelItem = function(fileItem, response,
							status, headers) {
						console.info('onCancelItem', fileItem, response,
								status, headers);
					};
					uploader.onCompleteItem = function(fileItem, response,
							status, headers) {
						console.info('onCompleteItem', fileItem, response,
								status, headers);
					};
					uploader.onCompleteAll = function() {
						console.info('onCompleteAll');
					};

					console.info('uploader', uploader);

				} ]);
