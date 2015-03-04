
angular.module('FlexSite')
  .factory('FlexSiteAuthRequestInterceptor', ['$q', 'FlexSiteAuth', 'apiBase', function($q, FlexSiteAuth, apiBase) {
    return {
      'request': function(config) {
        if (config.url.substr(0, apiBase.length) !== apiBase) return config;
        if (FlexSiteAuth.accessTokenId) config.headers[authHeader] =
          FlexSiteAuth.accessTokenId;
        else if (config.__isGetCurrentUser__) {
          var res = {
            body: {
              error: {
                status: 401
              }
            },
            status: 401,
            config: config,
            headers: function() {
              return undefined;
            }
          };
          return $q.reject(res);
        }
        return config || $q.when(config);
      }
    };
  }])