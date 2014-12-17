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
function query_db(res, uid, pid, comment) {
  // TODO: Ensure that uid is equal to the user id of the user, and if
	// not do not let the like go through
	
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = construct_query_comment_photo(uid, pid, comment);
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	res.redirect('back')
	  	    	connection.close(); // done with the connection
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function construct_query_comment_photo(uid,pid, comment) {
	var query = "INSERT INTO COMMENTS_PHOTO (U_ID, P_ID, COMMENT_STRING) " +
		"VALUES ('" + uid + "', '" + pid + "', '" + comment + "')";
	return query;
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res, req.params.uid, req.params.pid, req.query.comment);
};
