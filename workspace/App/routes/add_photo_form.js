// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

function query_db(req, res, op, tid) {
  var uid = req.session.user;
  
  if (!uid) res.redirect('/');

	var query="SELECT A.A_ID, A.NAME FROM ALBUM A WHERE A.CREATOR='" + uid +"' ";
	
	oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
		  	// selecting rows
	    	console.log(query);
		  	connection.execute(query, 
		  			   [], 
		  			   function(err, results) {
		  	    if ( err ) {
		  	    	console.log(err);
		  	    	res.redirect('/');
		  	    } else {
		  	    	connection.close(); // done with the connection
		  	    	output_add_photo_form(req, res, results, op, tid); 	    	
		  	    }
		
		  	}); // end connection.execute
	    }
		  }); //
	
}



function output_add_photo_form(req, res, albums, op, tid) {
	res.render('add_photo_form.jade', 
			{albums: albums, op: op, uid: req.session.user, tid: tid}
		);
}

exports.do_work = function(req, res){
	query_db(req,res,req.query.op, req.query.tid);
	
};
