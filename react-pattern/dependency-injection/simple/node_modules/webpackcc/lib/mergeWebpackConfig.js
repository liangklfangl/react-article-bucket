'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeCustomConfig;

var _fs = require('fs');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function mergeCustomConfig(webpackConfig, customConfigPath) {
  if (!(0, _fs.existsSync)(customConfigPath)) {
    return webpackConfig;
  }
  var customConfig = require(customConfigPath);
  if (typeof customConfig === 'function') {
    return customConfig.apply(undefined, [webpackConfig].concat(_toConsumableArray([].concat(Array.prototype.slice.call(arguments)).slice(2))));
  }

  throw new Error('Return of ' + customConfigPath + ' must be a function.');
}
module.exports = exports['default'];