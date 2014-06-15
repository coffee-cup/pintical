  var pintical = angular.module('pintical',
            ['ngRoute',
            'pageService.service',
            'infiniteScroll',
            'aboutController.controller',
            'homeController.controller',
            'pageController.controller']);

  // configure our routes
  pintical.config(function($routeProvider, $locationProvider) {
    $routeProvider

      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'homeController'
      })

      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'aboutController'
      })

      .when('/:name', {
        templateUrl : 'views/page.html',
        controller  : 'pageController'
      })
      .otherwise({
        redirectTo: '/'
      });

      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
  });
