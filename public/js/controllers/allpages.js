angular.module('allPagesController.controller', [])
  .controller('allPagesController', function($scope, $http, pageService) {
    $scope.pageList = [];

    pageService.allPages().success(function(res) {
      $scope.pageList = res;
    });
  });
