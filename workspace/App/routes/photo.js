// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for

function query_db(req, res, pid) {
	
	var query = "SELECT * FROM PHOTOS_AND_COMMENTS PC WHERE PC.P_ID='"+pid+"'";
	console.log(query);
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
	  	    	output_photo(req, res, results);
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
function output_photo(req, res,photo) {
	console.log(photo);
	res.render('photo.jade', 
			{title: "Photo", photo: photo, uid: req.session.user}
		);
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if (!req.session.user) res.redirect('/');
	var pid = req.params.pid;
	query_db(req,res, pid)
};
