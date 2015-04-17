app.factory('authService', function() {
	var factory = {};
	var user;

	factory.setUser = function(d) {
		console.log(':: user set to', d);
		user = d;
	}

	factory.getUser = function() {
		return user;
	}

	return factory;
});