angular.module('FlexSite')
  .factory("Page", ["FlexSiteResource", "FlexSiteAuth", "$injector", function(Resource, FlexSiteAuth, $injector) {
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