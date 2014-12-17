// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

function insert_db(req, res, gid, tid, start_date, end_date, name, location, privacy, uid) {

    	query_create_trip(tid, start_date, end_date, name, location, privacy, uid);
	  	
    	output_trip(res,name);

}

//TRIP
function query_create_trip(tid,start_date, end_date, name, location, privacy, uid) {
	var query = "INSERT INTO TRIP " +
		"VALUES ('" + tid + "', '" + location + "', '" + start_date + "', '" + end_date + "', '" + privacy + "', '" + name + "', '" + uid + "')\n";
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	console.log(query);
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    } else {
		  	    	connection.close(); 
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
function output_trip(res, name) {
	res.render('signup.jade',
		   { title: "Created " + name}
	  );
}
/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	insert_db(req, res, req.query.gid, req.query.tid, req.query.start_date, req.query.end_date, req.query.name, req.query.location, req.query.privacy, req.query.uid);
	
};
