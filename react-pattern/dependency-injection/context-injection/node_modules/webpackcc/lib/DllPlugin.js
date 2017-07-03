"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _resolve = require("resolve");

var _resolve2 = _interopRequireDefault(_resolve);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isRelativePath(filename) {
  return filename.indexOf(".") === 0;
}
/**
 * [resolveConfigFile the filepath is relative to process.cwd]
 * @param  {[type]} filename [description]
 * @return {[type]}          [filepath]
 */
function resolveConfigFile(filename) {
  var result = void 0;
  try {
    result = isRelativePath(filename) ? _resolve2.default.sync(filename, {
      basedir: process.cwd()
    }) : _resolve2.default.sync("./" + filename, {
      basedir: process.cwd()
    });
  } catch (e) {}

  return result;
}
/**
 * [build description]
 * @param  {[type]} program [description]
 * @return {[type]}         [description]
 */
function build(program) {
  var dllconfigPath = resolveConfigFile(program.dll);
  //get config file
  if (!dllconfigPath) {
    new Error('You must specify an existing config file for dllplugin');
  }
  var vendorPath = _path2.default.dirname(dllconfigPath + "/vendors.js");
  var webpackConfig = require(dllconfigPath);
  //get our vendors.js
  (0, _webpack2.default)(webpackConfig, function () {
    console.log('done');
  });
}
module.exports = exports['default'];