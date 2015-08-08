var app = angular.module('FlexSite');

<<&resources>>.forEach(function(resource) {
  var capital = camelFromDash(resource);
  console.log('resource', capital);
  app.factory(capital, ['FlexSiteResource', function(resource) {
      return resource(capital);
    }]);
});

function capitalize(str) {
  if (typeof str !== 'string') str = '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function camelFromDash(str) {
  return str.split('-')
    .map(capitalize)
    .join('');
}

