var child_process, president, _;
president = require('president');
_ = require('lodash-contrib');
child_process = require('child_process');
/**
 * 得到更新的命令
 */
exports.getUpdateCommand = function(name) {
  if (name == null) {
    throw new Error('Missing package');
  }
  return "npm install --silent --global " + name;
};
/**
 * 判断一个错误是否是权限相关的
 */
exports.isPermissionError = function(error) {
  if (error == null) {
    return false;
  }
  if (error.message == null) {
    error.message = '';
  }
  return _.any([error.code === 3, error.errno === 3, error.code === 'EPERM', error.code === 'EACCES', error.code === 'ACCES', error.message.indexOf('EACCES') !== -1]);
};

/**
 *  Run a command, and elevate if necessary
 */

exports.runCommand = function(command, callback) {
  return child_process.exec(command, function(error, stdout, stderr) {
    if (_.any([exports.isPermissionError(error), exports.isPermissionError(new Error(stderr))])) {
      return president.execute(command, callback);
    }
    return callback(error, stdout, stderr);
  });
};
