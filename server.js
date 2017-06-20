'use strict';

const express = require('express'),
	routes = require('./app/routes/index.js'),
	mongoose = require('mongoose');

const app = express();
require('dotenv').load(); //inizialize the dotenv Node module

const rootPath = process.cwd();

mongoose.connect(process.env.MONGO_URI); //takes the uri from the .env file

app.use('/public', express.static(rootPath+'/public'));
app.use('/controllers', express.static(rootPath+'/app/controllers'));

routes(app);

const port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('Node.js listening on port '+port+'...');
});