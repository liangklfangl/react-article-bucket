var os;
os = require('os');
exports.execute = function(command, callback) {
  var commander;
  if (os.platform() === 'win32') {
    commander = require('./windows');
  } else {
    commander = require('./unix');
  }
  return commander.executeWithPrivileges(command, callback);
};
