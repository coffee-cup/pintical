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

      getMessages : function(name) {
        return $http.get('/api/page/' + name + '/messages');
      },

      createMessage : function(name, pass, body) {
        return $http.post('/api/page/' + name + '/message', {password: pass, body: body})
      }
    }
  });
