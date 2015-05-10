var app = angular.module('FlexSite', ['ngResource'])
  .value('apiBase', 'http://<<env>>api.flexsites.io')
  .value('authHeader', 'authorization')
  .config(['$sceDelegateProvider', function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        'self',
        'http://*.flexhub.io/**',
        'https://*.flexhub.io/**',
        'http://*.flexsites.io/**',
        'https://*.flexsites.io/**',
        'http://*.youtube.com/**',
        'https://*.youtube.com/**'
    ]);
}]);
