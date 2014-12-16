
exports.do_work = function(req, res){
	res.render('invite_friend_form.jade',
			   { tid: req.query.tid}
		  );
};
