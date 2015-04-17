app.controller('dashboardController', function($scope, authService, taskService) {
	$scope.user = authService.getUser();
	$scope.tasks = [];
	$scope.navigate = function(page) {
		$scope.isHome = false;
		$scope.isTasks = false;
		$scope.isJobs = false;
		$scope.isHallOfFame = false;
		$scope.taskList;
		$scope.selectedTask;

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

	$scope.getLevelLabel = function(l) {
		return levelLabel[l];
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

