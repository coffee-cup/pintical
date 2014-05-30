angular.module('pageService.service', [])
  .factory('pageService', function($http) {
    return {
      allPages : function() {
        return $http.get('/api/pages');
      },

      getPage : function(name) {
        return $http.get('/api/page/' + name);
      },

      createPage : function(name) {
        return $http.post('/api/page/' + name);
      },

      getMessages : function(name) {
        return $http.get('/api/page/' + name + '/messages');
      }
    }
  });
