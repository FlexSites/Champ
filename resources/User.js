(function(window, angular, undefined) {
	var urlBase = "http://localapi.flexhub.io";
	var authHeader = "authorization";
	var module = angular.module("FlexSite");
	module.factory("User", ["FlexSiteResource", "FlexSiteAuth", "$injector", function(Resource, FlexSiteAuth, $injector) {
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
						FlexSiteAuth.setUser(accessToken.id, accessToken.userId, accessToken.user);
						FlexSiteAuth.rememberMe = response.config.params.rememberMe !== false;
						FlexSiteAuth.save();
						return response.resource
					}
				}, url: urlBase + "/Users/login", method: "POST"
			},
			"logout": {
				interceptor: {
					response: function(response) {
						FlexSiteAuth.clearUser();
						FlexSiteAuth.clearStorage();
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
						var id = FlexSiteAuth.currentUserId;
						if (id == null)id = "__anonymous__";
						return id
					}
				}, interceptor: {
					response: function(response) {
						FlexSiteAuth.currentUserData = response.data;
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
				var data = FlexSiteAuth.currentUserData;
				return data ? new R(data) : null
			};
		R.isAuthenticated = function() {
			return this.getCurrentId() != null
		};
		R.getCurrentId = function() {
			return FlexSiteAuth.currentUserId
		};
		R.modelName = "User";
		return R
	}]);
	module.factory("FlexSiteAuth", function() {
		var props = ["accessTokenId", "currentUserId"];
		var propsPrefix = "$FlexSite$";

		function FlexSiteAuth() {
			var self = this;
			props.forEach(function(name) {
				self[name] = load(name)
			});
			this.rememberMe = undefined;
			this.currentUserData = null
		}

		FlexSiteAuth.prototype.save = function() {
			var self = this;
			var storage = this.rememberMe ? localStorage : sessionStorage;
			props.forEach(function(name) {
				save(storage, name, self[name])
			})
		};
		FlexSiteAuth.prototype.setUser = function(accessTokenId, userId, userData) {
			this.accessTokenId = accessTokenId;
			this.currentUserId = userId;
			this.currentUserData = userData
		};
		FlexSiteAuth.prototype.clearUser = function() {
			this.accessTokenId = null;
			this.currentUserId = null;
			this.currentUserData = null
		};
		FlexSiteAuth.prototype.clearStorage = function() {
			props.forEach(function(name) {
				save(sessionStorage, name, null);
				save(localStorage, name, null)
			})
		};
		return new FlexSiteAuth;
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
		$httpProvider.interceptors.push("FlexSiteAuthRequestInterceptor")
	}])
})(window, window.angular);