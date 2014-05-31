var Page = require('./models/page.js'),
  Message = require('./models/message.js');
Password = require('./models/password.js')

module.exports = function(app) {

  // helper functions =============
  function handleError(err, res) {
    console.log(err);
    res.send(500, {
      error: err.message
    });
  }

  // server routes ==============

  // get all the pages
  app.get('/api/pages', function(req, res) {
    Page.find({})
      .sort('-created')
      .exec(function(err, pages) {
        if (err) handleError(err, res);
        res.json(pages); // return all the pages in json
      });
  });

  // get all the messages for each page
  app.get('/api/messages', function(req, res) {
    Message.find({})
      .sort('-created')
      .exec(function(err, messages) {
        if (err) handleError(err, res);
        res.json(messages);
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
        res.json(404, {
          'error': 'The page does not exists'
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
          res.json(403, {
            error: 'The page has already been created'
          });
        }
      });
  });

  // get all the messages for a specific page
  app.get('/api/page/:name/messages', function(req, res) {
    Page.findOne({
      name: req.params.name
    })
      .sort('-created')
      .exec(function(err, page) {
        if (err) handleError(err, res);

        Message.find({
          _owner: page._id
        }, function(err, messages) {
          res.json(messages);
        });
      });
  });

  // create a new message for the given page
  app.post('/api/page/:name/message', function(req, res) {
    Page.findOne({
      name: req.params.name
    }, function(err, page) {
      if (err) handleError(err, res);
      if (page) {

        // if the current page has a password
        if (page.isPass) {
          // password is required but none was provided
          if (!req.body.password) {
            res.send(403, {
              status: "failure",
              message: "A password is required"
            });
            return;
          }
          // look for a password that belongs to the page
          Password.findOne({
            _page: page._id
          }, function(err, pass) {
            if (pass) {
              if (err) handleError(err, res);
              if (pass.password != req.body.password) {
                res.send(403, {
                  status: "failure",
                  message: "The password is incorrect"
                });
                console.log('the password is incorrect');
                return;
              } else {
                console.log('creating new message');

                // create a new message
                var msg = new Message({
                  body: req.body.body,
                  _owner: page._id,
                });

                // push the message onto the page
                page.messages.push(msg);
                msg.save(function(err, msg) {
                  if (err) handleError(err, res);
                  page.save();

                  // send back the messages
                  Message
                    .find({
                      _owner: page._id
                    })
                    .sort('-created')
                    .exec(function(err, messages) {
                      if (err) handleError(err, res);
                      res.json(messages);
                    });
                });
              }
            } else {
              res.send(500, {
                status: "failure",
                message: "Cannot find password for the page"
              });
              return;
            }
          });
        }
      } else {
        res.send(403, {
          status: "failure",
          message: "The page has not been created"
        });
      }
    });
  });

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

  // FOR TESTING ONLY

  // get all the passwords in plain text (very bad thing to do)
  app.post('/api/passwords', function(req, res) {
    Password.find(function(err, passwords) {
      if (err) handleError(err, res);

      res.json(passwords);
    })
  });

  //delete all passwords
  app.post('/api/passwords/delete', function(req, res) {
    Password.remove(function(err) {
      if (err) handleError(err, res);

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

      res.send({
        status: 'success',
        message: 'All pages were removed'
      });
    })
  });


  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
  });
};
