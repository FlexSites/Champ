angular.module('FlexSites')
  .factory('Order', ['FlexSiteResource', resource => {
    var R = resource('Order', {
      token: { url: '/token', method: 'GET' },
    });
    R.modelName = 'Order';
    return R;
  }]);
