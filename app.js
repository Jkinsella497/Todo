require("./db");

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var engine = require('ejs-locals');
var createError = require('http-errors');
var cookie_Parser = require('cookie-parser');
var logger = require('morgan');
var body_Parser = require('body-parser');
var app = express();
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

mongoose.connect( 'mongodb://127.0.0.1:27017/checkId', {}).then(
  () => { console.log("Connected");/** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
  err => { console.log(err);}
);
var db = mongoose.connection;

console.log("Required db");

var app = express();

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// all environments
app.use( body_Parser());
app.use( cookie_Parser());
app.engine( 'ejs', engine );
app.set( 'views', path.join( __dirname, 'views' ));
app.set( 'view engine', 'ejs' );

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use( express.json());
app.use( express.static( path.join( __dirname, 'public' )));



// Routes
app.use(routes);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

http.createServer( app ).listen( 3000, function (){
  console.log( 'Express server listening on port ' + 3000);
});

module.exports = app;
