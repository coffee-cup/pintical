angular.module('pageController.controller', [])
  .controller('pageController', function($rootScope, $scope, $http, $location, $routeParams, pageService) {
    $scope.page = null;
    $scope.name = $routeParams.name;
    $scope.messages = [];
    $scope.isAuth = false;
    $scope.isCreated = false;
    $scope.colour = "";

    var colours = {"#FF3300", "#66FF33", "#0066FF", "#FF0066", "#00FF99"};
    generateColour();

    applyHeaders();

    pageService.getPage($routeParams.name).success(function(page) {
      $scope.page = page;
      $scope.isCreated = true;
      if (!page.isPass) {
        $scope.isAuth = true;
        pageService.getMessages($routeParams.name).success(function(messages) {
          $scope.messages = messages;
        });
      } else {
      }
    }).error(function(err) {
      if (err.message == 'The page does not exist') {
        $scope.page = null;
        $scope.isCreated = false;
        $scope.isAuth = false;
      }
    });

    $scope.createPage = function(pass) {
      pageService.createPage($routeParams.name, pass).success(function(page) {
        $scope.password = pass;
        $scope.authPage();
        $scope.page = page;
        $scope.isCreated = true;
        applyHeaders();
      });
    };

    $scope.authPage = function() {
      pageService.getMessages($routeParams.name, $scope.password).success(function(messages) {
        $scope.messages = messages;
        $scope.isAuth = true;
      }).error(function(err) {
        $scope.err = err.message;
        $scope.isAuth = false;
      });
    }

    $scope.createMessage = function(password, body) {
      if (body && body != "") {
        pageService.createMessage($routeParams.name, $scope.password, body).success(function(messages) {
          $scope.message = "";
          $scope.messages = messages;
          $scope.err = "";
          generateColour();
        }).error(function(err) {
          $scope.err = err.message;
        });
      }
    }
    // this hasn't been completed yet
    function generateColour(){
      var x = Math.floor((Math.random() * 5) + 1);
      $('.content-quote').each(function(){
      $(this).css("border-color":colours[x]);
    });
    }

    $scope.isEnter = function(event) {
      if (event.keyCode == 13) {
        $scope.createMessage($scope.password, $scope.message);
        event.preventDefault();
      }
    }

    function applyHeaders() {
      if ($scope.isAuth) {
        $rootScope.header_title = "";
        $rootScope.header_subtitle = $routeParams.name;
      } else {
        $rootScope.header_title = 'Chatter';
        $rootScope.header_subtitle = 'Anonymous Chat';
      }
    }
  });
