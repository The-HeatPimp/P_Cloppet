var myApp = angular.module('myApp', ['ngCookies']);
// Controller function and passing $http service and $scope var.

myApp.controller('postController', function($scope, $http, $cookies, $location) {
	// create a blank object to handle form data.
	$scope.user = {};
	$scope.talk = {};
	$scope.content = {};
	$scope.modaleHide = {};

	if ($cookies.get('token')) {
		$scope.connected = true;
		// linkToken($cookies.get('token'));
		if ($cookies.get('admin')) {
			$scope.admin = $cookies.get('admin');
		}
	}

	$scope.signout = function() {
		$cookies.remove('token');
		console.log('removing');
		$scope.connected = false;
		$cookies.remove('admin');
		$scope.admin = false;
	};
	// calling our submit function.
	$scope.signin = function() {
		// Posting data to php file
		$http({
				method: 'POST',
				url: '/api/authenticate',
				data: $scope.user, //forms user object
				headers: {
					'Content-Type': 'application/json'
				}
			})
			.success(function(data) {
				// Stores the token until the user closes the browser window.
				if (data.success === false) {
					$scope.message = data.message;
				} else {
					var expireDate = new Date();
					expireDate.setDate(expireDate.getDate() + 1);
					// Setting a cookie
					$cookies.put('token', data.token, {
						'expires': expireDate
					});

					$scope.connected = true;
					$cookies.put('admin', data.admin, {
						'expires': expireDate
					});
					$scope.admin = data.admin;
					// linkToken(data.token);
					$(function() {
						$('#Connexion-form').modal('hide');
					});


				}
			});
	};
	$scope.$watch($scope.connected, linkToken);

	function linkToken() {
		if($scope.connected) 
		$scope.paramToken = '?token=' + $cookies.get('token');
	}
	

	// $scope.talkToRestricted = function(talk, content) {
	// 	var token = getToken();
	// 	if (token) {
	// 		$http({
	// 			method: talk.method,
	// 			url: 'api/' + talk.url,
	// 			data: content.data,
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				'x-access-token': token
	// 			}
	// 		}).success(function(data) {
	// 			return data;
	// 		});
	// 	}
	// };


	$scope.getToken = function() {
		var tokenCookie = $cookies.get('token');
		if (tokenCookie) {
			return tokenCookie;
		} else {
			return false;
		}
	};

	$scope.accessPanel = function() {
		var token = $cookies.get('token');
		$http({
			method: 'GET',
			url: '/api/admin',

			headers: {
				'Content-Type': 'application/json',
				'x-access-token': token
			}
		}).success(function(data) {

		});
		// 			return data;}
		$location.path('/newValue');
	};


	
});

//  app.controller('mycontroller', function($route, RequirementsService, DegreesService, DegreeCategoriesService, DetailsService, ProgramsService, $scope, $modal, $log, $http) {
//     ProgramsService.getItems(function(data){
//   $scope.programs  = data;
//   console.log(data);
// });

//     $scope.addDegree = function(degree) {
//       var variablesToSend =   {
//                                  "acad_program_type": degree.acad_program_type,
//                                       "program_title": degree.program_title, 

//                                   }
//                               }
//       $http.post('/api/studentacademicprogram/', variablesToSend).then(function(response){
//           console.log(response);
//           alert('post added');
//           $route.reload();
//       }, function(response){
//           console.log(response);
//           alert('post not added');
//       });
//     };
//     
 //     $(function linkToken(token) {

	// 	$('a[href]').each(function() {
	// 		var elem = $(this),
	// 			parts = elem.attr('href').split('#'),
	// 			hasQueryString = parts[0].indexOf('?') > -1;
	// 		if (parts[0].length > 0) {
	// 			parts[0] = parts[0] + (hasQueryString ? '&' : '?') + 'token=' + tokenStr;
	// 		}
	// 		elem.attr('href', (parts.length > 1 ? parts.join('#') : parts.join()));
	// 	});
	// });
	// 




