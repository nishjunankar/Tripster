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
  var photos = null;
  var uid = req.session.user;
  console.log('querying db' + uid);
 
  if (!uid) res.redirect('/');
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	query = construct_query_friends_photos(uid);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/');
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	photos = results;
	  	    	console.log(results);
	  	    	output_newsfeed(req, res, photos);	  	    	
	  	    }
	
	  	}); // end connection.execute
    }
	  }); // end oracle.connect

}


function construct_query_friends_photos(uid) {
	//console.log('constructing');
	var	query = "WITH FRIENDS AS ( \n";
	query += "SELECT FW.OTHER_FRIEND, u.U_ID AS this_user\n";
	query += "FROM Users u\n";
	query += "INNER JOIN Friends_With FW ON FW.Friend = U.u_id\n";
	query += "WHERE U.u_id = '" + uid +"'\n";
	query += "),\n";
	query += "PHOTOS_BY_FRIENDS AS (\n";
	query += "SELECT P.P_ID, P.PUBLISHED_BY, P.URL, TO_CHAR(P.TIMES, 'Month D HH12:MI PM') AS TIMES, A.Name, A.A_ID\n";
	query += "FROM PHOTO P\n";
	query += "INNER JOIN Friends F ON F.OTHER_FRIEND = P.PUBLISHED_BY\n";
	query += "INNER JOIN Album A ON A.A_ID = P.A_ID\n";
	query += "),\n";
	query += "LIKES AS (\n";
	query += "SELECT LP.P_ID AS L_P_ID, COUNT(LP.U_ID) AS LIKES\n";
	query += "FROM LIKE_PHOTO LP\n";
	query += "GROUP BY LP.P_ID\n";
	query += "),\n";
	query += "FEED_PHOTOS AS (\n";
	query += "SELECT *\n";
	query += "FROM PHOTOS_BY_FRIENDS PBF\n";
	query += "INNER JOIN Users U ON U.U_ID = PBF.PUBLISHED_BY\n";
	query += "LEFT JOIN LIKES L ON L.L_P_ID = PBF.P_ID\n";
	query += "WHERE ROWNUM <= 40\n";
	query += "ORDER BY TIMES DESC\n";
	query += "\n";
	query += "),\n";
	query += "TOTAL_U_LIKE_F AS (\n";
	query += "  SELECT P.published_by AS user_id, COUNT(DISTINCT P.P_ID) AS totalULikeF\n";
	query += "	FROM like_photo LP\n";
	query += "	inner join photo P on P.P_ID=LP.P_ID\n";
	query += "	inner join users U on u.u_id = P.published_by\n";
	query += "	WHERE LP.U_ID = '" + uid + "'\n";
	query += "	GROUP BY P.published_by, U.first_name, U.last_name\n";
	query += "	Order BY COUNT(Distinct P.P_id)\n";
	query += ")\n";
	query += "Select *\n";
	query += "FROM FEED_PHOTOS FP\n";
	query += "LEFT JOIN TOTAL_U_LIKE_F TULF ON TULF.user_id = FP.Published_by\n";
	query += "ORDER BY TULF.totalULikeF DESC\n";
	//console.log("inq" +query);
	return query;
}
/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_newsfeed(req, res,photos) {
	//console.log('in output');
	res.render('newsfeed.jade',
		   { title: "Newsfeed for user " + req.session.user,
		     photos: photos,
		     uid: req.session.user}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	//console.log('in newsfeed');
	query_db(req, res);
};