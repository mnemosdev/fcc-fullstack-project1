'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Polls = new Schema({
	name : String,
	options: [{ name : String, votes : Number }],
	users: [ String ]
});

module.exports = mongoose.model('Polls', Polls);