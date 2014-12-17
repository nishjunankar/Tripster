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

function query_db(req, res) {
	var uid = req.session.user;
	var query="WITH FRIENDS AS ( \n";
	query += "SELECT other_friend As friend_id \n";
	query += "FROM USERS U \n";
	query += "INNER JOIN FRIENDS_WITH FW ON FW.FRIEND=U.U_ID\n";
	query += "WHERE U.U_ID='2'\n";
	query += "),\n";
	query += "mutual_counts as (\n";
	query += "SELECT fw.other_friend as u_id, count(f.friend_id) as mutuals\n";
	query += "from friends f\n";
	query += "inner join friends_with fw on fw.friend= f.friend_id\n";
	query += "GROUP BY fw.other_friend\n";
	query += "),\n";
	query += "Rec_friends as (\n";
	query += "select mc.u_id\n";
	query += "from mutual_counts mc\n";
	query += "inner join users u on u.u_id = mc.u_id\n";
	query += "order by mutuals desc\n";
	query += "),\n";
	query += "rec_friends_excluding_current as (\n";
	query += "select * from \n";
	query += "(Select rf.u_id\n";
	query += "from rec_friends rf)\n";
	query += "MINUS\n";
	query += "(Select f.friend_id as u_id\n";
	query += "from friends f)\n";
	query += ")\n";
	query += "\n";
	query += "select *\n";
	query += "from rec_friends_excluding_current rf\n";
	query += "inner join mutual_counts mc on mc.u_id = rf.u_id\n";
	query += "inner join users u on u.u_id = mc.u_id\n";
	query += "order by mc.mutuals desc\n";
	query += "order by mc.mutuals desc\n";


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
	  	    	output_users(req, res, results);
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
function output_users(req, res,friends) {
	console.log(friends);
	res.render('recommended_friends.jade', 
			{title: "Recommended Friends", friends: friends, uid: req.session.user}
		);
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if (!req.session.user) res.redirect('/');
	query_db(req,res)
};
