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
function query_db(uid, res, user_data_query) {
	 
	  if (!uid) res.redirect('/');
  // TODO: Ensure that uid is equal to the user id of the user, and if
	// not do not let the like go through
	console.log(user_data_query);
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
	  	    	res.redirect('/');
	  	    } else {
	  	    	var user_data = results
	  	    	connection.close(); // done with the connection
	  	    	output_user_page(res,user_data);
	  	    		
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}


function get_user_page(res, logged_in_uid) {
	var user_data_query = "SELECT U.U_ID, U.FIRST_NAME, U.LAST_NAME, U.EMAIL, U.AFFILIATION \n";
	user_data_query += "FROM USERS U WHERE U.U_ID='" + logged_in_uid + "'";
	
	query_db(logged_in_uid, res, user_data_query);
	
}


function output_user_page(res,user_info) {
	res.render('edit.jade',
		   { title: "User ",
		     user_info: user_info}
	  );
}



exports.do_work = function(req, res){
	
	get_user_page(res, req.session.user);
};
