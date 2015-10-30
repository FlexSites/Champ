angular.module('FlexSites')
  .factory('FlexCustomerProduct', ['FlexSiteResource', (resource) => resource('CustomerProduct')]);
