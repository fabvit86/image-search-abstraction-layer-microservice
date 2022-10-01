'use strict';

var Searches = require('../models/searches.js'); //Search model

const axios = require('axios');

//get only the needed information from the search result:
function parseResults(responseBody){
	var parsedBody = JSON.parse(responseBody); //the response body is a string, parsing it to JSON
	var resultCount = parseInt(parsedBody.searchInformation.totalResults);
	var resultItems = parsedBody.items;
	var resArray = []; var i=0;
	resultItems.forEach(function(element){
		resArray[i] = {
			url: element.link,
			snippet: element.snippet,
			thumbnail: element.image.thumbnailLink,
			context: element.image.contextLink
		}
		i++;
	});
	return resArray;
}

function SearchHandler(){

	this.search = function(req, res){
		var keyword = req.params.keyword; //user input
		var searchType = 'image'; 
		//The index of the first item to return (offset, default starts with 1):
		var start = !req.query.offset||parseInt(req.query.offset)<1 ? 1 : req.query.offset;
		const cseRootUrl = 'https://www.googleapis.com/customsearch/v1?key=';
		var requestUrl = 
				cseRootUrl
				+process.env.GOOGLE_CSE_KEY
				+'&cx='+process.env.GOOGLE_CSE_CX
				+'&q='+keyword
				+'&searchType='+searchType
				+'&start='+start;
		//call to Google Custom Search Engine API:
		axios.get(requestUrl).then(function (response) {
			if(response.statusCode!==200) return console.log('statusCode:', response && response.statusCode);
			//save searched keywords and timestamp in db (most recent searches):
			var currDateTime = new Date();
			var search = new Searches({'keyword': keyword, 'date': currDateTime});
			search.save(function(err, result){
				if(err) throw err;
				//return results:
				var resArray = parseResults(response.data);
				res.json(resArray); 
			});
		})
		.catch(function (error) {
			console.log(error);
			throw error;
		});
	};

	//return the 10 most recent searches:
	this.getRecentSearches = function(req, res){
		Searches.find({}, {_id: 0, __v: 0}).sort({date: -1}).limit(10).exec(
			function(err, result){
				if(err) throw err;
				res.json(result);
		});
	};

}//SearchHandler

module.exports = SearchHandler;