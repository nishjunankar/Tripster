// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function query_db(req, res) {
  var uid = JSON.stringify(req.session.user);
  
  if (!uid) res.redirect('/');
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = 'SELECT * FROM TRIP WHERE TRIP.CREATOR = ' + uid.replace(/"/g, "'");
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/');
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_trips(req, res, results);	  	    	
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
	console.log(trips);
	res.render('my_trips.jade',
		   { title: req.session.user + "'s Trips",
		     trips: trips,
		     uid: req.session.user}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	//console.log('in newsfeed');
	query_db(req, res);
};