  var pintical = angular.module('pintical',
            ['ngRoute',
            'pageService.service',
            'homeController.controller',
            'pageController.controller']);

  // configure our routes
  pintical.config(function($routeProvider) {
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
