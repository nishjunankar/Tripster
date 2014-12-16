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
function connect_and_query(query) {
	
	
}

function query_db(req, res) {
  var uid = req.session.user;
  //console.log('querying db' + uid);
 
  if (!uid) res.redirect('/');
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = construct_query_friends_trips(uid);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/');
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	console.log(results);
	  	    	output_newsfeed(req, res, results);	  	    	
	  	    }
	
	  	}); // end connection.execute
    }
	  }); // end oracle.connect

}


function construct_query_friends_trips(uid) {
	var query="";
	query += "WITH FRIENDS AS ( \n";
	query += "SELECT FW.OTHER_FRIEND\n";
	query += "FROM Users u\n";
	query += "INNER JOIN Friends_With FW ON FW.Friend = U.u_id\n";
	query += "WHERE U.u_id = '" + uid + "'\n";
	query += "),\n";
	query += "TRIPS_ACCEPTED_BY_FRIENDS AS (\n";
	query += "SELECT T.T_ID, F.OTHER_FRIEND\n";
	query += "FROM  Friends F\n";
	query += "INNER JOIN Invite_Trip IT ON IT.Invited_Users = F.Other_Friend\n";
	query += "INNER JOIN Trip T ON T.T_ID = IT.T_ID\n";
	query += "WHERE IT.Accepted = 1\n";
	query += "AND PRIVACY_FLAG = 0\n";
	query += "),\n";
	query += "";
	query += "TRIPS_CREATED_BY_FRIENDS AS (\n";
	query += "SELECT T.T_ID, F.OTHER_FRIEND\n";
	query += "FROM Friends F\n";
	query += "INNER JOIN Trip T ON T.Creator = F.Other_Friend\n";
	query += "WHERE PRIVACY_FLAG = 0\n";
	query += "),\n";
	query += "";
	query += "TRIPS_BY_FRIENDS AS (\n";
	query += "SELECT *\n";
	query += "FROM TRIPS_CREATED_BY_FRIENDS TCBF UNION  SELECT * FROM TRIPS_ACCEPTED_BY_FRIENDS TABF\n";
	query += ")\n";
	query += "";
	query += "SELECT T.T_ID, TBF.OTHER_Friend AS Friend, T.START_DATE, T.END_DATE, T.Location, T.Name AS Trip_Name, U.First_name, U.Last_name\n";
	query += "FROM TRIPS_BY_FRIENDS TBF\n";
	query += "INNER JOIN Trip T ON T.T_ID = TBF.T_ID\n";
	query += "INNER JOIN Users U ON TBF.Other_Friend = U.U_ID\n";
	query += "WHERE ROWNUM <= 30";

	return query;
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_newsfeed(req, res,trips) {
	//console.log('in output');
	res.render('newsfeed_trips.jade',
		   { title: "Newsfeed for user " + req.session.user,
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
