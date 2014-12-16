var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

function getTID(req, res){
	  oracle.connect(connectData, function(err, connection) {
	    if ( err ) {
	    	console.log(err);
	    } else {
	    	connection.execute("SELECT * FROM (SELECT MAX(T_ID) AS MAX FROM TRIP) UNION (SELECT MAX(G_ID) AS MAX FROM GROUPS)", 
	 			   [], 
	 			   function(err, results) {
	 	    if ( err ) {
	 	    	console.log(err);
	 	    } else {
	 	    	connection.close();
	 	    	var data_tid =  JSON.stringify(results[1]['MAX']);
	 	    	var max_tid = parseInt(data_tid);
	 	    	var data_gid =  JSON.stringify(results[0]['MAX']);
	 	    	var max_gid = parseInt(data_gid);
	 	    	var tid = parseInt(max_tid) + 1;
	 	    	var gid = parseInt(max_gid) + 1;
	 	    	
	 	    	call_create_trip(req, res, tid, gid)
	 	    }
	 	  });
	    }
	  }); // end oracle.connect
	
}

function call_create_trip(req, res, tid, gid) {
	//console.log('in output');
	res.render('create_trip_form.jade',
		   { title: "Create Trip for user " + req.session.user,
		     tid: tid,
		     gid: gid,
		     uid: req.session.user}
	  );
}

exports.do_work = function(req, res){
  getTID(req, res);
};