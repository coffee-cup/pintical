angular.module('wikiMessage', [
    'pageController.controller',
    'pageService.services',
    'ngRoute'
  ]).
    config(['$routeProvider', function($routeProvider) {
      $routeProvider.
        when('/', {templateUrl : 'views/pages.html', controller : 'pageController'}).
        otherwise({redirectTo       : '/'});
}]);
