angular.module('FlexSite')
  .provider('FlexSiteResource', function FlexSiteResourceProvider() {
    this.$get = ['$resource', 'apiBase', function($resource, apiBase) {
      return function(name, actions) {
        var url = '/'+camelToSnake(pluralize(name))
          , urlBase = apiBase + url
          , params = {id: '@id'};

        actions = angular.extend({}, {
          create: {method: 'POST'},
          upsert: {url: '/:id', method: 'PUT'},
          exists: {url: '/:id/exists', method: 'GET'},
          findById: {url: '/:id', method: 'GET'},
          find: {isArray: true, method: 'GET'},
          findOne: {url: '/findOne', method: 'GET'},
          updateAll: {url: '/update', method: 'POST'},
          deleteById: {url: '/:id', method: 'DELETE'},
          count: {url: '/count', method: 'GET'},
          prototype$updateAttributes: {url: '/:id', method: 'PUT'}
        }, actions);
        angular.forEach(actions, function(action){
          action.url = action.url ? urlBase + action.url : urlBase;
          action.withCredentials = true;
        });

        var resource = $resource(urlBase + '/:id', params, actions);

        // Method aliases
        resource.updateOrCreate = resource.upsert;
        resource.update = resource.updateAll;
        resource.destroyById = resource.deleteById;
        resource.removeById = resource.deleteById;
        resource.modelName = name;
        resource.prototype.modelName = name;

        // Override prototype.$save
        resource.prototype.$save = function(success, error) {
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });

function pluralize(str) {
  if (str.slice(-3) === 'ium') {
    str = str.substr(0, str.length - 3) + 'ia';
  } else {
    str += 's';
  }
  return str;
}

function camelToSnake(str) {
  return str.replace(/([A-Z])/g, function($1){
    return '-' + $1.toLowerCase();
  }).substr(1);
}
