'use strict';

var path = process.cwd();
var Polls = require("../models/polls");

/*
*@ Routes
*/
module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		} else {
			res.redirect('/login');
		}
	}

	
	app.route('/')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/index', { user : req.user });
		});

	app.route('/login')
		.get(function (req, res) {
			res.render(path + '/public/login');
		});

	app.route('/logout')
		.get(function (req, res) {
			req.logout();
			res.redirect('/login');
		});

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render(path + '/public/profile', { user : req.user });
		});

	/*
	*@ Github Passport Authentication
	*/
	app.route('/auth/github')
		.get(passport.authenticate('github'));

	app.route('/auth/github/callback')
		.get(passport.authenticate('github', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
	
	/*
	*@ Google Passport Authentication
	*/
	app.route('/auth/google')
		.get(passport.authenticate('google', { scope: [
			'profile',
			'email',
			'https://www.googleapis.com/auth/plus.login'
		]}));

	app.route('/auth/google/callback')
		.get(passport.authenticate('google', {
			successRedirect: '/',
			failureRedirect: '/login'
		}));
		
		
	/*
	*@ Polls routing
	*/
	app.route('/polls')
		.get(function(req, res){
			res.render(path + '/public/index');
		}); // all polls
		
	app.route('/polls/:poll')
		.get(function(req, res){
			
		}); // single poll view
	
	app.route('/new')
		.get(isLoggedIn, function(req, res){
			console.log('/polls/new requested');
			res.render(path + '/public/newpoll');
		});
		
	/*
	*@ API data endpoints
	*/
	app.get('/api/polls', function(req, res){
		// GET ALL POLLS
		Polls.find({}, function(err, data){
			if (err)
				throw err;
			res.json(data);
		})
	});
	
	app.get('/api/polls/:poll', function(req, res){
		// GET SINGLE POLL
	});
	
	app.route('/api/polls')
		.post(isLoggedIn, function(req, res){
			// CREATE NEW POLL
			/*
			*@ Polls Schema
			*@ name : String,
			*@ options: [{ name : String, votes : Number }]
			*/
			
			
			Polls.create({
				name: req.body.name,
				options: req.body.pollchoices
			}, function(err, data){
				if (err)
					throw err;
				console.log("data: ", data);
				return null;
			});
			
			res.json('created new poll');
		});
	
	app.post('/api/polls/:poll', function(req, res){
		// CREATE NEW OPTION FOR SINGLE POLL
	});
		
	/*
	*@ Catch 'em all 404s
	*/
	/*app.all('*', function(req, res){
		/*
		*@ Add 404 redirect
		*@
		*@ res.redirect('/404');
		*/
		/*res.send("404, page not found");
	})*/
};
