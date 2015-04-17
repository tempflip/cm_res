app.controller('routeController', function($scope, $route, $routeParams, $location) {
	$location.path('/login');
})
.config(function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'templates/login.html',
			controller: 'loginController'
		})
		.when('/dashboard' , {
			templateUrl: 'templates/dashboard.html',
			controller : 'dashboardController'
		});
	$locationProvider.html5Mode(true);
});
