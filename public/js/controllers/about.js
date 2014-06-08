angular.module('aboutController.controller', [])
  .controller('aboutController', function($rootScope, $scope, $location, pageService) {
    $rootScope.header_title = 'Pintical';
    $rootScope.header_subtitle = 'Anonymous Chat Board';
    $('.header_title').show();
    $('.header_subtitle').show();
  });
