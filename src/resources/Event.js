angular.module('FlexSites')
  .factory('FlexEvent', ['FlexSiteResource', resource => resource('Event')]);
