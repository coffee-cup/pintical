angular.module('createPageController.controller', [])
  .controller('createPageController', function($scope, $http, $routeParams, $location,pageService) {
    $scope.message = "first";
    $scope.name = $routeParams.name;

    $scope.create = function(pass) {
      pageService.createPage($routeParams.name).success(function(res) {
        $location.path('/' + $routeParams.name);
      });
    };
  });
