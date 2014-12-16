// Connect string to Oracle
var connectData = { 
  "hostname": "tripster.cvng6l9rlc1v.us-east-1.rds.amazonaws.com",
  "port": 1521,
  "user": "cis450", 
  "password": "cis4501234", 
  "database": "c450proj" };
var oracle =  require("oracle");

function update_db(req,res,first,last,email,affiliation){
	oracle.connect(connectData, function(err, connection) {
	      if ( err ) {
	    	console.log(err);
	      } else {
	    	  var query = "";
	    	  query+="UPDATE USERS \n";
	    	  query+="SET";
	    	  query+=(first==="") ? "" : " FIRST_NAME='"+first+"',";
	    	  query+=(last==="") ? "" : " LAST_NAME='"+last+"',";
	    	  query+=(email==="") ? "": " EMAIL='"+email+"',";
	    	  query+=(affiliation==="") ? "": " AFFILIATION='"+affiliation+"',";
	    	 // console.log(query.substring(0,query.length-1));
	    	  if(query.substring(query.length-1)===","){
	    		query = query.substring(0,query.length-1);
	    	  }
	    	  query+="\n";
	    	  query+="WHERE U_ID='"+req.session.user+"'"

	    	  console.log(query);
	    	  
	    	  connection.execute(query, [], function(err,results){
    		    if ( err ) {
    		  	  console.log(err);
    		    }
    		    else{
    		    		res.redirect('/newsfeed');
    		    }
	    		 
	    		  
	    	  });
	      }
	});
}




/////
//This is what's called by the main app 
exports.do_work = function(req, res){
	update_db(req,res,req.query.first,req.query.last,req.query.email,req.query.affiliation);
};
