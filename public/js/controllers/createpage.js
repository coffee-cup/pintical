angular.module('createPageController.controller', [])
  .controller('createPageController', function($rootScope, $scope, $http, $routeParams, $location, pageService) {
    $scope.message = "first";
    $scope.name = $routeParams.name;

    $rootScope.header_title = 'Chatter';
    $rootScope.header_subtitle = 'Anonymous Chat';

    pageService.getPage($routeParams.name).success(function() {
      $location.path('/' + $routeParams.name);
    });

    $scope.createPage = function(pass) {
      pageService.createPage($routeParams.name, pass).success(function(res) {
        $location.path('/' + $routeParams.name);
      });
    };
  });
