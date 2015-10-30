angular.module('FlexSites')
  .factory('FlexSection', ['FlexSiteResource', resource => resource('Section')]);
