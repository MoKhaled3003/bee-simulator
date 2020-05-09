var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./controller/v1/indexRouter');
var V0MODELS = require('./controller/v1/indexModels')
var xmlparser = require('express-xml-bodyparser');
var {sequelize} = require('./controller/v1/indexModels');



sequelize.sync({
//force : true
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(xmlparser({
  explicitArray : false
}));

app.use((err, req, res, next) => {
  // you can error out to stderr still, or not; your choice
  console.error(err); 

  // body-parser will set this to 400 if the json is in error
  if(err.status === 400)
    return res.status(err.status).send('bad XML content');

  return next(err); // if it's not a 400, let the default error handling do it. 
});

app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', indexRouter);


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

module.exports = app;
