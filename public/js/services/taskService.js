app.factory('taskService', function($q, $http) {
	var factory = {};
	var taskList = [];
	var currentTask;

	factory.getTasks = function() {
		var deferred = $q.defer();
		$http.post(TASKS_URL, {})
			.success(function(d) {
				taskList = d;
				taskList.sort(function(a, b) {
					if (a.index > b.index) return 1;
					if (a.index < b.index) return -1;
					return 0;
				});
				deferred.resolve(taskList);
			})
			.error(function(d) {
				console.log(":: tasks get error", d);
				deferred.reject(d);
			})
		return deferred.promise;
	}

	factory.selectTask = function(taskId) {
		if (taskId == undefined) {
			currentTask = undefined;
		} else {
			currentTask = _.find(taskList, function(e) {return e._id == taskId;});
		}
		return currentTask;
	}

	factory.selectFirstTask = function() {
		var firstTask = _.find(taskList, function(e) { return e.index == 0;});
		console.log(firstTask, taskList);
		return factory.selectTask(firstTask._id);
	}

	factory.submitTask = function(id, userId, code) {
		var deferred = $q.defer();
		$http.post(SUBMIT_TASK_URL,
			{
				_id: id,
				userId : userId,
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

	factory.recommendTask = function() {
		return _.sample(taskList);
	}

	return factory;
});