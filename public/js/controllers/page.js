angular.module('pageController.controller', [])
  .controller('pageController', function($scope, $http, $location, $routeParams, pageService) {
    $scope.page = {};
    $scope.messages = [];
    $scope.isAuth = false;

    $scope.header_subtitle = $routeParams.name;

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
        }).error(function(err) {
          $scope.err = err.message;
        });
      }
    }

    $scope.isEnter = function(event) {
      if (event.keyCode == 13) {
        $scope.createMessage($scope.password, $scope.message);
        event.preventDefault();
      }
    }
  });
