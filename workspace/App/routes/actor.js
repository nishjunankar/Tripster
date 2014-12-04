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
// userid = Name to query for
function query_db(req,res,userid,password) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM USERS U WHERE U.U_ID = " + "'" + userid + "'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	//if no query returned or wrong password
	  	    	if (results.length < 1 || results[0].PASSWORD_HASH != password){
	  	    		connection.close();
	  	   			console.log("Wrong Username or Password");
	  	   			res.render('index.jade', { 
	  					title: 'Wrong Username or Password' 
  					});
	  	   		}
	  	   		//else correct password
	  	   		else{
	  	   			req.session.uid = userid;
	  	   			console.log(userid);
					console.log(req.session.userid);
	  	    		connection.close(); // done with the connection
	  	    		output_actors(res, userid, results);
	  	    	}
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// userid = Name to query for
// results = List object of query results
function output_actors(res,userid,results) {
	res.render('actor.jade',
		   { title: "Hi " + userid,
		     results: results }
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req,res,req.query.userid, req.query.password);
};
