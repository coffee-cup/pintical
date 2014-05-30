  var wikiMessage = angular.module('wikiMessage',
            ['ngRoute',
            'pageService.service',
            'allPagesController.controller',
            'pageController.controller',
            'createPageController.controller']);

  // configure our routes
  wikiMessage.config(function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl : 'views/allpages.html',
        controller  : 'allPagesController'
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
