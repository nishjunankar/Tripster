// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

function insert_db(req, res, op, aid, album_name, image, privacy, tid) {
	var uid = req.session.user;
	
    var date;
    date = new Date();
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    date = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
    
	if (!uid) res.redirect('/');
	
	if (op == "0"){
		if (album_name != null && album_name.length!=0){
	   		aid = create_album(res,album_name, privacy, uid, date);
	    }
		add_photo(res,image, uid, aid, date);
	}
	else if (op == "1"){
   		if(aid != null && aid.length != 0){
   			add_album_trip (res,aid, tid, date, uid);
   		}
    }
	else{
		var pid = add_photo(res,image,uid,'',date);
		
		add_photo_trip (res,uid, tid, date, image,pid);
	}
	
	output_add_photo(res);

}

function add_photo_trip(res, uid, tid, date, image,pid){
	var query = "INSERT INTO PHOTO_SHARE_TRIP " +
	"VALUES ('" + pid + "', '" + tid + "', '" + date + "', '" + uid + "')\n";
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
	  });
}

function add_album_trip(res, aid, tid, date, uid){
	var pid = Math.random().toString(32).substring(6);
	var query = "INSERT INTO ALBUM_SHARE_TRIP " +
	"VALUES ('" + aid + "', '" + tid + "', '" + date + "', '" + uid + "')\n";
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
	  });
}

function create_album(res, album_name, privacy, uid, date){
	var aid = Math.random().toString(32).substring(6);
	var query = "INSERT INTO ALBUM " +
	"VALUES ('" + aid + "', '" + date + "', '" + album_name + "', '" + privacy + "', '" + uid + "')\n";
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
		  	    	return aid;
		  	    }
		
		  	}); // end connection.execute
	    }
	  });
}

function add_photo(res, image, uid, aid, date){
	var pid = Math.random().toString(32).substring(6);
	var query = "INSERT INTO PHOTO " +
	"VALUES ('" + pid + "', '" + image + "', '" + uid + "', '" + aid + "', '" + date + "')\n";
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
		  	    	return pid;
		  	    }
		
		  	}); // end connection.execute
	    }
	  });
}


function output_add_photo(res) {
	res.render('signup.jade',
		   { title: "Upload Successful."}
	  );
}
/////
// This is what's called by the main app 
exports.do_work = function(req, res){
	insert_db(req, res, req.query.op, req.query.aid, req.query.album_name, req.query.image, req.query.privacy, req.query.tid);
	
};