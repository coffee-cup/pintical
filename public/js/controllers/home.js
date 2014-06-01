angular.module('homeController.controller', [])
  .controller('homeController', function($scope, $location) {
    $scope.findPage = function(name) {
      $location.path('/' + name);
    }
  });
