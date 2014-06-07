angular.module('pageController.controller', [])
  .controller('pageController', function($rootScope,
    $scope,
    $http,
    $location,
    $routeParams,
    pageService) {

    var socket = io();
    socket.emit('chat message', 'hello, world!');

    $scope.page = null;
    $scope.name = $routeParams.name;
    $scope.messages = [];
    $scope.isAuth = false;
    $scope.isCreated = false;
    $scope.colour = "";

    var colours = ["#FF3300", "#66FF33", "#0066FF", "#FF0066", "#00FF99"];
    // generateColour();

    // setup socket.io
    var socket = io();

    function joinRoom(pass) {
      if (!pass) {
        pass = '';
      }
      socket.emit('room', $routeParams.name + ':' + pass);

      // listen for a message from the server, then add it to the messages list
      socket.on('message', function(data) {
        console.log('got message ' + data.body);
        if (data) {
          $scope.messages.unshift(data);
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

    // TODO set header depending on what state of the app we are in
    // and set the header back to the original when we leave or on create
    // of new page
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
        $rootScope.header_subtitle = 'Anonymous Chat';
        showHeader();
      }
    }

    pageService.getPage($routeParams.name).success(function(page) {
      $scope.page = page;
      $scope.isCreated = true;
      if (!page.isPass) {
        $scope.isAuth = true;
        setHeader();
        pageService.getMessages($routeParams.name).success(function(messages) {
          $scope.messages = messages;
        });

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

    $scope.createPage = function(pass) {
      pageService.createPage($routeParams.name, pass).success(function(page) {
        $scope.password = pass;
        $scope.authPage();
        $scope.page = page;
        $scope.isCreated = true;
      });
    };

    $scope.authPage = function() {
      pageService.getMessages($routeParams.name, $scope.password).success(function(messages) {
        $scope.messages = messages;
        $scope.isAuth = true;

        joinRoom($scope.password);
        setHeader();
      }).error(function(err) {
        $scope.err = err.message;
        $scope.isAuth = false;
      });
    }

    $scope.createMessage = function(password, body) {
      if (body && body != "") {
        pageService.createMessage($routeParams.name, $scope.password, body).success(function(msg) {
          $scope.message = "";
          // $scope.messages.unshift(msg);
          $scope.err = "";
          // generateColour();
        }).error(function(err) {
          $scope.err = err.message;
        });
      }
    }

    // // this hasn't been completed yet
    // function generateColour(){
    //   var x = Math.floor((Math.random() * 5) + 1);
    //   $('.content-quote').each(function(){
    //   $(this).css("border-color":colours[x]);
    // });
    // }

    $scope.isEnter = function(event) {
      if (event.keyCode == 13) {
        $scope.createMessage($scope.password, $scope.message);
        event.preventDefault();
      }
    }
  });
