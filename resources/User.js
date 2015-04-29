  var apiBase = 'http://localapi.flexhub.io';
  var authHeader = 'authorization';
  var module = angular.module('FlexSite')
    .factory('User', ['FlexSiteResource', 'FlexSiteAuth', 'apiBase', function(Resource, FlexSiteAuth, apiBase) {
      var R = Resource('User', {
        'login': {
          params: {include: 'user'},
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              FlexSiteAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
              FlexSiteAuth.rememberMe = response.config.params.rememberMe !== false;
              FlexSiteAuth.save();
              return response.resource;
            }
          }, url: '/login', method: 'POST'
        },
        'logout': {
          interceptor: {
            response: function(response) {
              FlexSiteAuth.clearUser();
              FlexSiteAuth.clearStorage();
              return response.resource;
            }
          }, url:'/logout', method: 'POST'
        },
        'confirm': {
          url: '/confirm',
          method: 'GET'
        },
        'resetPassword': {url: '/reset', method: 'POST'},
        'getCurrent': {
          url: '/:id', method: 'GET', params: {
            id: function() {
              var id = FlexSiteAuth.currentUserId;
              if (id === null)id = '__anonymous__';
              return id;
            }
          }, interceptor: {
            response: function(response) {
              FlexSiteAuth.currentUserData = response.data;
              return response.resource;
            }
          }, __isGetCurrentUser__: true
        }
      });
      R.signIn = R.login;
      R.signOut = R.logout;
      R.updateOrCreate = R.upsert;
      R.update = R.updateAll;
      R.getCachedCurrent =
        function() {
          var data = FlexSiteAuth.currentUserData;
          return data ? new R(data) : null;
        };
      R.isAuthenticated = function() {
        return this.getCurrentId() !== null;
      };
      R.getCurrentId = function() {
        return FlexSiteAuth.currentUserId;
      };
      R.modelName = 'User';
      return R;
    }])
    .factory('FlexSiteAuth', function() {
      var props = ['accessTokenId', 'currentUserId'];
      var propsPrefix = '$FlexSite$';

      function FlexSiteAuth() {
        var self = this;
        props.forEach(function(name) {
          self[name] = load(name);
        });
        this.rememberMe = undefined;
        this.currentUserData = null;
      }

      FlexSiteAuth.prototype.save = function() {
        var self = this;
        var storage = this.rememberMe ? localStorage : sessionStorage;
        props.forEach(function(name) {
          save(storage, name, self[name]);
        });
      };
      FlexSiteAuth.prototype.setUser = function(accessTokenId, userId, userData) {
        this.accessTokenId = accessTokenId;
        this.currentUserId = userId;
        this.currentUserData = userData;
      };
      FlexSiteAuth.prototype.clearUser = function() {
        this.accessTokenId = null;
        this.currentUserId = null;
        this.currentUserData = null;
      };
      FlexSiteAuth.prototype.clearStorage = function() {
        props.forEach(function(name) {
          save(sessionStorage, name, null);
          save(localStorage, name, null);
        });
      };
      return new FlexSiteAuth;
      function save(storage, name, value) {
        var key = propsPrefix + name;
        if (value === null)value = '';
        storage[key] = value;
      }

      function load(name) {
        var key = propsPrefix + name;
        return localStorage[key] || sessionStorage[key] || null;
      }
    }).config(['$httpProvider', function($httpProvider) {
      $httpProvider.interceptors.push('FlexSiteAuthRequestInterceptor');
    }]);
