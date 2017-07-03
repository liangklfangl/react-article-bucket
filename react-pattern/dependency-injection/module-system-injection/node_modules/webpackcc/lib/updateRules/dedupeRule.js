'use strict';

var exist = require('exist.js');
var merge = require('webpack-merge');
/**
 * Unique webpack rule. We must set customConfig as first paramter before invoke merge.smart
 * @param  {[type]} defaultWebpackConfig [description]
 * @return {[type]}                      [description]
 */
function uniqueRule(defaultWebpackConfig, customConfig) {
  //unique webpack loaders
  if (exist.get(defaultWebpackConfig, "module.rules")) {
    var webpackRules = merge.smart({
      rules: customConfig.module.rules
    }, {
      rules: defaultWebpackConfig.module.rules
    });
    defaultWebpackConfig.module.rules = webpackRules.rules;
  }
}

module.exports = {
  dedupeRule: uniqueRule
};