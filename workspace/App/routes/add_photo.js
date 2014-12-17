// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");


function insert_db(req, res, op, aid, album_name, image, privacy, tid,albums) {
	var uid = req.session.user;
	var pid = Math.random().toString(32).substring(6);
	
	if(pid == null){
		pid = Math.random().toString(32).substring(6);
	}
	
	if(aid ==null){
		 aid = Math.random().toString(32).substring(6);
	}
	else{
		aid = albums[aid];
		console.log(aid);
	}
	console.log('1: '+JSON.stringify(aid));
	console.log('2 '+albums);
	console.log('3' +albums[aid]);
    var date;
    date = new Date();
    var months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    date = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
    
    var check = false;
	if (!uid) res.redirect('/');
	
	if (op == "0"){
		if (album_name != null && album_name.length!=0){
	   		create_album(res,album_name, privacy, uid, date, aid);
	    }
		add_photo(res,image, uid, aid, date,pid, tid,false);
	}
	else if (op == "1"){
   		if(aid != null && aid.length != 0){
   			add_album_trip (res,aid, tid, date, uid);
   		}
    }
	else{
		
		add_photo(res,image,uid,'',date,pid,tid,true);
	}
	
	output_add_photo(res);

}

function add_photo_trip(res, uid, tid, date, image,pid){
	var query = "INSERT INTO PHOTO_SHARE_TRIP (P_ID, T_ID, SHARED_BY) " +
	"VALUES ('" + pid + "', '" + tid + "', '" + uid + "')\n";
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
	var query = "INSERT INTO ALBUM_SHARE_TRIP (A_ID, T_ID, SHARED_BY) " +
	"VALUES ('" + aid + "', '" + tid + "', '" + uid + "')\n";
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

function create_album(res, album_name, privacy, uid, date,aid){
	var query = "INSERT INTO ALBUM (A_ID, NAME, PRIVACY_FLAG, CREATOR) " +
	"VALUES ('" + aid +  "', '" + album_name + "', '" + privacy + "', '" + uid + "')\n";
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

function add_photo(res, image, uid, aid, date,pid,tid,flag){
	var query = "INSERT INTO PHOTO (P_ID, URL, PUBLISHED_BY, A_ID) " +
	"VALUES ('" + pid + "', '" + image + "', '" + uid + "', '" + aid +  "')\n";
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
		  	    	if(flag){
		  	    		add_photo_trip (res,uid, tid, date, image,pid);
		  	    	}
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
	insert_db(req, res, req.query.op, req.query.aid, req.query.album_name, req.query.image, req.query.privacy, req.query.tid,req.query.albums);
	
};