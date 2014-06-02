angular.module('homeController.controller', [])
  .controller('homeController', function($rootScope, $scope, $location, pageService) {
    $rootScope.header_title = 'Chatter';
    $rootScope.header_subtitle = 'Anonymous Chat';

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
