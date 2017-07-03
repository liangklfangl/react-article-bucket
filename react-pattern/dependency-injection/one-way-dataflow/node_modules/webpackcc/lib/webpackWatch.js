"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = webpackWatch;

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _stripAnsi = require("strip-ansi");

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _fs = require("fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function webpackWatch(defaultWebpackConfig, program) {
  var compiler = (0, _webpack2.default)(defaultWebpackConfig);
  var watching = null;
  var customWebpackPath = program.config ? _path2.default.resolve(program.cwd, program.config) : "";
  //we watch file change, so if entry file configured in package.json changed, it will
  //compile automatically. And also we watch file of custom webpack.config.js for changes!
  if (program.watch) {
    var delay = typeof program.watch === "number" ? program.watch : 200;
    watching = compiler.watch(delay, doneHandler.bind(program));
    if (customWebpackPath && (0, _fs.existsSync)(customWebpackPath)) {
      _chokidar2.default.watch(customWebpackPath).on('change', function () {
        console.log('You must restart to compile because configuration file changed!');
        process.exit(0);
        //We must exit because configuration file changed!
      });
    }
  } else {
    compiler.run(doneHandler.bind(program));
  }
  return compiler;
}

/**
 * [doneHandler Deal with warnings/errors of compilation and ignore all info]
 * @param  {[type]} err   [description]
 * @param  {[type]} stats [description]
 * @return {[type]}       [description]
 */
function doneHandler(err, stats) {

  //get all errors
  if (stats.hasErrors()) {
    printErrors(stats.compilation.errors, true);
  }
  var warnings = stats.warnings && stats.warnings.length == 0;
  if (stats.hasWarnings()) {
    printErrors(stats.compilation.warnings);
  }
  console.log("Compilation finished!\n");
}
/**
 * [printErrors log errors of compilation]
 * @param  {[type]} errors [description]
 * @return {[type]}        [description]
 */
function printErrors(errors) {
  var isError = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  console.log("Compilation Errors or Warnings as follows:\n");
  var strippedErrors = errors.map(function (error) {
    return (0, _stripAnsi2.default)(error);
  });
  for (var i = 0; i < strippedErrors.length; i++) {
    isError ? console.error(strippedErrors[i]) : console.warn(strippedErrors[i]);
  }
}
module.exports = exports['default'];