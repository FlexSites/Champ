angular.module('app', ['ngResource', 'ngRoute'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            angular.forEach(<<&routes>>, function(route) {
                var url = route.url;
                if (route.controller === 'ListController') {
                    delete route.controller;
                }
                delete route.url;

                $routeProvider.when(url, route);
            });
            $routeProvider.otherwise({
                "templateUrl": "/html/error.html"
            })
            $locationProvider.html5Mode(true);
        }
    ])
    // Whitelist resource sharing
    .config(['$sceDelegateProvider', function($sceDelegateProvider) {
        $sceDelegateProvider.resourceUrlWhitelist([
            'self',
            'http://*.flexhub.io/**',
            'https://*.flexhub.io/**',
            'http://*.flexsites.io/**',
            'https://*.flexsites.io/**',
            'http://*.youtube.com/**',
            'https://*.youtube.com/**'
        ]);
    }])
    .run(['$location', '$rootScope', '$http', '$window',
        function($location, $rootScope, $http, $window) {
            // $rootScope.bgClass = 'bg-home';
            $rootScope.$on('$routeChangeSuccess', function(event, current, previous) {
                if (current && current.$$route) {
                    document.title = current.$$route.title;
                    $rootScope.url = $location.$$absUrl;
                    $window.ga('send', 'pageview', { page: $location.path() });
                }
            });
        }
    ])
    .factory('GenericDirective', ['$window', '$routeParams', '$location', '$injector', 'Helper', function($window, $routeParams, $location, $injector, Helper){
        return {
            create: function(singular, scope, attrs, parseFn, formatFn){

                scope.add = function(){
                    var obj = {site: $window.localStorage.currentSite};
                    if(singular === 'section'){
                        obj.venue = $window.localStorage.currentVenue;
                    }
                    return new Resource(obj);
                }


                var plural = Helper.pluralize(singular);
                var Resource = $injector.get(Helper.capitalize(singular));
                var val = scope.$eval(attrs[plural]) || $routeParams[singular] || ($location.path().substr(1) === singular?'new':{});
                scope[singular] = {};
                scope[plural] = [];

                if(typeof val === 'string'){
                    if(val === 'new'){
                        scope[singular] = scope.add();
                        val = false;
                    }
                    else {
                        val = {id: val};
                    }
                }
                if(val){
                    var type = typeof val === 'object' && val.id?'get':'query';

                    if(singular !== 'site') val.site = $window.localStorage.currentSite;
                    if(singular === 'section') val.venue = $window.localStorage.currentVenue;

                    var items = Resource[type](val, function() {
                        if(!_.isArray(items)){
                            items = [items];
                        }

                        if(_.isFunction(parseFn)){
                            items = parseFn(items);
                        }

                        scope[plural] = items||[];
                        scope[singular] = items[0]||{};
                        if(singular !== 'site'){
                            scope[singular].site = $window.localStorage.currentSite;
                        }
                    });
                }

                scope.save = function(item, isUpdate) {
                    item = item || scope[singular];
                    if(!item instanceof Resource){
                        item = scope.add(item);
                    }
                    if(_.isFunction(formatFn)){
                        item = formatFn(item);
                    }
                    item.$save(function() {
                        if(!isUpdate) $location.path('/'+plural);
                    });
                }
                scope.delete = function(item) {
                    item.$delete(function() {
                        $location.path('/'+plural).reload();
                    });
                }
            }
        }
    }])
    .directive("sites", ['GenericDirective', function(GenericDirective) {
        console.log('Sites Directive Init');
        return {
            restrict: 'A',
            link: {
                pre: function(scope, element, attrs) {
                    GenericDirective.create('site', scope, attrs, function(sites){
                        _.each(sites,function(site, i){
                            sites[i].scripts = strArrToCol(site.scripts);
                            sites[i].styles = strArrToCol(site.styles);
                        });
                        return sites;
                    },
                    function(site){
                        site.scripts = strArrFromCol(site.scripts);
                        site.styles = strArrFromCol(site.styles);
                        return site;
                    });
                }
            }
        };
        function strArrToCol(arr){
            _.each(arr,function(el,i){
                arr[i] = {src: el};
            });
            return arr;
        }
        function strArrFromCol(col){
            _.each(col,function(el,i){
                col[i] = el.src;
            });
            return col;
        }
    }])



    // Helper functions
    .factory('Helper', [function(){
        return {
            define: function(variable, defaultValue) {
                if (isUndefined(this[variable])) this[variable] = isUndefined(defaultValue) ? '' : defaultValue;
            },

            slugify: function(str) {
                return (str || '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase();
            },

            pluralize: window.pluralize,

            capitalize: window.capitalize,

            parseDate: function(str) {
                var m = str.match(/^(\d{1,2})\/(\d{2})\/(\d{2})\s(\d{1,2}):(\d{2}) ([AP]M)$/);
                console.log("parse match", m);
                var month = m[1];
                var day = m[2];
                var year = m[3];
                var hour = m[4];
                var minute = m[5];
                var AM_PM = m[6];
                console.log("AM_PM", AM_PM, hour);
                hour = AM_PM == "PM" ? (parseInt(hour) + 12).toString() : hour;
                console.log("hour", hour);
                var fin = [ "20", year, "-", month, "-", day, "T", hour, ":", minute, ":00" ];
                console.log(fin.join(""));
                return fin.join("");
            },

            getBaseHost: function(host) {
                host = host.replace(/^(https*:\/\/)*([^\/]+).*$/, '$2');
                return host.split('.').slice(-2).join('.');
            }
        }
    }])
    .controller('MainController', function(){})
    .controller('HeaderCtrl', function(){});


_.each(<<&resources>>, function(resource){
    var plural = pluralize(resource);
    console.log('loading directive', plural);
    angular.module('app')
        .factory(capitalize(resource), ['$resource', function($resource) {
            var path = '/'+dashed(plural)+'/:id';
            var params = {id: '@id'};
            if(resource !== 'site' && resource !== 'entertainer' && resource !== 'user'){
                path = '/sites/:site' + path;
                params.site = '@site';
            }
            return $resource('http://<<env>>api.flexsites.io'+path, params);
        }]);
        if(resource !== 'site'){
            angular.module('app')
                .directive(plural, ['GenericDirective', function(GenericDirective) {
                    console.log(resource, 'init directive');
                    return {
                        restrict: 'AE',
                        link: {
                            pre: function(scope, element, attrs) {
                                console.log(resource, 'run directive');
                                GenericDirective.create(resource, scope, attrs);
                                console.log(resource, 'finish directive');
                            }
                        }
                    };
                }]);
        }
    });

function dashed(str) {
    return str.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase();
}
function pluralize(str) {
    if (str.slice(-3) == "ium") {
        str = str.substr(0, str.length - 3) + "ia";
    } else {
        str += "s";
    }
    return str;
}
function capitalize(string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

