app.controller('dashboardController', function($scope, $q, $sce, authService, taskService, rewardService) {
	$scope.user = authService.getUser();
	$scope.rewardList = [];
	$scope.taskList = [];
	$scope.navigate = function(page) {
		$scope.isHome = false;
		$scope.isTasks = false;
		$scope.isJobs = false;
		$scope.isHallOfFame = false;

		$scope.selectedTask = undefined;
		$scope.taskProcessing = false;

		if (page == 'home') $scope.isHome = true;
		if (page == 'tasks') $scope.isTasks = true;
		if (page == 'jobs') $scope.isJobs = true;
		if (page == 'hallOfFame') $scope.isHallOfFame = true;
	}

	$scope.selectTask = function(taskId) {
		$scope.selectedTask = taskService.selectTask(taskId);
	}

	$scope.firstTask = function() {
		$scope.navigate('tasks');
		$scope.selectedTask = taskService.selectFirstTask();
		console.log($scope.selectedTask);
	}

	$scope.cancelTask = function() {
		$scope.selectedTask = taskService.selectTask(undefined);
	}

	$scope.submitTask = function(id, code) {
		$scope.taskProcessing = true;
		taskService.submitTask(id, $scope.user._id, code)
			.then(function(d) {
				console.log(':: eval ', d);
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

	$scope.recommendTask = function() {
		return taskService.recommendTask();
	}

	var taskPass = function(id) {
		$scope.scoreGained = $scope.selectedTask.score;
		$scope.selectedTask = taskService.selectTask(undefined);

		$scope.taskProcessing = false;
		getRewards();
		$('#taskPassModal').modal('show');
	}

	var taskFail = function(id) {
		$scope.taskProcessing = false;
		$('#taskFailModal').modal('show');
	}

	var getRewards = function() {
		rewardService.getRewards($scope.user._id)
			.then(function(d) {
				console.log(':: rewards', d);
				$scope.rewardList = d;
				calculateScore();
				calculateProgress();
			},
			function(d) {
				console.log(':: getRewards error', d);
			});
	}

	var calculateScore = function() {
		$scope.totalScore = 0;
		$scope.rewardList.forEach(function(e) {
			if (e.score != undefined) $scope.totalScore += e.score;
		});
	}

	var calculateProgress = function() {
		console.log('##', $scope.taskList.length, $scope.rewardList.length );
		$scope.progress = Math.floor($scope.rewardList.length / $scope.taskList.length * 100);
	}

	var getTasks = function() {
		taskService.getTasks()
			.then(function(d) {
				$scope.taskList = d;
				calculateProgress();
			}, function(d) {
				console.log(':: error: taskService.getTasks()', d);
			});		
	}

	// init steps
	$scope.navigate('home');
	getRewards();
	getTasks();

});

