angular.module('pageController.controller', [])
  .controller('pageController', function($rootScope, $scope, $http, $location, $routeParams, pageService) {
    $scope.page = {};
    $scope.messages = [];
    $scope.isAuth = false;
    $scope.colour = "";

    var colours = {"#FF3300", "#66FF33", "#0066FF", "#FF0066", "#00FF99"};
    generateColour();



    $rootScope.header_title = "";
    $rootScope.header_subtitle = $routeParams.name;

    pageService.getPage($routeParams.name).success(function(page) {
      $scope.page = page;

      if (!page.isPass) {
        $scope.isAuth = true;
        pageService.getMessages($routeParams.name).success(function(messages) {
          $scope.messages = messages;
        });
      } else {
        $scope.isAuth = false;

      }
    }).error(function(err) {
      $location.path('/' + $routeParams.name + '/create');
    });

    $scope.authPage = function(password) {
      pageService.getMessages($routeParams.name, password).success(function(messages) {
        $scope.messages = messages;
        $scope.authPass = password;
        $scope.isAuth = true;
      }).error(function(err) {
        $scope.err = err.message;
        $scope.isAuth = false;
      });
    }

    $scope.createMessage = function(password, body) {
      if (body && body != "") {
        pageService.createMessage($routeParams.name, $scope.authPass, body).success(function(messages) {
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
  });
