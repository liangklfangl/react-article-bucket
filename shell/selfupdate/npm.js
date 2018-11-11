var async, npm, utils, _;
npm = require('npm');
async = require('async');
_ = require('lodash-contrib');
utils = require('./utils');

/**
 * @summary Get information about an NPM package
 */
exports.getInfo = function(name, callback) {
  // https://github.com/liangklfangl/react-article-bucket/tree/master/async-programing/async-js#43-asyncify%E7%94%A8%E4%BA%8Eparallel%E6%96%B9%E6%B3%95
  return async.waterfall([
    function(callback) {
      var options;
      options = {
        loglevel: 'silent',
        global: true
      };
      return npm.load(options, _.unary(callback));
      // unary:Creates a function that accepts up to one argument, ignoring any additional arguments.
    }, function(callback) {
      //npm view命令
      return npm.commands.view([name], true, callback);
    }
  ], callback);
};


/**
 * Get the latest available version of an NPM package
 */

exports.getLatestVersion = function(name, callback) {
  return exports.getInfo(name, function(error, data) {
    var versions;
    if (error != null) {
      return callback(error);
    }
    versions = _.keys(data);
    return callback(null, _.first(versions));
  });
};

/**
 *  Checks that a package is on the latest version
 */
exports.isUpdated = function(packageJSON, callback) {
  return exports.getLatestVersion(packageJSON.name, function(error, latestVersion) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, packageJSON.version === latestVersion);
  });
};

/**
 * Update an NPM package
 */

exports.update = function(packageJSON, callback) {
  return async.waterfall([
    function(callback) {
      var command;
      command = utils.getUpdateCommand(packageJSON.name);
      return utils.runCommand(command, callback);
    }, function(stdout, stderr, callback) {
      if (!_.isEmpty(stderr)) {
        return callback(new Error(stderr));
      }
      return exports.getLatestVersion(packageJSON.name, callback);
    }
  ], callback);
};
