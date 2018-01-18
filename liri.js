//
require("dotenv").config();


//Here are the keys
var keys = require('./keys.js');

//Dependencie
var twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');
var fs = require('fs');

//
/*var spotify = Spotify(keys.spotify);*/
var client = new twitter(keys.twitter);

// //Directions for the user
// console.log("Hey! In order to use this app, simply use the following commands!" \n"Type-my-tweets""Spotify-this-song ""Movie-this""Do-what-it-says");

var userAction = process.argv[2];


var userArgument = "";

justDoIt(action,argument);

function justDoIt(action,argument) {
	
	argument= getThirdArgument();

		switch(action){

			//Twitter
			case "my-tweets":
			tweetList();
			break;

			//Spotify
			case "spotify-this-song":

				var song = argument;
					if(song ==="") {
						songLookUp();
					}else {
						songInfo(song);
					}	
			break;

			//OMDb
			case "movie-this":

				var movieTitle = argument;
					if (movieTitle === "") {
						getMovieInfo("Tropic Thunder");
					} else {
						getMovieInfo(movieTitle);
					}
			break;

			case "do-what-it-says":
			nikeswitch();
			break;
	}
}

function thirdArgument (){
	argumentArray=process.argv;

	for (var i =3; i <argumentArray.length; i++){
		argument+=argumentArray[i];
	}
	return argument;
}

//Twitter code to display 20 tweets
function tweetList() {
	var parameters = {q: "@RatchetRevival", count: 20};

	client.get('search/tweets', {q:"OreoAndPuff"}, parameters, function(error, tweets, response){
		if(error){
			console.log("Oh no! error: ", error)//shows that there is an error
			console.log('statusCode: ', response && response.statusCode);
		} else {
			for (i=0; tweets["statuses"].length; i++){
				console.log("----------------------");
	  			console.log("The Cats tweeted: '" + tweets["statuses"][i].text +"'"); 
	  			console.log("Tweeted on: " + tweets["statuses"][i]["created_at"]);

	  		}
	  		
	  	}
	});
}


// Spotify code to display given song info
function songLookUp(){

	//The actual search
	Spotify.search({type:'track', query: song}, function(error, data){
		
		if (error){
			console.log('Aw snap! Errors everywhere: ' + error);
			return;
		} 
		 var artist= data.tracks.items[0].album.artists;

		 var artName= [];
		 for (var i = 0; i <artist.length; i++) {
		 	artName.push(artist[i].name)
		 }
	    	console.log("---------------------");
	    	console.log("Artist(s): " + data["tracks"].items[1].artists[0].name);
	    	console.log("Title: " + data["tracks"].items[0].name);
	    	console.log("Check it our here! " + data["tracks"].items[0].preview_url);
	    	console.log("Album Name: " + data["tracks"].items[0].album.name);
	    	console.log("---------------------");	
 
	});
}

function songInfo(){

	// Calls Spotify API to retrieve a specific track, The Sign, Ace of Base.

	spotify.lookup({type: 'track', id: '3DYVWvPh3kGwPasp7yjahc'}, function(err, data) {

		if (error) {
			logOutput.error(error);
			return
		}

		// Prints the artist, track name, preview url, and album name.
		console.log("Artist: " + data.artists[0].name);
		console.log("Song: " + data.name);
		console.log("Preview URL: " + data.preview_url);
		console.log("Album Name: " + data.album.name);

	});

}




//Movie code to use Request NPM and OMDb API
function movieLookUp(){	

	var nodeArgs = process.argv; 
	var movie = nodeArgs[3];

	for (i=4;i<nodeArgs.length;i++){		
		movie += "+" + nodeArgs[i];
	}

	//  If no user input
	if (nodeArgs[4] === undefined){
		movie = "Mr. Nobody";
	}

	var movieQueryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=full&tomatoes=true&r=json";

	console.log(movieQueryURL)
	console.log("Searching for:" + movie);


	// uses the Request Node package to query the OMDB API 
	Request(movieQueryURL, function (error, response, body) {

	  if (error){
	  	console.log('error:', error); // Print the error if one occurred 
	  	console.log('Ah snap! We ran into some trouble: ', response && response.statusCode); // Print the response status code if a response was received 
	  } else {
	  	// turns string into an object
	  	var obj = JSON.parse(body);
	  	// console.log(obj);

	  	console.log("----------");
	  	console.log("Title: " + obj["Title"]);
	  	console.log("Year it came out: " + obj["Year"]);
	  	console.log("IMDB Rating: " + obj["imdbRating"]);
	  	console.log("Produced in: " + obj["Country"]);
	  	console.log("Language: " + obj["Language"]);
	  	console.log("Plot: " + obj["Plot"]);
	  	console.log("Actors: " + obj["Actors"]);
	  	console.log("Rotten Tomatoes Rating: " + obj.Ratings[1].Value);
	  	console.log("Rotten Tomatoes URL: " + obj.tomatoURL); 	
	  	console.log("----------");
	  }	  
	});
}
