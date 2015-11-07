if (typeof module !== 'undefined' && typeof exports !== 'undefined' && module.exports === exports){
  module.exports = 'FlexSites';
}

angular.module('FlexSites', ['ngResource'])
  .value('apiBase', 'https://api.flexsites.io/api/v1')
  .value('authHeader', 'authorization')
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.flexhub.io/**',
      'https://*.flexhub.io/**',
      'http://*.flexsites.io/**',
      'https://*.flexsites.io/**',
      'http://*.youtube.com/**',
      'https://*.youtube.com/**',
    ]);
  }]);
