var Page = require('./models/page.js'),
  Message = require('./models/message.js'),
  Password = require('./models/password.js'),
  crypto = require('crypto'),
  logger = require('./logger.js'),
  error_handler = require('./error_handling.js');
  email = require('../config/email.js'),
  pagedown = require('pagedown'),
  settings = require('../config/settings.js');

module.exports = function(app, io) {

  var converter = pagedown.getSanitizingConverter();
  var public_page_room = 'public:::pages';

  // handle incoming connections from clients
  io.sockets.on('connection', function(socket) {
    socket.on('room', function(data) {
      var s_data = data.split(':');
      var room = s_data[0];
      var pass = s_data[1];
      isAuth(room, pass, function(err, page) {
        if (err) {logger.error(err); return;}

        if (page) {
          logger.info('password for room: ' + room + ' is correct');
          logger.info('user connected to room ' + room);
          socket.join(room);
        }else {
          logger.info('password for room: ' + room + ' is incorrect');
        }
      });
    });

    // socket.on(public_page_room, function(data) {
    //   socket.join(public_page_room);
    //   logger.info('user connected to ' + public_page_room);
    // });
  });

  // helper functions =============

  // create a hash of the password
  function hashPass(pass) {
    var hash = crypto.createHash('sha256').update(pass);
    return hash.digest('hex');
  }

  // checks if the given string is all alpha charaters
  function isAlpha(s) {
    var re = new RegExp('^[a-zA-Z0-9]+');
    return re.test(s);
    }

  // checks to see if the password is correct for the given page name
  function isAuth(name, password, callback) {
    Page.findOne({
      name: name
    }, function(err, page) {
      if (err) {
        callback({message: err, status: 500}, null);
      }

      // if the page does not exist
      if (!page) {
        callback({
          status: 403,
          message: "The page does not exist"
        }, null);
        logger.info('user tried to access page that does not exist');
        return;
      }

      // no password was provided and the page needs one
      if (page.isPass && !password) {
        callback({
          status: 403,
          message: "A password is required"
        }, null);
        logger.warn('a password is required to access the page');
        return;
      } else {
        Password.findOne({
          _page: page._id
        }, function(err, pass) {
          // the password does not match the one in the db
          if (!pass && page.isPass) {
            callback({
              status: 500,
              message: "Could not find password in the db"
            });
            logger.error('could not find password in the db');
            return;
          } else if (page.isPass && pass.password != hashPass(password)) {
            callback({
              status: 403,
              message: "The password is incorrect"
            }, null);
            logger.warn('the entered password is incorrect');
            return;
          }

          callback(null, page)
        });
      }
    });
  }

  // server routes ==============

  // get all the pages with no password
  app.get('/api/pages', function(req, res) {
    var limit = req.query.limit || null;
    var sort = req.query.sort || '-messagesLength';
    var skip = req.query.skip || null;

    Page.find({isPass: false})
    .sort(sort)
    .limit(limit)
    .skip(skip)
    .exec(function(err, pages) {
      if (err) return error_handler(err, req, res);

      res.json(pages); // return all the pages in json
      logger.info('all public pages returned');
    });
  });

  // get a specific page
  app.get('/api/page/:name', function(req, res) {
    Page.findOne({
      name: req.params.name
    }, function(err, doc) {
      if (err) return error_handler(err, req, res);
      if (doc) {
        res.json(doc);
      } else {
        logger.warn('attempt to get a page that does not exist');
        return error_handler({message: 'The page does not exist', status: 404}, req, res);
      }
    });
  });

  // create a specific page
  app.post('/api/page/:name', function(req, res) {
    if (req.body.password && req.body.password.length > settings.MAX_PASSWORD_LENGTH) {
      logger.warn('the password is to long');
      res.send({status: 'failure', message: 'the password needs to be under ' + settings.MAX_PASSWORD_LENGTH + ' characters'});
      return;
    }
    if (req.params.name.length > settings.MAX_PAGE_LENGTH) {
      logger.warn('the page name is too long')
      res.send({status: 'failure', message: 'The page name is too long'});
      return;
    }else if(!isAlpha(req.params.name)) {
      logger.warn('the page name is not made of all alpha character');
      res.send({status: 'failure', message: 'The page name is not all alpha characters'});
      return;
    }

    Page
      .findOne({
        name: req.params.name
      }, function(err, page) {
        if (err) return error_handler(err, req, res);
        // the page has not already been created, make one
        if (!page) {
          var isPass = false;
          if (req.body.password) isPass = true;
          var page = new Page({
            isPass: isPass,
            name: req.params.name,
            messages: []
          });
          logger.info('created page - ' + req.params.name);
          page.save(function(err, page) {
            if (err) return error_handler(err, req, res);
            // save the page and make a new password if their was one provided
            if (req.body.password) {
              var pass = null;
              pass = new Password({
                password: hashPass(req.body.password),
                _page: page._id
              });
            }
            if (pass) {
              pass.save();
            }
            if (!page.isPass) {
              io.sockets.in(public_page_room).emit('page', page);
              logger.info('emitted page to clients in ' + public_page_room);
            }
            res.json(page);
          });
        } else {
          return error_handler({message: 'The page has already been created', status: 403}, req, res);
        }
      });
  });

  // get all the messages for a specific page
  app.get('/api/page/:name/messages', function(req, res) {
    var limit = req.query.limit || null;
    var sort = req.query.sort || '-created';
    var skip = req.query.skip || null;

    var pass = req.body.password || req.headers.password;
    isAuth(req.params.name, pass, function(err, page) {
      if (err) return error_handler(err, req, res);

      Message
        .find({_owner: page._id})
        .sort(sort)
        .limit(limit)
        .skip(skip)
        .exec(function(err, messages) {
        if (err) handleError(err, req, res);

        logger.info('all messages returned for ' + req.params.name);

        // res.json(messages);
        res.json(messages);
      });
    });
  });

  // create a new message for the given page
  app.post('/api/page/:name/message', function(req, res) {
    if (!req.body.body || req.body.body == '') {
      logger.warn('you need to provide a message');
      res.send({status: 'failure', message: 'you need to provide a message body'});
      return;
    }
    var pass = req.body.password || req.headers.password;
    isAuth(req.params.name, pass, function(err, page) {
      if (err) return error_handler(err, req, res);

      Message.findOne({_owner: page._id}).limit(1).sort('-created').exec(function(err, item) {
        var mark = converter.makeHtml(req.body.body);

        if (item && item.body == mark) {
          logger.warn('the same message to same page was sent');
          res.send({stat: 'failure', message: 'please do not send a duplicate message'}, 403);
          return;
        }

        if (mark.length > settings.MAX_MESSAGE_LENGTH) {
          logger.warn('message is too long');
          res.send({stat: 'failure', message: 'please keep message under ' + settings.MAX_MESSAGE_LENGTH + ' characters'}, 403);
          return;
        }

        var msg = new Message({
          body: mark,
          _owner: page._id
        });

        // push the message onto the page
        page.messages.push(msg);

        msg.save(function(err) {
          if (err) return error_handler(err, req, res);

          io.sockets.in(req.params.name).emit('message ' + req.params.name, msg);
          logger.info('emited message to clients in room ' + req.params.name);

          io.sockets.in(req.params.name).emit('message', msg);
          logger.info('emited message to clients in room ' + req.params.name);

          // save the page
          page.save();

          // send back the new message
          res.json(msg);
        });
      });
    });
  });

  // send email
  app.post('/api/email', function(req, res) {
    var body = req.body.text;

    if (body) {
      email.sendMail(body);
      res.send({
        status: 'success',
        message: 'Email successfully send'
      })
    }else {
      return error_handler({message: 'You need to provide an email body', status: 403}, req, res);
    }
  });

  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res) {
    logger.info('request for html');
    res.sendfile('./public/index.html'); // load our public/index.html file
  });
};
