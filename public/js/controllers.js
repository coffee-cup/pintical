angular.module('pageController.controller', [])
  .controller('pageController', function($scope, pageService) {
    $scope.pageList = [];

    pageService.getPages().success(function(res) {
      $scope.pageList = res;
    });
  });
