// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function query_db(req,res,tid,uid,fuid) {
	  var uid = JSON.stringify(req.session.user);
	  fuid = JSON.stringify(fuid);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	
	    	var query = "UPDATE FRIEND_REQUESTS FR SET FR.ACCEPTED=1" +
	    			"WHERE FR.REQUESTED_USERS = " + uid.replace(/"/g, "'") + "AND FR.REQUESTED_BY = " + fuid.replace(/"/g, "'");
	    	if (tid){
	    		query = "UPDATE INVITE_TRIP IT SET IT.ACCEPTED=1" +
    			"WHERE IT.INVITED_USERS = " + uid.replace(/"/g, "'") + "AND IT.INVITED_BY = " + fuid.replace(/"/g, "'"); 
	    	}
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	console.log(query);
		  	   		connection.execute(query, 
		 	  			   [], 
		 	  			   function(err, results) {
		  	   				if ( err ) {
		  	   					console.log(err);
		  	   					res.redirect('/');
		  	   				} else {
		  	   					connection.close(); // done with the connection
		  	   					if(tid == null || tid.length == 0){
		  	   						addFriendsWith(res, uid,fuid)
		  	   					}
		  	   					else{
		  	   						output_accept_request(res, "Accepted Request from" + fuid + "!");
		  	   					}
		  	   				}
		 	
		  	   			});
		  	    	}
		  	    }
		
		  	); // end connection.execute
	    }
	  }); // end oracle.connect••••••
	}

function addFriendsWith(res, uid,fuid){
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	var query = "INSERT INTO FRIENDS_WITH " + "VALUES ('" + fuid.replace(/"/g, "")+ "', '" + uid.replace(/"/g, "") + "')";
	    	console.log(query);
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/'); 
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_accept_request(res, "Accepted Request from" + fuid + "!");
		  	    }
		
		  	}); // end connection.execute
	    }
		  });

}

function output_accept_request( res, message) {
	res.render('signup.jade',
		   { title: message}
	  );
}


/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req, res, req.query.tid, req.query.uid, req.query.fuid);
	
};