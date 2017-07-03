"use strict";

/**
  * 传入webpack配置，允许用户传入一个函数对webpack配置做最终修改
  * @param  {[type]} webpackConfig [description]
  * @param  {[type]} func          [description]
  * @return {[type]}               [description]
  */
function mangleWebpackConfig(webpackConfig, func) {
  return func(webpackConfig);
}
module.exports = mangleWebpackConfig;