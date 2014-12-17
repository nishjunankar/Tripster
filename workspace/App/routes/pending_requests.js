// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function query_db_invite_reqs(req, res) {
  var uid = JSON.stringify(req.session.user);
  
  if (!uid) res.redirect('/');
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	var query = "SELECT IT.ACCEPTED ITA, IT.INVITED_BY, IT.T_ID, T.NAME, U.FIRST_NAME, U.LAST_NAME " +
    			"FROM INVITE_TRIP IT " + 
    			"LEFT JOIN Trip T on T.T_ID=IT.T_ID " +
    			"LEFT JOIN Users U on U.U_ID = IT.INVITED_BY WHERE " + 
    			"IT.Accepted = '0' AND IT.INVITED_USERS = " + uid.replace(/"/g, "'")
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/'); 
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	query_db_friend_reqs(req, res, results);	  	    	
	  	    }
	
	  	}); // end connection.execute
    }
	  }); // end oracle.connect

}

function query_db_friend_reqs(req, res, invites) {
	  var uid = JSON.stringify(req.session.user);
	  
	  if (!uid) res.redirect('/');
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	var query = "SELECT FR.ACCEPTED FRA,FR.REQUESTED_BY, U.FIRST_NAME, U.LAST_NAME " +
	    			"FROM FRIEND_REQUESTS FR " + 
	    			"LEFT JOIN Users U on U.U_ID = FR.REQUESTED_BY " +  
	    			"WHERE FR.Accepted='0' AND FR.REQUESTED_USERS = " + uid.replace(/"/g, "'")
	    	console.log(query);
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/'); 
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_pending_requests(req, res, invites, results);	  	    	
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
function output_pending_requests(req, res,invites, friend_reqs) {
	console.log(invites)
	console.log(friend_reqs)
	res.render('pending_requests.jade',
		   { title: "Pending Requests",
		     invites: invites,
		     friend_reqs: friend_reqs,
		     uid: req.session.user}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	if (!req.session.user) res.redirect('/');
	query_db_invite_reqs(req, res);
};