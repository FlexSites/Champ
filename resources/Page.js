angular.module('FlexSite')
  .factory('Page', ['FlexSiteResource', function(resource) {
    return resource('Page');
  }]);