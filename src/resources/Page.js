angular.module('FlexSites')
  .factory('FlexPage', ['FlexSiteResource', resource => resource('Page')]);
