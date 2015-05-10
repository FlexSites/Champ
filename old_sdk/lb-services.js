(function(window, angular, undefined) {
	var urlBase = "http://localapi.flexsites.io";
	var authHeader = "authorization";
	var module = angular.module("loopback", ["ngResource"]);
	module.factory("User", ["LoopBackResource", "LoopBackAuth", "$injector", function(Resource, LoopBackAuth, $injector) {
		var R = Resource(urlBase + "/Users/:id", {"id": "@id"}, {
			"prototype$__findById__accessTokens": {url: urlBase + "/Users/:id/accessTokens/:fk", method: "GET"},
			"prototype$__destroyById__accessTokens": {url: urlBase + "/Users/:id/accessTokens/:fk", method: "DELETE"},
			"prototype$__updateById__accessTokens": {url: urlBase + "/Users/:id/accessTokens/:fk", method: "PUT"},
			"prototype$__get__accessTokens": {isArray: true, url: urlBase + "/Users/:id/accessTokens", method: "GET"},
			"prototype$__create__accessTokens": {url: urlBase + "/Users/:id/accessTokens", method: "POST"},
			"prototype$__delete__accessTokens": {url: urlBase + "/Users/:id/accessTokens", method: "DELETE"},
			"prototype$__count__accessTokens": {url: urlBase + "/Users/:id/accessTokens/count", method: "GET"},
			"create": {url: urlBase + "/Users", method: "POST"},
			"upsert": {url: urlBase + "/Users", method: "PUT"},
			"exists": {url: urlBase + "/Users/:id/exists", method: "GET"},
			"findById": {url: urlBase + "/Users/:id", method: "GET"},
			"find": {isArray: true, url: urlBase + "/Users", method: "GET"},
			"findOne": {url: urlBase + "/Users/findOne", method: "GET"},
			"updateAll": {url: urlBase + "/Users/update", method: "POST"},
			"deleteById": {url: urlBase + "/Users/:id", method: "DELETE"},
			"count": {url: urlBase + "/Users/count", method: "GET"},
			"prototype$updateAttributes": {url: urlBase + "/Users/:id", method: "PUT"},
			"login": {
				params: {include: "user"},
				interceptor: {
					response: function(response) {
						var accessToken = response.data;
						LoopBackAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
						LoopBackAuth.rememberMe = response.config.params.rememberMe !== false;
						LoopBackAuth.save();
						return response.resource
					}
				}, url: urlBase + "/Users/login", method: "POST"
			},
			"logout": {
				interceptor: {
					response: function(response) {
						LoopBackAuth.clearUser();
						LoopBackAuth.clearStorage();
						return response.resource
					}
				}, url: urlBase + "/Users/logout", method: "POST"
			},
			"confirm": {
				url: urlBase + "/Users/confirm",
				method: "GET"
			},
			"resetPassword": {url: urlBase + "/Users/reset", method: "POST"},
			"getCurrent": {
				url: urlBase + "/Users" + "/:id", method: "GET", params: {
					id: function() {
						var id = LoopBackAuth.currentUserId;
						if (id == null)id = "__anonymous__";
						return id
					}
				}, interceptor: {
					response: function(response) {
						LoopBackAuth.currentUserData = response.data;
						return response.resource
					}
				}, __isGetCurrentUser__: true
			}
		});
		R["updateOrCreate"] = R["upsert"];
		R["update"] = R["updateAll"];
		R["destroyById"] = R["deleteById"];
		R["removeById"] = R["deleteById"];
		R.getCachedCurrent =
			function() {
				var data = LoopBackAuth.currentUserData;
				return data ? new R(data) : null
			};
		R.isAuthenticated = function() {
			return this.getCurrentId() != null
		};
		R.getCurrentId = function() {
			return LoopBackAuth.currentUserId
		};
		R.modelName = "User";
		return R
	}]);
	module.factory("Page", ["LoopBackResource", "LoopBackAuth", "$injector", function(Resource, LoopBackAuth, $injector) {
		var R = Resource(urlBase + "/pages/:id", {"id": "@id"}, {
			"create": {url: urlBase + "/pages", method: "POST"},
			"upsert": {url: urlBase + "/pages", method: "PUT"},
			"exists": {
				url: urlBase +
				"/pages/:id/exists", method: "GET"
			},
			"findById": {url: urlBase + "/pages/:id", method: "GET"},
			"find": {isArray: true, url: urlBase + "/pages", method: "GET"},
			"findOne": {url: urlBase + "/pages/findOne", method: "GET"},
			"updateAll": {url: urlBase + "/pages/update", method: "POST"},
			"deleteById": {url: urlBase + "/pages/:id", method: "DELETE"},
			"count": {url: urlBase + "/pages/count", method: "GET"},
			"prototype$updateAttributes": {url: urlBase + "/pages/:id", method: "PUT"}
		});
		R["updateOrCreate"] = R["upsert"];
		R["update"] = R["updateAll"];
		R["destroyById"] =
			R["deleteById"];
		R["removeById"] = R["deleteById"];
		R.modelName = "Page";
		return R
	}]);
	module.factory("LoopBackAuth", function() {
		var props = ["accessTokenId", "currentUserId"];
		var propsPrefix = "$LoopBack$";

		function LoopBackAuth() {
			var self = this;
			props.forEach(function(name) {
				self[name] = load(name)
			});
			this.rememberMe = undefined;
			this.currentUserData = null
		}

		LoopBackAuth.prototype.save = function() {
			var self = this;
			var storage = this.rememberMe ? localStorage : sessionStorage;
			props.forEach(function(name) {
				save(storage, name, self[name])
			})
		};
		LoopBackAuth.prototype.setUser = function(accessTokenId, userId, userData) {
			this.accessTokenId = accessTokenId;
			this.currentUserId = userId;
			this.currentUserData = userData
		};
		LoopBackAuth.prototype.clearUser = function() {
			this.accessTokenId = null;
			this.currentUserId = null;
			this.currentUserData = null
		};
		LoopBackAuth.prototype.clearStorage = function() {
			props.forEach(function(name) {
				save(sessionStorage, name, null);
				save(localStorage, name, null)
			})
		};
		return new LoopBackAuth;
		function save(storage, name, value) {
			var key = propsPrefix + name;
			if (value == null)value = "";
			storage[key] = value
		}

		function load(name) {
			var key = propsPrefix + name;
			return localStorage[key] || sessionStorage[key] || null
		}
	}).config(["$httpProvider", function($httpProvider) {
		$httpProvider.interceptors.push("LoopBackAuthRequestInterceptor")
	}]).factory("LoopBackAuthRequestInterceptor", ["$q", "LoopBackAuth", function($q, LoopBackAuth) {
		return {
			"request": function(config) {
				if (config.url.substr(0, urlBase.length) !== urlBase)return config;
				if (LoopBackAuth.accessTokenId)config.headers[authHeader] =
					LoopBackAuth.accessTokenId; else if (config.__isGetCurrentUser__) {
					var res = {
						body: {error: {status: 401}}, status: 401, config: config, headers: function() {
							return undefined
						}
					};
					return $q.reject(res)
				}
				return config || $q.when(config)
			}
		}
	}]).provider("LoopBackResource", function LoopBackResourceProvider() {
		this.setAuthHeader = function(header) {
			authHeader = header
		};
		this.setUrlBase = function(url) {
			urlBase = url
		};
		this.$get = ["$resource", function($resource) {
			return function(url, params, actions) {
				var resource = $resource(url, params, actions);
				resource.prototype.$save = function(success, error) {
					var result = resource.upsert.call(this, {}, this, success, error);
					return result.$promise || result
				};
				return resource
			}
		}]
	})
})(window, window.angular);
