angular.module('FlexSites')
  .factory('SiteTokenInterceptor', ['siteToken', 'apiBase', function(siteToken, apiBase) {
    var len = apiBase.length;
    return {
      request: function(config) {
        if (config.url.substr(0, len) !== apiBase) return config;
        config.headers['X-FlexSite'] = siteToken;
        return config;
      },
    }
  }]);
