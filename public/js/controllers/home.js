angular.module('homeController.controller', [])
  .controller('homeController', function($scope, $location) {
    $scope.header_title = 'Chatter';
    $scope.header_subtitle = 'Anonymous Chat';

    $scope.findPage = function(name) {
      $location.path('/' + name);
    }

    $scope.allPages = function(){
        pageService.allPages().success(function(pages) {
        $scope.pages = pages;
      }).error(function(err) {
        $scope.err = err.message;
      });
    }
  });
