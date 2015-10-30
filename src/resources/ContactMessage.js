angular.module('FlexSites')
  .factory('FlexContactMessage', ['FlexSiteResource', (resource) => resource('ContactMessage')]);
