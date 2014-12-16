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

function query_db(req, res) {
	
	var query="WITH Trips AS( ";
	query += "SELECT DISTINCT T.T_ID ";
	query += "FROM TRIP T ";
	query += "inner join invite_trip IT on it.t_id = T.T_id ";
	query += "WHERE IT.INVITED_USERS='" + req.session.user+"' OR T.CREATOR='" + req.session.user +"' ";
	query += ") ";
	query += "SELECT * FROM TRIPS T ";
	query += "INNER JOIN TRIP T2 ON T2.T_ID=T.T_ID ";
	
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
	  	    	output_trips(req,res,results);
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
function output_trips(req, res,trips) {
	res.render('my_trips.jade', 
			{title: "My Trips", trips: trips, uid: req.session.user}
		);
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if (!req.session.user) res.redirect('/');
	query_db(req,res)
};
