angular.module('FlexSites')
  .factory('FlexSubscriber', ['FlexSiteResource', resource => resource('Subscriber')]);
