var async, npm, _;
_ = require('lodash-contrib');
async = require('async');
npm = require('./npm');
exports.isUpdated = npm.isUpdated;
/**
 * Update an NPM package
 */
exports.update = function(packageJSON, callback) {
  if (packageJSON == null) {
    throw new Error('Missing package json');
  }
  if (!_.isPlainObject(packageJSON)) {
    throw new Error("Invalid package json: " + packageJSON);
  }
  return async.waterfall([
    function(callback) {
      return npm.isUpdated(packageJSON, callback);
    }, function(isUpdated, callback) {
      if (isUpdated) {
        return callback(new Error('You\'re already running the latest version.'));
      }
      return npm.update(packageJSON, callback);
    }
  ], callback);
};
