adminApp.controller('adminController',  function($scope, $q, $http) {
	$scope.taskList = [];
	$scope.selectedTask = {};

	$scope.selectTask = function(task) {
		$scope.selectedTask = task;
	}


	var getTasks = function() {
		$http.post(TASKS_URL, {})
			.success(function(d) {
				$scope.taskList = d;
			})
			.error(function(d) {
				console.log(":: getTasks() error", d);
			});
	}

	// init steps
	getTasks();
});
