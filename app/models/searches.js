'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var Schema = mongoose.Schema;

//save timestamp and keyword for every search perfomed by the user
var Search = new Schema({
		keyword: String,
		date: Date
	}
);

module.exports = mongoose.model('Search', Search);