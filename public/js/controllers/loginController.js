
app.controller('loginController',  function($scope, $q, $http, $log, $location, authService) {
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
	    	getUserCredentials(response);
    	});	
	}

	var getUserCredentials = function(d) {
		var postData = d;
		$http.post(LOGIN_URL, postData)
			.success(loginSuccess)
			.error(loginFail);
	}

	var loginSuccess = function(data) {
		$scope.loggedIn = true;
		authService.setUser(data);
		$location.path('/dashboard');
	}

	var loginFail = function(data, status, headers, config) {
		$log.error('login error')
	}

	fbInit(document, 'script', 'facebook-jssdk');
});

