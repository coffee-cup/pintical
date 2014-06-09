angular.module('homeController.controller', [])
  .controller('homeController', function($rootScope, $scope, $location, pageService) {
    $rootScope.header_title = 'Pintical';
    $rootScope.header_subtitle = 'Anonymous Chat Board';
    $('.header_title').show();
    $('.header_subtitle').show();

    var limit = 10;
    var PAGE_LENGTH = 100;

    $(document).prop('title', 'Pintical');

    $scope.findPage = function(name) {
      if (name.length && name.length > PAGE_LENGTH) {
        $scope.error = 'Page name must be less than ' + PAGE_LENGTH + ' characters';
      }else {
        $location.path('/' + name);
      }
    }

    function randomColor() {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    $scope.allPages = function() {
        pageService.allPages(limit, null).success(function(pages) {

        for (var i=0;i<pages.length;i++) {
          pages[i].color = randomColor();
        }
        $scope.pages = pages;
      }).error(function(err) {
        $scope.err = err.message;
      });
    }

    $scope.allPages();
  });
