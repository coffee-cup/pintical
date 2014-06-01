angular.module('homeController.controller', [])
  .controller('homeController', function($scope, $location) {
    $scope.header_title = 'Chatter';
    $scope.header_subtitle = 'Anonymous Chat';

    $scope.findPage = function(name) {
      $location.path('/' + name);
    }
  });
