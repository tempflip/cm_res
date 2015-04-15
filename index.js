var express = require('express');
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

var User = mongoose.model('User', userSchema);


/*{"id":"10206245802324789",
"email":"tempflip@gmail.com",
"first_name":"Peter",
"gender":"male",
"last_name":"Tempfli",
"link":"https://www.facebook.com/app_scoped_user_id/10206245802324789/",
"locale":"en_US",
"name":"Peter Tempfli","timezone":1,"updated_time":"2014-09-21T10:29:12+0000","verified":true}*/

app.get('/', function(request, response) {
	response.send('Hello World!');
});

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

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
