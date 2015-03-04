var app = angular.module('FlexSite');

<<&resources>>.forEach(function(resource) {
  var capital = resource.charAt(0).toUpperCase() + resource.slice(1);
  app.factory(capital, ['FlexSiteResource', function(resource) {
      return resource(capital); 
    }]);
});