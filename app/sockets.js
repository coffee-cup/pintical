var socketio = require('socket.io');
var logger = require('./app/logger');

module.exports.listen = function(app) {
  io = socketio.listen(app);

  io.on('connection', function(socket) {
    logger.info('user connected');
  });
}
