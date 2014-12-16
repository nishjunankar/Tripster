// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function query_db(req,res,fuid) {
	  var uid = JSON.stringify(req.session.user);
	  fuid = JSON.stringify(fuid);
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	var query = "SELECT * FROM USERS U WHERE U.U_ID = " + fuid.replace(/"/g, "'") + "OR U.EMAIL = " + fuid.replace(/"/g, "'");
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	if (results.length < 1){
		  	    		connection.close();
		  	   			output_request_friend(res, "Username " + fuid + " does not exist.");
		  	   		}
		  	   		//else correct password
		  	   		else{
		  	   			
		  	   			query = "INSERT INTO FRIEND_REQUESTS " + "VALUES ('" + fuid.replace(/"/g, "")+ "', '" + uid.replace(/"/g, "") + "', '" + 0 + "')"
		  	   			console.log(query);
		  	   			
		  	   			connection.execute(query, 
		 	  			   [], 
		 	  			   function(err, results) {
		  	   				if ( err ) {
		  	   					console.log(err);
		  	   					res.redirect('/');
		  	   				} else {
		  	   					connection.close(); // done with the connection
		  	   					output_request_friend(res, "Sent a request to " + fuid + "!");
		  	   					  	    	
		  	   				}
		 	
		  	   			});
		  	    	}
		  	    }
		
		  	}); // end connection.execute
	    }
	  }); // end oracle.connect••••••
	}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// name = Name to query for
// results = List object of query results
function output_request_friend( res, message) {
	res.render('signup.jade',
		   { title: message}
	  );
}


/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	//console.log('in newsfeed');
	if(req.query.fuid){
		query_db(req, res, req.query.fuid);
	}
};