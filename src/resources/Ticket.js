angular.module('FlexSites')
  .factory('FlexTicket', ['FlexSiteResource', resource => resource('Ticket')]);
