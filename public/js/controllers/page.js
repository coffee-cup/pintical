angular.module('pageController.controller', [])
  .controller('pageController', function($scope, $http, $location,$routeParams,pageService) {
    $scope.page = {};
    $scope.messages = [];

    pageService.getPage($routeParams.name).success(function(page) {
      $scope.page = page;
      pageService.getMessages($routeParams.name).success(function(messages) {
        $scope.messages = messages;
      });
    }).error(function(err) {
      $location.path('/' + $routeParams.name + '/create/');
    });
  });
