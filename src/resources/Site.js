angular.module('FlexSites')
  .factory('FlexSite', ['FlexSiteResource', resource => resource('Site')]);
