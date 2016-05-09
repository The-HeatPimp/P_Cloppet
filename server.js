// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');

var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file
var User = require('./app/models/user'); // get our mongoose model

// =================================================================
// configuration ===================================================
// =================================================================

var port = process.env.PORT || 3000; // used to create, sign, and verify tokens

mongoose.connect(config.database, function(err) {
	if (err) {
		console.log('  MongoDB : Connection error', err);
	} else {
		console.log('  MongoDB : Connection successful');
	}
}); // connect to database


app.set('view engine', 'ejs');
app.set('superSecret', config.secret); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(bodyParser.json());
app.use('/api/',express.static(__dirname + '/private'));
app.use('/',express.static(__dirname + '/public'));

// use morgan to log requests to the console
app.use(morgan('dev'));

// =================================================================
// routes ==========================================================
// =================================================================
app.get('/setup', function(req, res) {

	// create a sample user
	var nick = new User({
		name: 'Nick Cerminara',
		password: 'password',
		admin: true
	});
	nick.save(function(err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({
			success: true
		});
	});
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// authentication (no middleware necessary since this isnt authenticated)
// ---------------------------------------------------------
// http://localhost:8080/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
	// find the user
	User.findOne({
		name: req.body.name
	}, function(err, user) {

		if (err) throw err;

		if (!user) {
			res.json({
				success: false,
				message: 'Authentication failed. User not found.'
			});
		} else if (user) {

			// check if password matches
			if (user.password != req.body.password) {
				res.json({
					success: false,
					message: 'Authentication failed. Wrong password.'
				});
			} else {
				var token;
				if(!user.admin){
				// if user is found and password is right
				// create a token
				token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token,
					admin: false
				});
			}else{
				token = jwt.sign(user, app.get('superSecret'), {
					expiresInMinutes: 1440 // expires in 24 hours
				});

				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token,
					admin: true
				});
			}}

		}

	});
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];

	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {
			if (err) {
				return res.json({
					success: false,
					message: 'Failed to authenticate token.'
				});
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});

	}

});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({
		message: 'Welcome to the coolest API on earth!'
	});
});
/*
	allow the user to see his related informations
 */
apiRoutes.get('/me', function(req, res) {
	jwt.verify(req.headers['x-access-token'], config.secret, function(err, decoded) {
		if (err) {
			return res.json({
				success: "false"
			});
		} else {
			return res.json({
				success: "true",
				name: decoded.name,
				admin: decoded.admin
			});
		}
	});

});


/*
	DEBUG TOOL : Print the sended request
 */

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

/*
    call the routers
 */
require('./app/routes/index.js')(app);
require('./app/routes/admin.js')(apiRoutes);

// =================================================================
// start the server ================================================
// =================================================================
app.listen(port);
console.log('Magic happens at http://localhost:' + port);