// modules
var express       = require('express');
var mongoose      = require('mongoose');
var logger        = require('./app/logger');
var error_handler = require('./app/error_handling');

// configuration

var app = express();

// config files
var db = require('./config/db');

var port = process.env.PORT || 9090;
mongoose.connect(db.url);

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(express.logger('dev'));
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

// app.use(error_handler);

// setup server and listen on ports
var server = app.listen(port);
var io = require('socket.io').listen(server);

// routes
require('./app/routes')(app, io);

logger.info('Magic happens on port ' + port);
// console.log('Magic happens on port ' + port);
exports = module.exports = app;
