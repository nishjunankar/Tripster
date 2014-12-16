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
function query_db(req,res,userid,password,firstname,lastname,email) {
  oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
	  	// selecting rows
	  	connection.execute("SELECT * FROM USERS U WHERE U.U_ID = " + "'" + userid + "'"
	  		+ " OR U.EMAIL = " + "'" + email + "'", 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	connection.close();
	  	    	//if taken already
	  	    	if (results.length > 0){
	  	   			console.log("Username/Email already exists");
	  	   			res.render('index.jade', { 
	  					title: 'Username or Email Taken' 
  					});
	  	   		}
	  	   		//insert
	  	   		else{
	  	   			insert_db(req,res,userid,password,firstname,lastname,email);
	  	    	}
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
}

function insert_db(req,res,userid,password,firstname,lastname,email) {
	oracle.connect(connectData, function(err, connection) {
    if ( err ) {
    	console.log(err);
    } else {
    	var bcrypt = require('bcrypt')
	  	var salt = bcrypt.genSaltSync(10);
		// Hash the password with the salt
		var hash = bcrypt.hashSync(password, salt) + "";
		//console.log(bcrypt.compareSync(password, hash)); // true);
    	var query = construct_query(userid,hash,firstname,lastname,email);
	  	// Inserting into db
	  	connection.execute(query, 
	  			   [], 
	  			   function(err, results) {
	  	    if ( err ) {
	  	    	console.log(err);
	  	    } else {
	  	    	req.session.user = userid;
	  	    	//console.log("Worked");
	  	    	console.log(results);
	  	    	connection.close(); // done with the connection
	  	    	//THIS IS WHERE YOU SHOULD CALL YOUR FUNCTION
	  	    	//YOU CAN REMOVE LINE OF CODE BELOW
	  	    	output_actors(res,userid);
	  	    }
	
	  	}); // end connection.execute
    }
  }); // end oracle.connect
	
}

function construct_query(userid,hash,firstname,lastname,email) {
	var query = "INSERT INTO USERS " +
		"VALUES ('" + userid + "', '" + hash + "', '" + firstname
		+ "', '" + lastname + "', '" + email + "', " +" null,null)";
	return query;
}

/////
// Given a set of query results, output a table
//
// res = HTTP result object sent back to the client
// userid = Name to query for
// results = List object of query results
function output_actors(res,userid) {
	res.render('signup.jade',
		   { title: "Thanks for joining " + userid}
	  );
}

/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	query_db(req,res,req.query.userid, req.query.password, 
		req.query.firstname, req.query.lastname, req.query.email);
};