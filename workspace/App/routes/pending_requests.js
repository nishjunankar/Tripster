// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function query_db(req, res) {
  var photos = null;
  var uid = JSON.stringify(req.session.user);
  
  if (!uid) res.redirect('/');
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
    	var query = "SELECT IT.INVITED_BY, IT.T_ID, FR.REQUESTED_BY " +
    			"FROM INVITE_TRIP IT FULL OUTER JOIN FRIEND_REQUESTS FR ON IT.INVITED_USERS = FR.REQUESTED_USERS WHERE " + 
    		"IT.INVITED_USERS = " + uid.replace(/"/g, "'");
    	console.log(query);
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    	res.redirect('/'); 
	  	    } else {
	  	    	connection.close(); // done with the connection
	  	    	output_pending_requests(req, res, results);	  	    	
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
function output_pending_requests(req, res,requests) {
	console.log(requests);
	results = [];
	for (i = 0; i < requests.length; i++){
		results.push()
	}
	res.render('pending_requests.jade',
		   { title: "Pending Requests",
		     requests: requests,
		     uid: req.session.user}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req, res);
};