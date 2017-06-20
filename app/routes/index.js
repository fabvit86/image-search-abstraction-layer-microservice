'use strict';

const rootPath = process.cwd();
var SearchHandler = require(rootPath+'/app/controllers/imgSearchController.server.js');

module.exports = function(app){

	var searchHandler = new SearchHandler();

	app.route('/').get(function(req, res){
		res.sendFile(rootPath+'/public/index.html');
	});

	app.route('/search/:keyword').get(searchHandler.search);

	app.route('/recentsearches').get(searchHandler.getRecentSearches);

};