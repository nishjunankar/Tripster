// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");
var Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
BSON = require('mongodb').pure().BSON,
mongoose = require('mongoose'),
fs = require('fs');
var photoSchema = mongoose.Schema({
	  U_ID: String,
	  URL: String,
	  IMG: {data: Buffer,
		   contentType: String}
});
var Photo = mongoose.model('Photo', photoSchema);

//var request = require('request');

function add_photo_to_cache(req, res, src, u_id){
	var dat = fs.readFileSync(src);
	var suffix = substring(src.length-3);
	var cT = 'image' + suffix;
	var img = {data: dat, contentType: cT};
	var to_cache = new Photo({ U_ID: u_id, URL: src, IMG: img});
	to_cache.save(function (err, to_cache){
		if (err) {return console.error(err);}
	});
}

function query_db(req,res,table,search) {
	mongoose.connect('mongodb://localhost/test');
	  var db = mongoose.connection;
	  db.on('error', console.error.bind(console, 'connection error:'));
	  db.once('open', function callback (){
	    oracle.connect(connectData, function(err, connection) {
	      if ( err ) {
	    	console.log(err);
	      } else {
		  	// SWITCH ON TABLE
	    	
	    	switch(table){
	    	
	    		//PHOTO CASE
	    		case "photos": 
	    			Photo.find({U_ID: search}, function(err, photos){
	    				if (err) {return console.error(err);}
	    				if (photos.length > 1){
	    					res.render('photos.jade', {
	    						title: "Results for: " + search,
	    						results: photos
	    					});
	    				}
	    				});
	    			connection.execute("SELECT * FROM PHOTOS P WHERE P.PUBLISHED_BY = " + "'" + search + "'", 
	    		  			   [], 
	    		  			   function(err, results) {
	    		  	            if ( err ) {
	    		  	    	      console.log(err);
	    		  	            }
	    		  	            else {
	    			    	      if (results.length < 1){
	    		  	    		    connection.close();
	    		  	   			    res.render('index.jade', { 
	    		  				  	  title: 'No results found' 
	    							  });
	    		  	   		      }
	    			    	      else {
	    			    	    	    results.forEach(function(element, index){
	    			    	    	    	add_photo_to_cache(req, res, element.URL, search);
	    			    	    	    });
	    			    	    	    connection.close();
	    		  	    	            res.render('photos.jade',{
	    		  	    	              title: "Results for: " + search,
		    		  	    		      results: results } );
	    		  	                    }
	    			    	    }});
	    			break;
	    			//USER CASE
	    		case "users":
	    			connection.execute("SELECT * FROM USERS U WHERE U.U_ID = " + "'" + search + "'", 
	    					[], 
	    		  			   function(err, results) {
	    		  	            if ( err ) {
	    		  	    	      console.log(err);
	    		  	            }
	    		  	            else {
	    			    	      if (results.length < 1){
	    		  	    		    connection.close();
	    		  	   			    res.render('index.jade', { 
	    		  				  	  title: 'No results found' 
	    							  });
	    		  	   		      }
	    			    	      else {
	    			    	    	    connection.close();
	    		  	    	            res.render('actor.jade',{
	    		  	    	              title: "Results for: " + search,
		    		  	    		      results: results,
		    		  	    		      uid = req.session.user} );
	    		  	                    }
	    			    	    }});
	    			break;
	    			//LOCATION CASE
	    		case "locations":
	    			connection.execute("SELECT * FROM LOCATIONS L WHERE L.LOC_NAME = " + "'" + search + "'", 
	    					[], 
	    		  			   function(err, results) {
	    		  	            if ( err ) {
	    		  	    	      console.log(err);
	    		  	            }
	    		  	            else {
	    			    	      if (results.length < 1){
	    		  	    		    connection.close();
	    		  	   			    res.render('index.jade', { 
	    		  				  	  title: 'No results found' 
	    							  });
	    		  	   		      }
	    			    	      else {
	    			    	    	    connection.close();
	    		  	    	            res.render('locations.jade',{
	    		  	    	              title: "Results for: " + search,
		    		  	    		      results: results } );
	    		  	                    }
	    			    	    }});
	    			break;
	    			
	    	}
	    }
	  });
	  });
}




/////
//This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req,res,req.query.table,req.query.search);
};