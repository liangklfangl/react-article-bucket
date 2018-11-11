var child_process, _;
child_process = require('child_process');
_ = require('lodash');
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
  return child_process.exec("sudo " + command, function(error, stdout, stderr) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, stdout, stderr);
  });
};
