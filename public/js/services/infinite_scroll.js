angular.module('infiniteScroll', []).directive('infiniteScroll', function($window, $q) {
  return {
    link: function(scope, element, attrs) {
      var offset, scrolling;
      offset = parseInt(attrs.offset, 10) || 10;
      scrolling = false;
      return angular.element($window).bind('scroll', function() {
        var deferred, _ref;
        var threshold = 80;
        if (!scrolling && (($(document).height() - $(window).height()) - $(window).scrollTop() <= threshold)) {
          scrolling = true;
          deferred = $q.defer();
          scope[attrs.infiniteScroll](deferred);
          return deferred.promise.then(function() {
            return scrolling = false;
          });
        }
      });
    }
  };
});
