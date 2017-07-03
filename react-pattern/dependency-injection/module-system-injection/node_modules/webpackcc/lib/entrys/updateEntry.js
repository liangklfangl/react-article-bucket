"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var createDomain = require("./createDomain");

module.exports = function addDevServerEntrypoints(webpackOptions, devServerOptions) {
  if (devServerOptions.inline !== false) {
    var domain = createDomain(devServerOptions);
    // const devClient = [`${require.resolve("../../client/")}?${domain}`];
    var devClient = [require.resolve("wds-hack") + "?" + domain];
    if (devServerOptions.hotOnly) devClient.push("webpack/hot/only-dev-server");else if (devServerOptions.hot) devClient.push("webpack/hot/dev-server");
    [].concat(webpackOptions).forEach(function (wpOpt) {
      if (_typeof(wpOpt.entry) === "object" && !Array.isArray(wpOpt.entry)) {
        Object.keys(wpOpt.entry).forEach(function (key) {
          wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
        });
      } else {
        wpOpt.entry = devClient.concat(wpOpt.entry);
      }
    });
  }
};