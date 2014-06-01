angular.module('homeController.controller', [])
  .controller('homeController', function($scope, $location) {
    $scope.findPage(name) {
      $location.path.('/' + name);
    }
  });
