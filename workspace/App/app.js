/**
 * Simple Homework 2 application for CIS 550
 * 
 * zives
 */

/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , login = require('./routes/login')
  , newsfeed = require('./routes/newsfeed')
  , user = require('./routes/user')
  , like = require('./routes/like')
  , signup = require('./routes/signup')
  , newsfeed_trips = require('./routes/newsfeed_trips')
  , create_trip = require('./routes/create_trip')
  , create_trip_form = require('./routes/create_trip_form')
  , my_trips = require('./routes/my_trips')
  , invite_friend = require('./routes/invite_friend')
  , invite_friend_form = require('./routes/invite_friend_form')
  , pending_requests = require('./routes/pending_requests')
  , friend_request_form = require('./routes/friend_request_form')
  , friend_request = require('./routes/friend_request')
  , http = require('http')
  , path = require('path')
  , stylus =  require("stylus")
  , nib =     require("nib")
  , morgan = require("morgan")
  , bodyParser = require("body-parser")
  , favicon = require("favicon")
  , methodOverride = require("method-override")
  , errorHandler = require("errorhandler")
  , passport = require("passport")
  , session = require('express-session')
  , search = require('./routes/search')
  , trip = require('./routes/trip')
  , edit = require('./routes/edit')
  , submit_edit = require('./routes/submit_edit')
  , photo = require('./routes/photo')
  , recommended_friends = require('./routes/recommended_friends')
  , comment = require('./routes/comment')
  ;

// Initialize express
var app = express();
// .. and our app
init_app(app);

// When we get a request for {app}/ we should call routes/index.js
app.get('/', routes.do_work);
// when we get a request for {app/login} we should call routes/login.js
app.get('/login', login.do_work);
app.get('/logout', login.logout);
app.get('/signup', signup.do_work);
app.get('/newsfeed', newsfeed.do_work);
app.get('/newsfeed_trips',newsfeed_trips.do_work);
app.get('/like', like.do_work);
app.get('/user/:uid', user.do_work);
app.get('/friend_request_form', friend_request_form.do_work);
app.get('/friend_request', friend_request.do_work);
app.get('/create_trip', create_trip.do_work);
app.get('/create_trip_form', create_trip_form.do_work);
app.get('/my_trips', my_trips.do_work);
app.get('/invite_friend', invite_friend.do_work);
app.get('/invite_friend_form', invite_friend_form.do_work);
app.get('/pending_requests', pending_requests.do_work);
app.get('/search', search.do_work);	
app.get('/create_trip', create_trip.do_work);
app.get('/create_trip_form', create_trip_form.do_work);
app.get('/trip/:tid', trip.do_work);
app.get('/my_trips', my_trips.do_work);
app.get('/photo/:pid', photo.do_work);
app.get('/edit/:uid', edit.do_work);
app.get('/submit_edit', submit_edit.do_work);
app.get('/recommended_friends', recommended_friends.do_work);
app.get('/comment/:pid/:uid', comment.do_work);

// Listen on the port we specify
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

///////////////////
// This function compiles the stylus CSS files, etc.
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib());
}

//////
// This is app initialization code
function init_app() {
	// all environments
	app.set('port', process.env.PORT || 8080);
	
	// Use Jade to do views
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');

//	app.use(favicon();
	// Set the express logger: log to the console in dev mode
	app.use(morgan("dev"));
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());
//	app.use(app.router);
	// Use Stylus, which compiles .styl --> CSS
	app.use(stylus.middleware(
	  { src: __dirname + '/public'
	  , compile: compile
	  }
	));
	app.use(express.static(path.join(__dirname, 'public')));
	//saves the user session
	app.use(session({
  		secret: 'allyourbasearebelongtous',
  		resave: false,
  		saveUninitialized: true
	}));
	// development only
	if ('development' == app.get('env')) {
	  app.use(errorHandler());
	}

}
