// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com:1521", 
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function query_db(res,name) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM users WHERE last_name='" + name + 
	  			"' AND rownum <= 10", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_actors(res, name, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function construct_query_friends_photos(uid) {
	var query = "WITH FRIENDS AS ( " +
		"SELECT FW.OTHER_FRIEND" +
		"FROM Users u" +
		"INNER JOIN Friends_With FW ON FW.Friend = U.u_id" +
		"WHERE U.u_id = '7'" +
		"" +
		")," +
		"" +
		"PHOTOS_BY_FRIENDS AS (" +
		"SELECT P.PUBLISHED_BY, P.URL, P.TIME, A.Name, A.A_ID" +
		"FROM PHOTO P" +
		"INNER JOIN Friends F ON F.OTHER_FRIEND = P.PUBLISHED_BY" +
		"INNER JOIN Album A ON A.A_ID = P.A_ID" +
		")" +
		"SELECT *" +
		"FROM PHOTOS_BY_FRIENDS" +
		"ORDER BY TIME DESC;"
	return query
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_actors(res,name,results) {
	res.render('actor.jade',
		   { title: "Users with last name " + name,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res,req.query.name);
};
