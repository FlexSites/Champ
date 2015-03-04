
app.provider('FlexSiteResource', function FlexSiteResourceProvider() {
    this.$get = ['$resource', 'apiBase', function($resource, apiBase) {
      return function(name, actions) {
        var url = '/'+name.toLowerCase() + 's'
          , urlBase = apiBase + url
          , params = {id: '@id'};

        actions = angular.extend({}, {
          create: {method: 'POST'},
          upsert: {method: 'PUT'},
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
            action.url = action.url?urlBase + action.url:urlBase;
        });
        console.log('Actions!', actions);
        var resource = $resource(urlBase + '/:id', params, actions);

        // Method aliases
        resource['updateOrCreate'] = resource['upsert'];
        resource['update'] = resource['updateAll'];
        resource['destroyById'] = resource['deleteById'];
        resource['removeById'] = resource['deleteById'];
        resource.modelName = 'Page';

        // Override prototype.$save
        resource.prototype.$save = function(success, error) {
          var result = resource.upsert.call(this, {}, this, success, error);
          return result.$promise || result;
        };
        return resource;
      };
    }];
  });