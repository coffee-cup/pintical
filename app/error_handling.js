var logger = require('./logger');

function errorHandler(err, req, res) {
  req.unhandledError = err;

  var message = err.message;
  var error = err.error || err;
  var status = err.status || 500;

  var j = {message: message, error: error};
  if (status == 500) {
    logger.error(j);
  }else {
    logger.warn(j);
  }
  res.json(j, status);
}

module.exports = errorHandler;
