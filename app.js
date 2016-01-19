var express = require('express');
var path = require('path');
var logger = require('morgan');
var routes = require('./routes/index');

var app = express();
app.use((req, res, next) => {
  if (!req.query.filter) req.query.filter = '.';
  next();
});

app.use(logger('dev'));

app.use('/', routes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

module.exports = app;
