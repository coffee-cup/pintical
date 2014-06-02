angular.module('homeController.controller', [])
  .controller('homeController', function($rootScope, $scope, $location) {
    $rootScope.header_title = 'Chatter';
    $rootScope.header_subtitle = 'Anonymous Chat';

    $scope.findPage = function(name) {
      $location.path('/' + name);
    }
  });
