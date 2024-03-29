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
  , actor = require('./routes/actor')
  , newsfeed = require('./routes/newsfeed')
  , user = require('./routes/user')
  , like = require('./routes/like')
  , signup = require('./routes/signup')
  , newsfeed_trips = require('./routes/newsfeed_trips')
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
app.get('/search', search.do_work);

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