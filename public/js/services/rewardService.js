app.factory('rewardService', function($q, $http) {
	var factory = {};

	factory.getRewards = function(userId) {
		var deferred = $q.defer();
		$http.post(REWARDS_URL,
			{
				userId : userId
			})
			.success(function(d) {
				deferred.resolve(d);
			})
			.error(function(d) {
				deferred.reject(d);
			});
		return deferred.promise;		
	}

	return factory;
});