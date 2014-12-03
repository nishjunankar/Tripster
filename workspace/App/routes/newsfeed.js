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
function query_db(res) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = construct_query_friends_photos('7');
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_newsfeed(res, results);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function construct_query_friends_photos(uid) {
	var query = "WITH FRIENDS AS ( \n" +
		"SELECT FW.OTHER_FRIEND\n" +
		"FROM Users u\n" +
		"INNER JOIN Friends_With FW ON FW.Friend = U.u_id\n" +
		"WHERE U.u_id = '"+ uid + "'\n" +
		"" +
		"),\n" +
		"" +
		"PHOTOS_BY_FRIENDS AS (\n" +
		"SELECT P.PUBLISHED_BY, P.URL, P.TIME, A.Name, A.A_ID\n" +
		"FROM PHOTO P\n" +
		"INNER JOIN Friends F ON F.OTHER_FRIEND = P.PUBLISHED_BY\n" +
		"INNER JOIN Album A ON A.A_ID = P.A_ID\n" +
		")\n" +
		"SELECT *\n" +
		"FROM PHOTOS_BY_FRIENDS\n" +
		"ORDER BY TIME DESC";
	return query;
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_newsfeed(res,results) {
	res.render('newsfeed.jade',
		   { title: "Newsfeed for user ",
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res);
};
