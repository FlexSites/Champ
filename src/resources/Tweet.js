angular.module('FlexSites')
  .factory('FlexTweet', ['FlexSiteResource', resource => resource('Tweet')]);
