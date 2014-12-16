// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

var tid;


/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for

function query_db_photos(req, res) {
	
	var	query = "SELECT * ";
	query += "FROM PHOTOS_IN_TRIP PIT ";
	query += "WHERE PIT.T_ID = " + tid + " ";
	query += "ORDER BY PIT.SHARED_TIME DESC";
	
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/');
	  	    } else {
	  	    	connection.close(); // done with the connection  
	  	    	console.log(results);
	  	    	query_db_accepted_users(req,res,results);
	  	    }
	
	  	}); // end connection.execute
    }
	  }); // end oracle.connect
}
function query_db_accepted_users(req, res, photos) {
	var query ="SELECT * FROM TRIP T INNER JOIN INVITE_TRIP IT ON IT.T_ID = T.T_ID INNER JOIN USERS U ON U.U_ID = IT.INVITED_USERS  WHERE IT.ACCEPTED = '1' AND T.T_ID = " + tid;

	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/');
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log(results);
		  	    	query_db_invited_users(req,res, photos, results);
		  	    }
		
		  	}); // end connection.execute
	    }
	}); // end oracle.connect
}

function query_db_invited_users(req, res, photos, accepted_users) {
	var query ="SELECT * FROM TRIP T INNER JOIN INVITE_TRIP IT ON IT.T_ID = T.T_ID INNER JOIN USERS U ON U.U_ID = IT.INVITED_USERS  WHERE IT.ACCEPTED = '0' AND T.T_ID = " + tid;

	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/');
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	console.log("IU");
		  	    	query_db_trip(req,res, photos, accepted_users, results);
		  	    }
		
		  	}); // end connection.execute
	    }
	}); // end oracle.connect
}

function query_db_trip(req, res, photos, accepted_users, invited_users) {
	var query = "SELECT TO_CHAR(start_date, 'Month D') AS start_date, TO_CHAR(end_date, 'Month D, YYYY') AS end_date, NAME, LOCATION, PRIVACY_FLAG, CREATOR FROM TRIP T WHERE T.T_ID = " + tid

	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/');
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_trip(req,res, photos, accepted_users, invited_users, results);
		  	    }
		
		  	}); // end connection.execute
	    }
	}); // end oracle.connect
}




/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_trip(req, res,photos, accepted_users, invited_users, trip) {
	console.log('in output');
	res.render('trip.jade', 
			{title: "Trip: ", photos: photos, accepted_users: accepted_users, invited_users: invited_users, trip: trip, uid: req.session.user}
		);
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if (!req.session.user) res.redirect('/');
	tid = req.params.tid;
	query_db_photos(req,res)
};
