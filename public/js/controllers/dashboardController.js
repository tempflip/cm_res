app.controller('dashboardController', function($scope, $q, $sce, authService, taskService, rewardService) {
	var levelSet = [
		{label : 'Pikachu', img : 'assets/l1.gif', upperLimit : 20},
		{label : 'Mumin', img : 'assets/l2.gif', upperLimit : 100},
		{label : 'Shongoku', img : 'assets/l3.gif', upperLimit : 200},
		{label : 'Kockásfülü Nyúl', img : 'assets/l4.gif', upperLimit : 1000}
	];

	$scope.user = authService.getUser();
	$scope.rewardList = [];
	$scope.taskList = [];
	$scope.isFirstTask = true;

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
					var msg = ''
					if (d.eval.codeSuccess == false) {
						msg += d.eval.codeError + '; '
					}
					if (d.eval.testSuccess == false) {
						msg += d.eval.testError + '; '
					}
					if (d.eval.testCaseSuccess == false) {
						msg += d.eval.testCaseError + '; '
					}
					if (msg == '') { msg = undefined; }
					taskFail(id, msg);
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

	$scope.getLevelSet = function(score) {
		var level = levelSet[getLevelSetIndex(score)];
		if (level == undefined) {
			return undefined;
		}
		return level;
	}

	$scope.getNextLevelSet = function(score) {
		var level = levelSet[getLevelSetIndex(score) + 1];
		if (level == undefined) {
			return undefined;
		}
		return level;
	}

	var taskPass = function(id) {
		$scope.scoreGained = $scope.selectedTask.score;
		$scope.selectedTask = taskService.selectTask(undefined);

		$scope.taskProcessing = false;
		getRewards();
		getTasks();
		$('#taskPassModal').modal('show');
	}

	var taskFail = function(id, msg) {
		$scope.taskProcessing = false;
		$scope.failMessage = msg;
		$('#taskFailModal').modal('show');
	}

	var getRewards = function() {
		rewardService.getRewards($scope.user._id)
			.then(function(d) {
				console.log(':: rewards', d);
				$scope.rewardList = d;
				if (d.length > 0) {
					$scope.isFirstTask = false;
					console.log('::: rew', d);
				}
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

	var getLevelSetIndex = function(score) {
		var l;
		for (var i = 0; i < levelSet.length; i++) {
			if (score < levelSet[i].upperLimit) {
				l = i;
				break;
			}
		}
		return l;
	}

	// init steps
	$scope.navigate('home');
	getRewards();
	getTasks();

});

