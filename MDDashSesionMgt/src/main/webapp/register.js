
PREFIX_RQ = "";
//PREFIX_RQ = "http://localhost:9998";

var RegisterForm = angular.module('RegisterForm', ['ngMockE2E','ngCookies','ngRoute']);


RegisterForm.run(function($httpBackend,$cookieStore ) {

	if (TEST){
	// returns the current list of phones	
	$httpBackend.when('POST', PREFIX_RQ + '/api/app/account/').respond(
			function(method, url, data, headers) {
					data=JSON.parse(data);
					if(data.user.userID=="testtest"){
						var user='testtest';

						//console.log(user);
						//$cookieStore.put('authentication',data.user.userID); 
						 
						return [ 403, {}, {} ];
					}
					else if(data.user.userID=="test@test.fr"){
						
						return [ 403, {}, {} ];
					}
					else{
						$cookieStore.put('authentication',data.user.userID); 
						return [ 200, {}, {} ];
						window.location.replace("/home.html");
					}
			});
	}
	else{
		$httpBackend.whenGET(/.*/).passThrough();
		$httpBackend.whenPUT(/.*/).passThrough();
		$httpBackend.whenDELETE(/.*/).passThrough();
		$httpBackend.whenPOST(/.*/).passThrough();
	}
});

RegisterForm.controller("mainController", function ($scope, $http) {

    $scope.submitData = function (person) {
        var data = {};
        data.user = person;



        $http.post(PREFIX_RQ + "/api/app/account/", data)
            .success(function (data, status, headers, config)
            {
                console.log("Succeed");
//                window.location.replace("/index.html");
                
                var data = 'j_username=' + encodeURIComponent(person.userID)
				+ '&j_password=' + encodeURIComponent(person.password)
//				+ '&remember-me=' + person.rememberMe 
				+ '&submit=Login';
				return $http.post(PREFIX_RQ + '/api/authentication', data, {
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function(response) {
					
					window.location.replace("/home.html");
					return response;
				}).error(function(response) {
					console.log("Failed");
					errorConnection=false;
				});
                
                
            })
            .error(function (data, status, headers, config)
            {
                console.log("Failed");
            });
    };
   // $(document) Jquery for validating the form -->
    angular.element(document).ready(function(){
        $("form").validate({
            rules: {
                name:{
                    minlength: 3,
                    maxlength: 20,
                    required: true
                },
                email:{
                    minlength: 3,
                    maxlength: 20,
                    required: true
                }
            },
            highlight: function (element) {
                $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
            },
            unhighlight: function (element) {
                $(element).closest('.form-group').removeClass('has-error').addClass('has-success');
            }
        });
    });

    // End of js part for validating the form inputs


});