angular.module('FlexSites')
  .factory('FlexVenue', ['FlexSiteResource', resource => resource('Venue')]);
