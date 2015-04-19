adminApp.controller('adminController',  function($scope, $q, $http) {
	$scope.taskList = [];
	$scope.selectedTask = {};

	$scope.selectTask = function(task) {
		$scope.selectedTask = task;
	}

	$scope.newTask = function() {
		$scope.selectedTask = {};
	}

	$scope.updateTask = function(task) {
		updateTask(task)
			.then(function(d) {
				console.log(':: task update', d);
				getTasks();
			},	
			function(d) {
				console.log(':: updateTask error', d);
			});
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

	var updateTask = function(task) {
		var deferred = $q.defer();
		$http.post(UPDATE_TASK_URL, task)
			.success(function(d) {
				deferred.resolve(d);
			})
			.error(function(d) {
				deferred.reject(d);
			});
		return deferred.promise;
	}

	// init steps
	getTasks();
});
