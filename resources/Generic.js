<<&resources>>.forEach(function(resource) {
  var plural = pluralize(resource);
  angular.module('FlexSite')
    .factory(capitalize(resource), ['$resource', function($resource) {
      var path = '/' + plural.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase() + '/:id'
        , params = {id: '@id'};
      if (resource !== 'site' && resource !== 'entertainer' && resource !== 'user') {
        path = '/sites/:site' + path;
        params.site = '@site';
      }
      return $resource('http://<<env>>api.flexhub.io' + path, params);
    }]);
});

function pluralize(str) {
  if (str.slice(-3) == "ium") {
    str = str.substr(0, str.length - 3) + "ia";
  } else {
    str += "s";
  }
  return str;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


angular.module('FlexSite')
  .factory("FlexSiteAuthRequestInterceptor", ["$q", "FlexSiteAuth", function($q, FlexSiteAuth) {
    return {
      "request": function(config) {
        if (config.url.substr(0, urlBase.length) !== urlBase)return config;
        if (FlexSiteAuth.accessTokenId)config.headers[authHeader] =
          FlexSiteAuth.accessTokenId; else if (config.__isGetCurrentUser__) {
          var res = {
            body: {error: {status: 401}}, status: 401, config: config, headers: function() {
              return undefined
            }
          };
          return $q.reject(res)
        }
        return config || $q.when(config)
      }
    }
  }]).provider("FlexSiteResource", function FlexSiteResourceProvider() {
    this.setAuthHeader = function(header) {
      authHeader = header
    };
    this.setUrlBase = function(url) {
      urlBase = url
    };
    this.$get = ["$resource", function($resource) {
      return function(url, params, actions) {
        var resource = $resource(url, params, actions);
        resource.prototype.$save = function(success, error) {
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result
        };
        return resource
      }
    }]
  })