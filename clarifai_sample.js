// node_example.js - Example showing use of Clarifai node.js API

var Clarifai = require('./clarifai_node.js');
Clarifai.initAPI(process.env.CLIENT_ID, process.env.CLIENT_SECRET);

var stdio = require('stdio');

// support some command-line options
var opts = stdio.getopt( {
	'print-results' : { description: 'print results'},
	'print-http' : { description: 'print HTTP requests and responses'},
	'verbose' : { key : 'v', description: 'verbose output'}
});
var verbose = opts["verbose"];
Clarifai.setVerbose( verbose );
if( opts["print-http"] ) {
	Clarifai.setLogHttp( true ) ;
}

if(verbose) console.log("using CLIENT_ID="+Clarifai._clientId+", CLIENT_SECRET="+Clarifai._clientSecret);

// Setting a throttle handler lets you know when the service is unavailable because of throttling. It will let
// you know when the service is available again. Note that setting the throttle handler causes a timeout handler to
// be set that will prevent your process from existing normally until the timeout expires. If you want to exit fast
// on being throttled, don't set a handler and look for error results instead.
// Clarifai.setThrottleHandler( function( bThrottled, waitSeconds ) { 
// 	console.log( bThrottled ? ["throttled. service available again in",waitSeconds,"seconds"].join(' ') : "not throttled");
// });

// exampleTagSingleURL() shows how to request the tags for a single image URL
function exampleTagSingleURL() {var testImageURL = 'http://www.clarifai.com/img/metro-north.jpg';
	var ourId = "train station 1"; // this is any string that identifies the image to your system

	Clarifai.tagURL( testImageURL , ourId, function( err, res ) {
		if( opts["print-results"] ) {
			switch( res["status_code"]) {
				case "OK" :
					// the request completed successfully
					console.log( res, 'local_id =', res.results[0].local_id );
                                        console.log( res["results"][0].result["tag"]["classes"] );
					break;
				case "ALL_ERROR":
					// this is the error return from the first
					// request that triggered the service to throttle	
					break;
				case "ERROR_THROTTLED":
					// this is the error returned from the API client
					// you make a request when the state is already
					// throttled
					break;
			}
		};
	} );
}


// exampleTagMultipleURL() shows how to request the tags for multiple images URLs
function exampleTagMultipleURL() {
	var testImageURLs = [ 
	"http://www.clarifai.com/img/metro-north.jpg", 
	"http://www.clarifai.com/img/img_fire_bg.jpg" ] ;
	var ourIds =  [ "train station 1", 
	                        "img002032" ]; // this is any string that identifies the image to your system

	Clarifai.tagURL( testImageURLs , ourIds, function( err, res ) {
		if( opts["print-results"] ) {
			console.log( res  );
			switch( res["status_code"]) {
				case "OK" :
					// the request completed successfully
					for( i = 0; i < res.results.length; i++ ) {
						console.log( 'docid='+res.results[i].docid+' local_id='+res.results[i].local_id )
					}
					break;
				case "ALL_ERROR":
					// this is the error return from the first
					// request that triggered the service to throttle	
					break;
				case "ERROR_THROTTLED":
					// this is the error returned from the API client
					// you make a request when the state is already
					// throttled
					break;
			}
		};
	} );
}

// exampleFeedback() shows how to send feedback (add or remove tags) from 
// a list of docids. Recall that the docid uniquely identifies an image previously
// presented for tagging to one of the tag methods.
function exampleFeedback() {
// these are docids that just happen to be in the database right now. this test should get 
// upgraded to tag images and use the returned docids.
var docids = [
	"15512461224882630000",
	"9549283504682293000"
	];
	var addTags = [
	"addTag1",
	"addTag2"
	];
	Clarifai.feedbackAddTagsToDocids( docids, addTags, null, function( err, res ) {
		if( opts["print-results"] ) {
			console.log( res );
		};
	} );

	var removeTags = [
	"removeTag1",
	"removeTag2"
	];
	Clarifai.feedbackRemoveTagsFromDocids( docids, removeTags, null, function( res ) {
		if( opts["print-results"] ) {
			console.log( res );
		};
	} );
}


exampleTagSingleURL();
exampleTagMultipleURL();
exampleFeedback();

