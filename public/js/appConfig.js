var LOGIN_URL = 'http://localhost:8000/login';
var TASKS_URL = 'http://localhost:8000/tasks';
var UPDATE_TASK_URL = 'http://localhost:8000/updateTask';
var SUBMIT_TASK_URL = 'http://localhost:8000/submitTask';
var REWARDS_URL = 'http://localhost:8000/rewards';

var FB_APP_ID = '485645464921474';

if (document.domain == 'localhost') {
	FB_APP_ID = '1584826841759329';
}

var levelLabel = {
	0 : 'Könnyű',
	1 : 'Közepes',
	2 : 'Nehéz'
}