angular.module('FlexSite')
  .factory('Order', ['FlexSiteResource', 'FlexSiteAuth', 'apiBase', function(Resource, FlexSiteAuth, apiBase) {
    var R = Resource('Order', {
      'token': {url: '/token', method: 'GET'}
    });
    R.modelName = 'Order';
    return R;
  }]);
