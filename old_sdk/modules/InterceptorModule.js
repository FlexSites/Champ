angular.module('app')
    .factory('AuthInterceptor', ['$q','$location',function($q,$location){

        // TokenService URL
        var tokenService = 'http://<<env>>api.flexhub.io/tokens';

        return {
            request: function(config) {
                console.log('request', config);
                // Check if it the request is for the API mananger
                // the API manager has two paths, one internal and one external
                if (/api.flexhub.io/.test(config.url) && config.url !== tokenService) {

                    // They already have a token and it's not expired
                    if ($window.sessionStorage.bearer)
                    {
                        config.headers = {
                            Authorization: "Bearer " + $window.sessionStorage.bearer,
                            accept: 'application/json',
                            'content-type': 'application/json'
                        }
                    }
                    else
                    {
                        // Uncomment when auth is working
                        // $location.path('/login');
                    }
                } 
                return config;
            },
            response: function(response){
                if (response.status === 401) {
                    console.log("Response 401");
                }
                return response || $q.when(response);
            },
            responseError: function(rejection) {
                if (rejection.status === 401) {
                    console.log("Response Error 401",rejection);
                    $location.path('/login').search('returnTo', $location.path());
                }
                return $q.reject(rejection);
            }
        }
    }]);
