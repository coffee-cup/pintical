// modules
var express  = require('express');
var mongoose = require('mongoose');
var logger   = require('./app/logger.js');
var limiter  = require('./app/rate-limit.js');

// configuration

var app = express();

// secret variables (passwords and such)
var secrets = require('./config/secrets');

var port = process.env.PORT || 9090;

// configure db
if (process.env.NODE_ENV == 'production') {
  mongoose.connect(secrets.MODULUS_DB);
}else {
  mongoose.connect(secrets.LOCAL_DB);
  logger.info('connected to localhost db');
}

app.configure(function () {
  app.use(express.static(__dirname + '/public'));
  app.use(require('prerender-node').set('prerenderToken', '2HzURwBkqwsct8qtViw4'));
  app.use(express.logger('dev'));
  app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
});

app
  .use(limiter());

// setup robots.txt
var robots = require('robots.txt')
app.use(robots(__dirname + '/robots.txt'))

// setup server and listen on ports
var server = app.listen(port);
var io = require('socket.io').listen(server);

// routes
// require('./app/routes')(app, io);

app.get('*', function(req, res) {
  logger.info('request for html');
  res.sendfile('./public/index.html'); // load our public/index.html file
});

logger.info('Magic happens on port ' + port);
// console.log('Magic happens on port ' + port);
exports = module.exports = app;
