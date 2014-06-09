angular.module('pageController.controller', [])
  .controller('pageController', function($rootScope,
    $scope,
    $http,
    $location,
    $routeParams,
    pageService) {

    $rootScope.header_title = '';
    $rootScope.header_subtitle = '';

    var socket = io();

    $scope.page = null;
    $scope.name = $routeParams.name;
    $scope.password = "";
    $scope.messages = [];
    $scope.limit = 30;
    $scope.isAuth = false;
    $scope.isCreated = false;
    $scope.colour = "";

    // setup socket.io
    var socket = io();

    function joinRoom(pass) {
      if (!pass) {
        pass = '';
      }
      socket.emit('room', $routeParams.name + ':' + pass);

      // listen for a message from the server, then add it to the messages list
      socket.on('message', function(data) {
        if (data) {
          data.color = randomColor();
          $scope.messages.unshift(data);
          $scope.$apply();
        }
      });
    }

    function hideHeader() {
      $('.header_title').slideUp(300);
      $('.header_subtitle').show();
    }

    function showHeader() {
      $('.header_title').show();
      $('.header_subtitle').show();
    }

    function setHeader() {
      if ($scope.isCreated && $scope.isAuth) {
        $rootScope.header_subtitle = $routeParams.name;
        hideHeader();
      } else if ($scope.isCreated && !$scope.isAuth) {
        $rootScope.header_subtitle = $routeParams.name;
        $rootScope.header_title = 'Pintical';
        showHeader();
      }else {
        $rootScope.header_title = 'Pintical';
        $rootScope.header_subtitle = 'Anonymous Chat Board';
        showHeader();
      }
    }

    function randomColor() {
      return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    function loadMessages(callback) {
      if ($scope.isAuth && $scope.isCreated) {
        var skip = $scope.messages.length;

        pageService.getMessages($routeParams.name, $scope.password, $scope.limit, skip)
          .success(function(newmsgs) {

          for(var i=0;i<newmsgs.length;i++) {
            newmsgs[i].color = randomColor();
          }
          $scope.messages = $scope.messages.concat(newmsgs);

          if (!$scope.$$phase) {
            $scope.$apply();
          }

          if (callback) callback(null);
        }).error(function(err) {
          if (callback) callback(err);
        });
      }else {
        if (callback) callback(null);
      }
    }

    $scope.scrollLoadMessages = function(deferredObj) {
      loadMessages(function(err) {
        deferredObj.resolve();
      });
    }

    pageService.getPage($routeParams.name).success(function(page) {
      $scope.page = page;
      $scope.isCreated = true;
      if (!page.isPass) {
        $scope.isAuth = true;
        setHeader();

        loadMessages();

        joinRoom();
      }else {
        setHeader();
      }
    }).error(function(err) {
      if (err.message == 'The page does not exist') {
        $scope.page = null;
        $scope.isCreated = false;
        $scope.isAuth = false;
        setHeader();
      }
    });

    $scope.createPage = function() {
      pageService.createPage($routeParams.name, $scope.password).success(function(page) {
        if (page.status && page.status == 'failure') {
          $scope.error = page.message;
          return;
        }

        $scope.authPage();
        $scope.page = page;
        $scope.isCreated = true;
      });
    };

    $scope.authPage = function() {
      pageService.getMessages($routeParams.name, $scope.password).success(function(messages) {
        for(var i=0;i<messages.length;i++) {
          messages[i].color = randomColor();
        }
        $scope.messages = messages;
        $scope.isAuth = true;

        joinRoom($scope.password);
        setHeader();
      }).error(function(err) {
        $scope.err = err.message;
        $scope.isAuth = false;
      });
    }

    $scope.createMessage = function(body) {
      if (body && body != "") {
        pageService.createMessage($routeParams.name, $scope.password, body).success(function(msg) {
          $scope.message = "";
          $scope.err = "";
        }).error(function(err) {
          $scope.err = err.message;
        });
      }
    }

    $scope.isEnter = function(event) {
      if (event.keyCode == 13) {
        $scope.createMessage($scope.message);
        event.preventDefault();
      }
    }
  });
