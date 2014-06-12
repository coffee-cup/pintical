angular.module('homeController.controller', [])
  .controller('homeController', function($rootScope, $scope, $location, pageService) {
    $rootScope.header_subtitle = 'Anonymous Chat Board';
    $('.header_subtitle').show();
    $('.header_title').show();

    var limit = 20;
    var PAGE_LENGTH = 100;
    var letter_change = 8000;

    $(document).prop('title', 'Pintical');

    // setup socket.io
    var socket = io();

    socket.emit('public:::pages', 'random data');

    socket.on('page', function(data) {
      console.log('test');
    });

    socket.on('message', function(data) {
      console.log('test');
    });

    $scope.findPage = function(name) {
      if (!name) {
        $location.path('/about');
        return;
      }
      if (!isAlpha(name)) {
        $scope.error = 'Alpha characters only please';
      }else if (name.length && name.length > PAGE_LENGTH) {
        $scope.error = 'Page name must be less than ' + PAGE_LENGTH + ' characters';
      }else {
        $location.path('/' + name);
      }
    }

    function isAlpha(s) {
      var re = new RegExp("^[a-zA-Z0-9]+$");
      return re.test(s);
    }

    function randomColor() {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    setInterval(function() {
      $('.header_letter').css('background-color', randomColor());
    }, letter_change);

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
