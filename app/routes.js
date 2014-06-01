var Page = require('./models/page.js'),
  Message = require('./models/message.js');
Password = require('./models/password.js')

module.exports = function(app) {

  // helper functions =============
  function handleError(err, res) {
    console.log(err);
    res.send(403, err);
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
          console.log('created page - ' + req.params.name);
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

      console.log(password);
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

          console.log(page);
          callback(null, page)
        });
      }
    });
  }

  // get all the messages for a specific page
  app.get('/api/page/:name/messages', function(req, res) {
    isAuth(req, res, function(err, page) {
      if (err) {
        handleError(err, res);
        return;
      }

      console.log('isAuth passed');

      Message.find({
        _owner: page._id
      }, function(err, messages) {
        if (err) handleError(err, res);

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

      console.log('isAuth passed');

      var msg = new Message({
        body: req.body.body,
        _owner: page._id
      });

      // push the message onto the page
      page.messages.push(msg);

      msg.save(function(err, msg) {
        if (err) handleError(err, res);

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
