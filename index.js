var DEFAULT_SCORE = 10;

var express = require('express');
var vm = require('vm');
var app = express();
app.use(express.static(__dirname + '/public'));

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.set('port', (process.env.PORT || 8000));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var userSchema = mongoose.Schema({
	name : String,
    firstName : String,
    lastName : String,
    email : String,
    fbId : String
});

var taskSchema = mongoose.Schema({
	name : String,
	description : String,
	available : Boolean,
	level : Number,
	code : String,
	testCases : String,	
	index : Number,
	score : Number,
});

var rewardSchema = mongoose.Schema({
	userId : String,
	taskId : String,
	score : Number,
	name : String,
})

var User = mongoose.model('User', userSchema);
var Task = mongoose.model('Task', taskSchema);
var Reward = mongoose.model('Reward', rewardSchema);

app.post('/login', function(req, res) {
	res.setHeader('Content-type', 'application/json; charset="utf-8"');

	User.find({ fbId: req.body.id }, function(err, user) {
		if (user.length != 0) {
			console.log('### existing user');
			res.send(JSON.stringify(user[0]));
		} else {
			console.log('### new user');
			var newUser = new User({
				name : req.body.name,
				firstName : req.body.first_name,
				lastName : req.body.last_name,
				email : req.body.email,
				fbId : req.body.id
			});
			newUser.save(function(err, user) {
				console.log('### new user inserted');
				res.send(JSON.stringify(user));
			});
		}
	});
});

app.post('/tasks', function(req, res) {
	res.setHeader('Content-type', 'application/json; charset="utf-8"');
	Task.find({}, function(err, taskList) {
		if(err) {
			res.send('{}');
			return;
		}
		res.send(JSON.stringify(taskList));
	});
});

app.post('/updateTask', function(req, res) {
	res.setHeader('Content-type', 'application/json; charset="utf-8"');
	var myTask;
	Task.find({_id : req.body._id}, function(err, taskList) {
		if(err) {
			res.send('{}');
			return;
		}
		var myTask;
		if (taskList.length > 0) {
			myTask = taskList[0];
		} else {
			myTask = new Task();		
		}
		
		myTask.name = req.body.name;
		myTask.description = req.body.description;
		myTask.available = req.body.available;
		myTask.level = req.body.level;
		myTask.index = req.body.index != undefined ? req.body.index : 99999;
		myTask.code = req.body.code;
		myTask.testCases = req.body.testCases;

		myTask.save(function(err, newTask) {
			if (err) {
				res.send('{}');
				return;				
			}
			console.log('### task updated')
			res.send(JSON.stringify(newTask));
		});
	});
});

app.post('/submitTask', function(req, res) {
	res.setHeader('Content-type', 'application/json; charset="utf-8"');
	Task.find({_id : req.body._id}, function(err, taskList) {
		if(err && taskList.length == 0) {
			res.send('{}');
			return;
		}
		var task = taskList[0];
		var evalResult = codeEval(req.body.code, task.testCases);

		var r = {
			task : {
				_id : task._id
			},
			eval : evalResult
		}	

		logTaskSubmit(req.body.userId, task._id, req.body.code, evalResult.pass);
		if (evalResult.pass == true) {
			createReward(req.body.userId, task._id, task.name, task.score);
		}

		res.send(JSON.stringify(r));
	});
});

app.post('/rewards', function(req, res) {
	res.setHeader('Content-type', 'application/json; charset="utf-8"');
	Reward.find({userId : req.body.userId}, function(err, rewardList) {
		if (err) {
			res.send('{error: err}');
			return;
		}
		res.send(rewardList);
	})
});

var codeEval = function(code, testCases) {
	console.log('### testing', code, testCases);
	var r = {};

	var sandbox = {};
	vm.createContext(sandbox);
	var testbox = {};
	vm.createContext(testbox);

	try {
		vm.runInContext(code, sandbox);
		r.codeSuccess = true;
	} catch (err) {
		r.codeSuccess = false;
		r.codeError = err.message;
	}
	try {
		vm.runInContext(testCases, testbox);
		r.testSuccess = true;
	} catch(err) {
		r.testSuccess = false;
		r.testError = err.message;
	}

	try {
		sandbox.__test = testbox.__test;
		r.pass = sandbox.__test();
		r.testCaseSuccess = true;
	} catch(err) {
		r.testCaseSuccess = false;
		r.pastCaseError = err.message;
	}
	return r;
}

var logTaskSubmit = function(userId, taskId, code, pass) {
	console.log('## logTaskSubmit', userId, taskId, code, pass);
}

var createReward = function(userId, taskId, name, score) {
	console.log('## createReward', userId, taskId, score);
	var myReward = new Reward({
		userId : userId,
		taskId : taskId,
		name : name,
		score : score != undefined ? score : DEFAULT_SCORE
		});
	myReward.save(function(err, task) {});
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
