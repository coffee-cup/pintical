angular.module('aboutController.controller', [])
  .controller('aboutController', function($rootScope, $scope, pageService) {
    $rootScope.header_title = 'Pintical';
    $rootScope.header_subtitle = 'About';
    $('.header_title').show();
    $('.header_subtitle').show();

    $scope.sendEmail = function(message) {
      pageService.sendEmail(message).success(function() {
        $scope.success = 'message sent!';
        $scope.error = '';
        $scope.message = '';
      }).error(function() {
        $scope.error = 'messages failed to send, please try again later';
        $scope.success = '';
      });
    }
  });
