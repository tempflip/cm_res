var LOGIN_URL = 'http://geekwerk.herokuapp.com/login';
var TASKS_URL = 'http://geekwerk.herokuapp.com/tasks';
var UPDATE_TASK_URL = 'http://geekwerk.herokuapp.com/updateTask';
var SUBMIT_TASK_URL = 'http://geekwerk.herokuapp.com/submitTask';
var REWARDS_URL = 'http://geekwerk.herokuapp.com/rewards';

var FB_APP_ID = '485645464921474';

if (document.domain == 'localhost') {
	FB_APP_ID = '1584826841759329';
	var LOGIN_URL = 'http://localhost:8000/login';
	var TASKS_URL = 'http://localhost:8000/tasks';
	var UPDATE_TASK_URL = 'http://localhost:8000/updateTask';
	var SUBMIT_TASK_URL = 'http://localhost:8000/submitTask';
	var REWARDS_URL = 'http://localhost:8000/rewards';
}

var levelLabel = {
	0 : 'Könnyű',
	1 : 'Közepes',
	2 : 'Nehéz'
}