angular.module('pageService.services', [])
  .factory('pageService', function($http) {
    return {
      getPages: function() {
        return $http.get('/api/pages');
      },
    }
  });
