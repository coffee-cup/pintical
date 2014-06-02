var Page = require('./models/page.js'),
  Message = require('./models/message.js'),
  Password = require('./models/password.js'),
  logger = require('./logger');

module.exports = function(app) {

  // helper functions =============
  function handleError(err, res) {
    logger.warn(err);
    res.send(403, err);
  }

  function isAuth(req, res, callback) {
    Page.findOne({
      name: req.params.name
    }, function(err, page) {
      if (err) handleError(err, res)

      password = req.body.password || req.headers.password;

      // if the page does not exist
      if (!page) {
        callback({
          status: "failure",
          message: "The page does not exist"
        });
        return;
      }

      // no password was provided and the page needs one
      if (page.isPass && !password) {
        callback({
          status: "failure",
          message: "A password is required"
        });
        return;
      } else {
        Password.findOne({
          _page: page._id
        }, function(err, pass) {
          // the password does not match the one in the db
          if (!pass && page.isPass) {
            callback({
              status: "failure",
              message: "Could not find password in the db"
            });
            return;
          } else if (page.isPass && pass.password != password) {
            callback({
              status: "failure",
              message: "The password is incorrect"
            });
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
    Page.find({
      isPass: false
    })
      .sort('-created')
      .exec(function(err, pages) {
        if (err) handleError(err, res);

        logger.info('all public pages returned');
        res.json(pages); // return all the pages in json
      });
  });

  // get a specific page
  app.get('/api/page/:name', function(req, res) {
    Page.findOne({
      name: req.params.name
    }, function(err, doc) {
      if (err) handleError(err, res);
      if (doc) {
        res.json(doc);
      } else {
        logger.warn('attempt to get a page that does not exist');
        res.json(404, {
          'error': 'failure',
          'message' : 'The page does not exist'
        });
      }
    });
  });

  // create a specific page
  app.post('/api/page/:name', function(req, res) {
    Page
      .findOne({
        name: req.params.name
      }, function(err, page) {
        if (err) handleError(err, res);

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
            if (err) handleError(err, res);

            // save the page and make a new password if their was one provided
            if (req.body.password) {
              var pass = null;
              pass = new Password({
                password: req.body.password,
                _page: page._id
              });
            }

            if (pass) {
              pass.save();
            }
            res.json(page);
          });
        } else {
          handleError({
            status: "failure",
            message: 'The page has already been created'
          }, res);
        }
      });
  });

  // get all the messages for a specific page
  app.get('/api/page/:name/messages', function(req, res) {
    isAuth(req, res, function(err, page) {
      if (err) {
        handleError(err, res);
        return;
      }

      Message.find({
        _owner: page._id
      }).sort('-created').exec(function(err, messages) {
        if (err) handleError(err, res);

        logger.info('all messages returned for ' + req.params.name);

        res.json(messages);
      });
    });
  });

  // create a new message for the given page
  app.post('/api/page/:name/message', function(req, res) {
    isAuth(req, res, function(err, page) {
      if (err) {
        handleError(err, res);
        return;
      }

      var msg = new Message({
        body: req.body.body,
        _owner: page._id
      });

      // push the message onto the page
      page.messages.push(msg);

      msg.save(function(err, msg) {
        if (err) handleError(err, res);

        logger.info('new message created for ' + req.params.name);

        // save the page
        page.save();

        // send back the pages messages
        Message.find({
          _owner: page._id
        }).sort('-created').exec(function(err, messages) {
          if (err) handleError(err, res);

          res.json(messages);
        });
      });
    });
  });

  // FOR TESTING ONLY

  // delete a specific page
  app.post('/api/page/delete/:name', function(req, res) {
    Page.findOne({
      name: req.params.name
    }, function(err, page) {
      if (err) handleError(err, res);
      if (page) {
        page.remove();
        Message.remove({
          _owner: page._id
        });

        logger.warn('page ' + req.params.name + ' and its messages were removed');

        res.send({
          status: 'success',
          message: 'The page ' + req.params.name + ' was removed'
        });
      } else {
        res.send(403, {
          message: 'The page does not exist'
        });
      }
    });
  });


  // get all the passwords in plain text (very bad thing to do)
  app.post('/api/passwords', function(req, res) {
    Password.find(function(err, passwords) {
      if (err) handleError(err, res);

      logger.warn('all passwords returned');
      res.json(passwords);
    })
  });

  //delete all passwords
  app.post('/api/passwords/delete', function(req, res) {
    Password.remove(function(err) {
      if (err) handleError(err, res);

      logger.warn('all passwords removed');
      res.send({
        status: 'success',
        message: 'All passwords were removed'
      });
    })
  });

  // delete all messages
  app.post('/api/messages/delete', function(req, res) {
    Message.remove(function(err) {
      if (err) handleError(err, res);

      logger.warn('all messages were removed');
      res.send({
        status: 'success',
        message: 'All messages were removed'
      });
    });
  });

  // delete all pages
  app.post('/api/pages/delete', function(req, res) {
    Page.remove(function(err) {
      if (err) handleError(err, res);

      logger.warn('all pages removed');
      res.send({
        status: 'success',
        message: 'All pages were removed'
      });
    })
  });


  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res) {
    logger.info('request for html');
    res.sendfile('./public/index.html'); // load our public/index.html file
  });
};
