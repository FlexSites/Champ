angular.module('FlexSite')
    .factory('Session', ['FlexSiteResource', 'FlexSiteAuth', 'apiBase', function(Resource, FlexSiteAuth, apiBase) {
      var R = Resource('Session', {
        'create': {
          params: {include: 'session'},
          interceptor: {
            response: function(response) {
              var accessToken = response.data;
              FlexSiteAuth.setUser(accessToken.id, accessToken.sessionId, accessToken.session);
              FlexSiteAuth.rememberMe = response.config.params.rememberMe !== false;
              FlexSiteAuth.save();
              return response.resource;
            }
          }, url: '/', method: 'POST'
        },
        'deleteById': {
          interceptor: {
            response: function(response) {
              FlexSiteAuth.clearSession();
              FlexSiteAuth.clearStorage();
              return response.resource;
            }
          }, url:'/', method: 'DELETE'
        },
        'confirm': {
          url: '/confirm',
          method: 'GET'
        }
      });

      R.signIn = R.create;
      R.signOut = R.destroyById;
      R.getCachedCurrent =
        function() {
          var data = FlexSiteAuth.currentSessionData;
          return data ? new R(data) : null;
        };
      R.isAuthenticated = function() {
        return this.getCurrentId() !== null;
      };
      R.getCurrentId = function() {
        return FlexSiteAuth.currentSessionId;
      };
      R.modelName = 'Session';
      return R;
    }])
    .factory('FlexSiteAuth', function() {
      var props = ['accessTokenId', 'currentSessionId'];
      var propsPrefix = '$FlexSite$';

      function FlexSiteAuth() {
        var self = this;
        props.forEach(function(name) {
          self[name] = load(name);
        });
        this.rememberMe = undefined;
        this.currentSessionData = null;
      }

      FlexSiteAuth.prototype.save = function() {
        var self = this;
        var storage = this.rememberMe ? localStorage : sessionStorage;
        props.forEach(function(name) {
          save(storage, name, self[name]);
        });
      };
      FlexSiteAuth.prototype.setUser = function(accessTokenId, sessionId, sessionData) {
        this.accessTokenId = accessTokenId;
        this.currentSessionId = sessionId;
        this.currentSessionData = sessionData;
      };
      FlexSiteAuth.prototype.clearSession = function() {
        this.accessTokenId = null;
        this.currentSessionId = null;
        this.currentSessionData = null;
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
    });
