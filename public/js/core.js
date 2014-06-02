  var chatter = angular.module('chatter',
            ['ngRoute',
            'pageService.service',
            'homeController.controller',
            'pageController.controller']);

  // configure our routes
  chatter.config(function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'homeController'
      })

      .when('/:name', {
        templateUrl : 'views/page.html',
        controller  : 'pageController'
      });
  });
