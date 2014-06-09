angular.module('pageService.service', [])
  .factory('pageService', function($http) {
    return {
      allPages : function() {
        return $http.get('/api/pages');
      },

      getPage : function(name) {
        return $http.get('/api/page/' + name);
      },

      createPage : function(name, pass) {
        return $http.post('/api/page/' + name, {password: pass});
      },

      getMessages : function(name, password, limit, skip) {
        var query = '?';
        if (limit) query += 'limit=' + limit + '&';
        if (skip) query += 'skip=' + skip + '&';

        return $http.get('/api/page/' + name + '/messages' + query, {headers: {'password': password}});
      },

      createMessage : function(name, pass, body) {
        return $http.post('/api/page/' + name + '/message', {password: pass, body: body})
      },

      sendEmail: function(text) {
        return $http.post('/api/email', {text: text});
      }
    }
  });
