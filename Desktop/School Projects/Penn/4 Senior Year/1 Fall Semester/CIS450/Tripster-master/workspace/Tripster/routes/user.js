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
function query_db(res, user_data_query, is_friends_query) {
  // TODO: Ensure that uid is equal to the user id of the user, and if
	// not do not let the like go through
	console.log(user_data_query);
	console.log(is_friends_query);
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute(user_data_query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	var user_data = results
	  	    	connection.close(); // done with the connection
	  	    	oracle.connect(connectData, function(err, connection) {
	  	    	    if ( err ) {
	  	    	    	console.log(err);
	  	    	    } else {
	  	    		  	// selecting rows
	  	    		  	connection.execute(is_friends_query, 
	  	    		  			   [], 
	  	    		  			   function(err, results) {
	  	    		  	    if ( err ) {
	  	    		  	    	console.log(err);
	  	    		  	    } else {
	  	    		  	    	output_user_page(res,user_data, results);
	  	    		  	    	connection.close(); // done with the connection
	  	    		  	    }
	  	    		
	  	    		  	}); // end connection.execute
	  	    	    }
	  	    	  }); // end oracle.connect
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}


function get_user_page(res,page_uid, logged_in_uid) {
	var user_data_query = "SELECT U.U_ID, U.FIRST_NAME, U.LAST_NAME, U.EMAIL, U.AFFILIATION \n";
	user_data_query += "FROM USERS U WHERE U.U_ID='" + page_uid + "'";
	
	// returns null if logged in user and viewed user are not friends
	var is_friends_query = "SELECT * FROM USERS U \n";
	is_friends_query += "INNER JOIN FRIENDS_WITH FW ON U.U_ID=FW.FRIEND \n";
	is_friends_query += "WHERE U.U_ID='"+page_uid+"' AND FW.OTHER_FRIEND='"+logged_in_uid+"'";
	
	query_db(res, user_data_query, is_friends_query);
	
}


function output_user_page(res,user_info, is_friends) {
	res.render('user.jade',
		   { title: "User ",
		     user_info: user_info,
		     is_friends: is_friends}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	
	// this is the uid of the user being viewed
	var page_uid = req.params.uid;
	get_user_page(res, page_uid, req.session.user);
};