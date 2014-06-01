  var wikiMessage = angular.module('wikiMessage',
            ['ngRoute',
            'pageService.service',
            'homeController.controller',
            'pageController.controller',
            'createPageController.controller']);

  // configure our routes
  wikiMessage.config(function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl : 'views/home.html',
        controller  : 'homeController'
      })

      .when('/:name', {
        templateUrl : 'views/page.html',
        controller  : 'pageController'
      })

      .when('/:name/create', {
        templateUrl : 'views/createpage.html',
        controller  : 'createPageController'
      });
  });
