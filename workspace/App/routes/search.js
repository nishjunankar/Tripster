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
	if (fs.existsSync(src)) {
	    var dat = fs.readFileSync(src);
		var suffix = substring(src.length-3);
		var cT = 'image/' + suffix;
		var img = {data: dat, contentType: cT};
	    

		var to_cache = new Photo({ U_ID: u_id, URL: src, IMG: img});
		to_cache.save(function (err, to_cache){
			if (err) {return console.error(err);}
		});
	}
}

function query_db(req,res,table,search) {
	mongoose.connect('mongodb://localhost/photos');
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
	    					photos.forEach(function(element, index){
	    						res.writeHead(100,{'Content-Type': element.IMG.contentType});
	    						res.end(element.IMG.data, 'binary');
	    					});
	    				/*
	    					res.render('photos.jade', {
	    						title: "Results for: " + search,
	    						results: photos
	    					});*/
	    				}
	    		    	db.close();
	    				});
	    			connection.execute("SELECT P.P_ID, P.PUBLISHED_BY, P.URL, TO_CHAR(P.TIMES, 'Month D HH12:MI PM') AS TIMES FROM PHOTO P WHERE P.PUBLISHED_BY = " + "'" + search + "'", 
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
	    			    	    	    db.close();
	    			    	    	    connection.close();
	    		  	    	            res.render('photos.jade',{
	    		  	    	              title: "Results for: " + search,
		    		  	    		      photos: results } );
	    		  	                    }
	    			    	    }});
	    			break;
	    			//USER CASE
	    		case "users":
	    			db.close();
	    			var query = "";
	    			query+="(SELECT * FROM USERS U WHERE U.U_ID = '";
	    			query+=search+"')";
	    			query+=" UNION ";
	    			query+="(SELECT * FROM USERS U WHERE U.FIRST_NAME = '";
	    			query+=search+"')";
	    			query+=" UNION ";
	    			query+="(SELECT * FROM USERS U WHERE U.LAST_NAME = '";
	    			query+=search+"')";
	    			
	    			connection.execute(query, 
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
		    		  	    		      results: results } );
	    		  	                    }
	    			    	    }});
	    			break;
	    			//LOCATION CASE
	    		case "locations":
	    			db.close();
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
