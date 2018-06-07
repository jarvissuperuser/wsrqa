var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var regressiontest = require('./routes/regressiontest');
var record = require('./routes/record');
let userjourney = require('./routes/userjourney');
let userjourneytest = require('./routes/userjourneytest');
let compare = require('./routes/compare');
let search = require('./routes/searchjson');
let quality = require('./routes/quality');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use('/record',record);
app.use('/userjourney',userjourney);
app.use('/ujtest',userjourneytest);
app.use('/', index);
app.use('/home', index);
app.use('/users', users);
app.use('/regressiontest', regressiontest);
app.use('/compare', compare);
app.use('/search', search);
app.use('/quality', quality);
app.use(function(req, res, next) {
    var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
