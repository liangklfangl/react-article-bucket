'use strict';

var _os = require('os');

/**
 * @return {[type]}
 */
function getDefaultBabelConfig() {
  return {
    cacheDirectory: (0, _os.tmpdir)(),
    //We must set!
    presets: [require.resolve('babel-preset-es2015-ie'), require.resolve('babel-preset-react'), require.resolve('babel-preset-stage-0')],
    plugins: [require.resolve('babel-plugin-add-module-exports'), require.resolve('babel-plugin-transform-decorators-legacy')]
  };
}

module.exports = {
  getDefaultBabel: getDefaultBabelConfig
};