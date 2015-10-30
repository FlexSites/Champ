angular.module('FlexSites')
  .factory('FlexProduct', ['FlexSiteResource', resource => resource('Product')]);
