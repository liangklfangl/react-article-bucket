var windosu, _;
_ = require('lodash');
windosu = require('windosu');
exports.executeWithPrivileges = function(command, callback) {
  if (command == null) {
    throw new Error('Missing command argument');
  }
  if (!_.isString(command)) {
    throw new Error('Invalid command argument: not a string');
  }
  if (_.isEmpty(command)) {
    throw new Error('Invalid command argument: empty string');
  }
  if (callback == null) {
    throw new Error('Missing callback argument');
  }
  if (!_.isFunction(callback)) {
    throw new Error('Invalid callback argument: not a function');
  }
  return windosu.exec(command, function(error, output) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, output, null);
  });
};
