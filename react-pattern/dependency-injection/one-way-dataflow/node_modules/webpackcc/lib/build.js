'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _getWebpackDefaultConfig = require('./getWebpackDefaultConfig');

var _getWebpackDefaultConfig2 = _interopRequireDefault(_getWebpackDefaultConfig);

var _mergeWebpackConfig = require('./mergeWebpackConfig');

var _mergeWebpackConfig2 = _interopRequireDefault(_mergeWebpackConfig);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _webpack = require('webpack');

var _webpack2 = _interopRequireDefault(_webpack);

var _statsWebpackPlugin = require('stats-webpack-plugin');

var _statsWebpackPlugin2 = _interopRequireDefault(_statsWebpackPlugin);

var _dllplugindync = require('dllplugindync');

var _dllplugindync2 = _interopRequireDefault(_dllplugindync);

var _htmlWebpackPlugin = require('html-webpack-plugin');

var _htmlWebpackPlugin2 = _interopRequireDefault(_htmlWebpackPlugin);

var _devServer = require('./devServer');

var _devServer2 = _interopRequireDefault(_devServer);

var _webpackWatch = require('./webpackWatch');

var _webpackWatch2 = _interopRequireDefault(_webpackWatch);

var _fs = require('fs');

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _updateRules = require('./updateRules');

var _updateRules2 = _interopRequireDefault(_updateRules);

var _webpackMerge = require('webpack-merge');

var _webpackMerge2 = _interopRequireDefault(_webpackMerge);

var _dedupeRule = require('./updateRules/dedupeRule');

var _dedupeRule2 = _interopRequireDefault(_dedupeRule);

var _dedupePlugin = require('./updateRules/dedupePlugin');

var _dedupePlugin2 = _interopRequireDefault(_dedupePlugin);

var _dedupeItem = require('./updateRules/dedupeItem');

var _dedupeItem2 = _interopRequireDefault(_dedupeItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

//Unique plugin and rule and item etc
var exist = require('exist.js');
var mangleWebpackConfig = require("./livehook");
function build(program, callback) {
  var defaultHtml = "../test/index.html";
  var useDefinedHtml = "";

  //With no html template configured, we use our own
  if (program.htmlTemplate) {
    useDefinedHtml = (0, _fs.existsSync)(_path2.default.resolve(process.cwd(), program.htmlTemplate)) ? _path2.default.resolve(process.cwd(), program.htmlTemplate) : defaultHtml;
  }
  var defaultWebpackConfig = (0, _getWebpackDefaultConfig2.default)(program);
  //get default webpack configuration
  if (program.outputPath) {
    defaultWebpackConfig.output.path = program.outputPath;
  }
  //update output path
  if (program.publichPath) {
    defaultWebpackConfig.output.publicPath = program.publicPath;
  }
  //update public path
  if (program.stj) {
    defaultWebpackConfig.plugins.push(new _statsWebpackPlugin2.default(program.stj, {
      //options passed to stats.json
    }));
  }
  //inject HotModuleReplacementPlugin
  if (program.dev) {
    defaultWebpackConfig.plugins.push(new _webpack2.default.HotModuleReplacementPlugin());
  }

  //we inject html by HtmlWebpackPlugin
  if (!program.dev) {
    defaultWebpackConfig.plugins.push(new _htmlWebpackPlugin2.default({
      title: "HtmlPlugin",
      // filename :"index.html",
      template: useDefinedHtml || _path2.default.join(__dirname, "../test/index.html"),
      // template:(useDefinedHtml ? useDefinedHtml : defaultHtml),
      //we must use html-loader here instead of file-loader
      inject: "body",
      cache: false,
      xhtml: false
    }));
  } else {
    defaultWebpackConfig.plugins.push(new _htmlWebpackPlugin2.default({
      title: "HtmlPlugin",
      // filename :"index.html",
      template: useDefinedHtml || _path2.default.join(__dirname, "../test/warning.html"),
      // template:(useDefinedHtml ? useDefinedHtml : defaultHtml),
      //we must use html-loader here instead of file-loader
      inject: "body",
      cache: false,
      xhtml: false
    }));
  }
  //we inject DllReferencePlugin
  if (program.manifest) {
    defaultWebpackConfig.plugins.push(new _dllplugindync2.default({
      manifest: program.manifest,
      context: program.cwd
    }));
  }
  if (!program.dev) {
    //https://github.com/mishoo/UglifyJS2
    defaultWebpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new _webpack2.default.optimize.UglifyJsPlugin({
      beautify: false,
      sourceMap: true,
      // use SourceMaps to map error message locations to modules. 
      //This slows down the compilation. (default: true)
      comments: false,
      //Defaults to preserving comments containing /*!, /**!, @preserve or @license.
      output: {
        ascii_only: true
      },
      compress: {
        warnings: false,
        //no warnings when remove unused code,
        drop_console: true,
        //drop console
        collapse_vars: true,
        //Collapse single-use var and const definitions when possible.
        reduce_vars: true
      }
    }), new _webpack2.default.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    })]);
  } else {
    if (process.env.NODE_ENV) {
      defaultWebpackConfig.plugins = [].concat(_toConsumableArray(defaultWebpackConfig.plugins), [new _webpack2.default.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      })]);
    }
  }
  //User defined webpack.config.js to update our common webpack config
  if (program.config) {
    //defaultWebpackConfig = mergeCustomConfig(defaultWebpackConfig, resolve(program.cwd, program.config || 'webpack.config.js'));
    var customWebpackConfigPath = _path2.default.resolve(program.cwd, program.config || 'webpack.config.js');
    if ((0, _fs.existsSync)(customWebpackConfigPath)) {
      var customConfig = require(customWebpackConfigPath);
      defaultWebpackConfig = _dedupeItem2.default.dedupeItem(defaultWebpackConfig, customConfig);
      //unique webpack loaders
      if (exist.get(customConfig, "module.rules")) {
        _dedupeRule2.default.dedupeRule(defaultWebpackConfig, customConfig);
      }
      //unique our plugins
      if (exist.get(customConfig, "plugins")) {
        _dedupePlugin2.default.dedupePlugin(defaultWebpackConfig, customConfig);
      }
      if (program.karma) _dedupePlugin2.default.optimizeKarmaPlugin(defaultWebpackConfig);
    }
  }

  //development mode , we should inject style-loader to support HMR!
  defaultWebpackConfig = (0, _updateRules2.default)(defaultWebpackConfig, program.dev);
  //You can manipulate config last chance
  //complicate see https://github.com/webpack/tapable
  if (typeof program.hook == "function") {
    mangleWebpackConfig(defaultWebpackConfig, program.hook);
  }
  // console.log('-------------',util.inspect(defaultWebpackConfig,{showHidden:true,depth:4}));
  //in production mode
  //Whether we should start DevServer which serve file from memory instead of fileSystem
  if (program.karma) {
    //We are now in `test` mode , we just only get webpack configuration with commonchunkplugin removed!
    return defaultWebpackConfig;
  }
  //Just get config without bundling
  if (program.onlyCf) {
    return defaultWebpackConfig;
  }

  if (program.devServer) {
    (0, _devServer2.default)(defaultWebpackConfig, program);
  } else {
    //we use watch method of webpack
    (0, _webpackWatch2.default)(defaultWebpackConfig, program);
  }
  return defaultWebpackConfig;
}
module.exports = exports['default'];