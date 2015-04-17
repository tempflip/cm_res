var app = angular.module('cmApp', ['ngRoute']);
var LOGIN_URL = 'http://localhost:8000/login';
var TASKS_URL = 'http://localhost:8000/tasks';

var levelLabel = {
	0 : 'Könnyű',
	1 : 'Közepes',
	2 : 'Nehéz'
}