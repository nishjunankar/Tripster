// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

var uid = '1';
/////
// Query the oracle database, and call output_actors on the results
//
// res = HTTP result object sent back to the client
// name = Name to query for
function connect_and_query(query) {
	
	
}

function query_db(res) {
  var photos = null;
  var trips = null;
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = construct_query_friends_photos(uid);
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	photos = results;
	  	    	
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
	  	   		  	    } else {
	  	   		  	    	connection.close(); // done with the connection
	  	   		  	    	trips = results;
	  	   		  	    	output_newsfeed(res, photos, trips);
	  	   		  	    }
	  	   		
	  	   		  	}); // end connection.execute
	  	   	    }
	  	   	  }); // end oracle.connect
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
		"SELECT P.P_ID, P.PUBLISHED_BY, P.URL, TO_CHAR(P.TIMES, 'Month D HH12:MI PM') AS TIMES, A.Name, A.A_ID\n" +
		"FROM PHOTO P\n" +
		"INNER JOIN Friends F ON F.OTHER_FRIEND = P.PUBLISHED_BY\n" +
		"INNER JOIN Album A ON A.A_ID = P.A_ID\n" +
		"),\n" +
		"LIKES AS (\n" +
		"SELECT LP.P_ID AS L_P_ID, COUNT(LP.U_ID) AS LIKES\n" +
		"FROM LIKE_PHOTO LP\n"+
		"GROUP BY LP.P_ID\n"+
		")\n"+
		"SELECT *\n"+
		"FROM PHOTOS_BY_FRIENDS PBF\n"+
		"INNER JOIN Users U ON U.U_ID = PBF.PUBLISHED_BY\n" +
		"LEFT JOIN LIKES L ON L.L_P_ID = PBF.P_ID\n"+
		"ORDER BY TIMES DESC";
	return query;
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

	return query;
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_newsfeed(res,photos,trips) {
	res.render('newsfeed.jade',
		   { title: "Newsfeed for user ",
		     photos: photos,
		     trips:trips,
		     uid: uid}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(res);
};
