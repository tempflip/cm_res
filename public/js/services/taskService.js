app.factory('taskService', function($q, $http) {
	var factory = {};
	var tasks = [];
	var currentTask;

	factory.getTasks = function() {
		var deferred = $q.defer();
		$http.post(TASKS_URL, {})
			.success(function(d) {
				tasks = d;
				deferred.resolve(d);
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
			currentTask = _.find(tasks, function(e) {return e._id == taskId});
		}
		return currentTask;
	}

	return factory;
});