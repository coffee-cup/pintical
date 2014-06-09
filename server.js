// modules
var express       = require('express');
var mongoose      = require('mongoose');
var logger        = require('./app/logger');
var error_handler = require('./app/error_handling');

// configuration

var app = express();

// secret variables (passwords and such)
var secrets = require('./config/secrets');

var port = process.env.PORT || 9090;

// configure db
if (process.env.NODE_ENV == 'production') {
  mongoose.connect(secrets.MODULUS_DB);
}else {
  logger.info('connected to localhost db');
  mongoose.connect(secrets.LOCAL_DB);
}

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(require('prerender-node').set('prerenderToken', '2HzURwBkqwsct8qtViw4'));
  app.use(express.logger('dev'));
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

// setup robots.txt
var robots = require('robots.txt')
app.use(robots(__dirname + '/robots.txt'))

// setup server and listen on ports
var server = app.listen(port);
var io = require('socket.io').listen(server);

// routes
require('./app/routes')(app, io);

logger.info('Magic happens on port ' + port);
// console.log('Magic happens on port ' + port);
exports = module.exports = app;
