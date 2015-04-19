app.controller('dashboardController', function($scope, $q, $http, authService, taskService) {
	$scope.user = authService.getUser();
	$scope.tasks = [];
	$scope.navigate = function(page) {
		$scope.isHome = false;
		$scope.isTasks = false;
		$scope.isJobs = false;
		$scope.isHallOfFame = false;
		$scope.taskList;
		$scope.selectedTask;
		$scope.taskProcessing = false;

		if (page == 'home') $scope.isHome = true;
		if (page == 'tasks') $scope.isTasks = true;
		if (page == 'jobs') $scope.isJobs = true;
		if (page == 'hallOfFame') $scope.isHallOfFame = true;
	}

	$scope.selectTask = function(taskId) {
		$scope.selectedTask = taskService.selectTask(taskId);
	}

	$scope.cancelTask = function() {
		$scope.selectedTask = taskService.selectTask(undefined);
	}

	$scope.submitTask = function(id, code) {
		$scope.taskProcessing = true;
		submitTask(id, code)
			.then(function(d) {
				if(d.eval.pass == true) {
					taskPass(id);
				} else {
					taskFail(id);
				}
			},
			function(d) {
				console.log(':: submitTask error', d);
			});
	}

	$scope.getLevelLabel = function(l) {
		return levelLabel[l];
	}

	var taskPass = function(id) {
		$scope.selectedTask = taskService.selectTask(undefined);
		$scope.taskProcessing = false;
		$('#taskPassModal').modal('show');
	}

	var taskFail = function(id) {
		$scope.taskProcessing = false;
		$('#taskFailModal').modal('show');
	}


	var submitTask = function(id, code) {
		var deferred = $q.defer();
		console.log({
				_id: id,
				code : code
			});
		$http.post(SUBMIT_TASK_URL,
			{
				_id: id,
				code : code
			})
			.success(function(d) {
				deferred.resolve(d);
			})
			.error(function(d) {
				deferred.reject(d);
			});
		return deferred.promise;		
	}

	// init steps
	$scope.navigate('home');
	taskService.getTasks()
		.then(function(d) {
			$scope.taskList = d;
		}, function(d) {
			console.log(':: error: taskService.getTasks()', d);
		});

});

