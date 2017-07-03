"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = bundleWDevServer;

var _Server = require("webpack-dev-server/lib/Server");

var _Server2 = _interopRequireDefault(_Server);

var _opn = require("opn");

var _opn2 = _interopRequireDefault(_opn);

var _webpack = require("webpack");

var _webpack2 = _interopRequireDefault(_webpack);

var _portfinder = require("portfinder");

var _portfinder2 = _interopRequireDefault(_portfinder);

var _updateEntry = require("./entrys/updateEntry");

var _updateEntry2 = _interopRequireDefault(_updateEntry);

var _createDomain = require("./entrys/createDomain");

var _createDomain2 = _interopRequireDefault(_createDomain);

var _chokidar = require("chokidar");

var _chokidar2 = _interopRequireDefault(_chokidar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var devServerOpt = {};
var DEFAULT_PORT = 8080;

function colorInfo(useColor, msg) {
  if (useColor)
    // Make text blue and bold, so it *pops*
    return "\x1B[1m\x1B[34m" + msg + "\x1B[39m\x1B[22m";
  return msg;
}

function colorError(useColor, msg) {
  if (useColor)
    // Make text red and bold, so it *pops*
    return "\x1B[1m\x1B[31m" + msg + "\x1B[39m\x1B[22m";
  return msg;
}
/**
 * [bundleWDevServer We start devServer]
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
function bundleWDevServer(defaultWebpackConfig, program) {
  var devServerOpt = defaultWebpackConfig.devServer || {};
  //we get Server.js not webpack-dev-server command line , so we must open browser by ourself!
  if (!devServerOpt.host) {
    devServerOpt.host = "localhost";
  }
  //HMR, we force to disable hmr
  if (!devServerOpt.hot || devServerOpt.hot) {
    devServerOpt.hot = true;
  }

  if (!program.dev) {
    devServerOpt.hot = false;
  }
  //set ContentBase
  if (devServerOpt.contentBase === undefined) {
    if (devServerOpt["contentBase"]) {
      devServerOpt.contentBase = devServerOpt["contentBase"];
    } else if (devServerOpt["contentBase"] === false) {
      devServerOpt.contentBase = false;
    }
  }
  //watch contentBase
  if (devServerOpt["watchContentBase"]) devServerOpt.watchContentBase = true;

  if (!devServerOpt.stats) {
    devServerOpt.stats = {
      cached: false,
      cachedAssets: false
    };
  }
  //open browser automatically
  if (devServerOpt["open"]) devServerOpt.open = true;
  //if a valid port is defined , we start server
  if (devServerOpt.port) {
    startDevServer(defaultWebpackConfig, devServerOpt);
    return;
  }

  //otherwise we choose a valid port
  _portfinder2.default.basePort = 0;
  _portfinder2.default.getPort(function (err, port) {
    if (err) throw err;
    devServerOpt.port = port;
    startDevServer(defaultWebpackConfig, devServerOpt);
  });
}

/**
 * [startDevServer Start our devServer using valid options]
 * @param  {[type]} wpOpt   [description]
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function startDevServer(wpOpt, options) {
  (0, _updateEntry2.default)(wpOpt, options);
  //Add "webpack/hot/only-dev-server","webpack/hot/dev-server" and ${require.resolve("../../client/")}?${domain}
  //to entry files
  var compiler = void 0;

  try {
    compiler = (0, _webpack2.default)(wpOpt);
    //begin to webpack compile
  } catch (e) {
    console.log('webpack compile error!');
    if (e instanceof _webpack2.default.WebpackOptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  var uri = (0, _createDomain2.default)(options) + (options.inline !== false || options.lazy === true ? "/" : "/webpack-dev-server/");
  var server = void 0;
  try {
    server = new _Server2.default(compiler, options);
    //we initiate a server using devServer configuration
  } catch (e) {
    var OptionsValidationError = require("webpack-dev-server/lib/OptionsValidationError");
    if (e instanceof OptionsValidationError) {
      console.error(colorError(options.stats.colors, e.message));
      process.exit(1); // eslint-disable-line
    }
    throw e;
  }
  //server.listen([port][, hostname][, backlog][, callback])
  server.listen(options.port, options.host, function (err) {
    if (err) throw err;
    reportReadiness(uri, options);
  });
}

function reportReadiness(uri, options) {
  var useColor = devServerOpt.color;
  var startSentence = "Project is running at " + colorInfo(useColor, uri);
  if (options.socket) {
    startSentence = "Listening to socket at " + colorInfo(useColor, options.socket);
  }
  console.log((devServerOpt["progress"] ? "\n" : "") + startSentence);
  //是否有进度信息
  console.log("webpack output is served from " + colorInfo(useColor, options.publicPath));
  var contentBase = Array.isArray(options.contentBase) ? options.contentBase.join(", ") : options.contentBase;
  //设置contentBase
  if (contentBase) console.log("Content not from webpack is served from " + colorInfo(useColor, contentBase));
  //更加说明了contentBase不是从webpack打包中获取的，而是直接express.static指定静态文件路径
  if (options.historyApiFallback) console.log("404s will fallback to " + colorInfo(useColor, options.historyApiFallback.index || "/index.html"));
  //historyApiFallback回退到index.html
  if (options.open) {
    //打开一个页面
    (0, _opn2.default)(uri).catch(function () {
      console.log("Unable to open browser. If you are running in a headless environment, please do not use the open flag.");
    });
  }
}
module.exports = exports['default'];