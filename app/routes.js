var Page = require('./models/page.js'),
    Message = require('./models/message.js');

module.exports = function(app) {

  // help functions =============
  function handleError(err, res) {
    console.log(err);
    res.send(500, {
      error: err.message
    });
  }

  // server routes ==============
  app.get('/api/pages', function(req, res) {
    Page.find(function(err, pages) {
      if (err) handleError(err, res);
      res.json(pages); // return all the pages in json
    });
  });

  app.get('/api/messages', function(req, res) {
    Message.find(function(err, messages) {
      if (err) handleError(err, res);
      res.json(messages);
    });
  });

  app.get('/api/page/:name', function(req, res) {
    Page.findOne({name: req.params.name}, function(err, doc) {
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

  app.post('/api/page/:name', function(req, res) {
    Page.findOne({name: req.params.name}, function(err, page) {
      if (err) handleError(err, res);
      if (!page) {
        page = new Page({
          name: req.params.name,
          password: req.body.password || "",
          messages: []
        });
        page.save();
        res.json(page);
      } else {
        res.json(403, {
          error: 'The page has already been created'
        });
      }
    });
  });

  app.get('/api/page/:name/messages', function(req, res) {
    Page.findOne({name: req.params.name}, function(err, page) {
      if (err) handleError(err, res);

      Message.find({_owner: page._id}, function(err, messages) {
        res.json(messages);
      });
    });
  });

  app.post('/api/page/:name/message', function(req, res) {
    Page.findOne({name: req.params.name},
      function(err, page) {
      if (err) handleError(err, res);
      if (page) {
        var msg = new Message({
          name: req.body.name,
          body: req.body.body,
          _owner: page._id,
        });
        page.messages.push(msg);
        msg.save(function(err, msg) {
          if (err) handleError(err, res);
          page.save();
          Message
          .find({_owner: page._id})
          .sort('-created')
          .exec(function(err, messages) {
            if (err) handleError(err, res);
            res.json(messages);
          });
        });
      } else {
        res.send(403, {
          status: "failure",
          message: "The page has not been created"
        });
      }
    });
  });

  app.post('/api/page/delete/:name', function(req, res) {
    Page.findOne({name: req.params.name}, function(err, page) {
      if (err) handleError(err, res);
      if (page) {
        page.remove();
        Message.remove({_owner: page._id});

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
  app.post('/api/messages/delete', function(req, res) {
    Message.remove(function(err) {
      if (err) handleError(err, res);

      res.send({status: 'success', message: 'All messages were removed'});
    });
  });

  app.post('/api/pages/delete', function(req, res) {
    Page.remove(function(err) {
      if (err) handleError(err, res);

      res.send({status: 'success', message: 'All pages were removed'});
    })
  });


  // frontend routes
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
  });
};
