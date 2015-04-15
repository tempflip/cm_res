var app = angular.module('cmApp', []);

var LOGIN_URL = 'http://localhost:8000/login';

app.controller('loginController', ['$scope', '$q', '$http', '$log', function($scope, $q, $http, $log) {
	$scope.loggedIn = false;
	$scope.notAuthorized = false;
	userFbData = {};

	$scope.fbLogin = function(response) {
		if (response.status === 'connected') {
	    	getUserFbData();
	    } else if (response.status === 'not_authorized') {
	    	// The person is logged into Facebook, but not your app.
	    	$scope.loggedIn = false;
	    	$scope.notAuthorized = false;
	    } else {
	    	$scope.loggedIn = false;
	    }
	    $scope.$apply();
	}

	var getUserFbData = function() {
		FB.api('/me', function(response) {
			console.log('### got user data', response);
	    	getUserCredentials(response);
    	});	
	}

	var getUserCredentials = function(d) {
		var postData = d;
		var req = {
			method: 'POST',
			url: LOGIN_URL,
			headers: {
				'Content-Type': 'application/json'
			},
			data: { test: 'test' }
		}
		$http.post(LOGIN_URL, postData)
			.success(loginSuccess)
			.error(loginFail);
	}

	var loginSuccess = function(data, status, headers, config) {
		$scope.loggedIn = true;
		console.log('### got login data');
		console.log(data);
	}

	var loginFail = function(data, status, headers, config) {
		$log.error('login error')
	}

}]);

