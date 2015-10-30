angular.module('FlexSites')
  .factory('FlexPost', ['FlexSiteResource', resource => resource('Post')]);
