'use strict';

/*
*@ Application requirements
*/
var express = require('express');
var routes = require('./app/routes/index.js');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

/*
*@ Express app
*/
var app = express();

/*
*@ View engine
*/
app.set("view engine", "ejs");

/*
*@ Middleware
*/
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

/*
*@ dotenv for environment variables
*/
require('dotenv').load();

/*
*@ Passport oAuth with Github and Twitter
*/
require('./app/config/passport-github')(passport);
require('./app/config/passport-google')(passport);

/*
*@ MongoDB connect Mongoose Driver
*/
mongoose.connect(process.env.MONGO_URI);
mongoose.Promise = global.Promise;

/*
*@ Static
*/
app.use('/controllers', express.static(process.cwd() + '/app/controllers'));
app.use('/public', express.static(process.cwd() + '/public'));
app.use('/common', express.static(process.cwd() + '/app/common'));

/*
*@ Session handler
*/
app.use(session({
	secret: 'secretMnemos',
	resave: false,
	saveUninitialized: true
}));

/*
*@ Passport init
*/
app.use(passport.initialize());
app.use(passport.session());

/*
*@ Routing
*/
routes(app, passport);

/*
*@ Server
*/
var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log("listening on port " + process.env.PORT);
});
