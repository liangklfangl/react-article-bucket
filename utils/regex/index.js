/**
 * 所有regex测试平台:https://regex101.com/
 */
export const multilineComment = /\/\*([\S\s]*?)\*\//g;
// 多行注释，参考:https://github.com/sindresorhus/comment-regex/blob/master/index.js
export const blankLine = /\n(\n)*( )*(\n)*\n/g;
// 命中空行
export const decodePercent = /%["'](\S*?)%["']/g;
// /%["'](\S*?)%["']/g
// 命中 "{%"normal%":%"正常%",%"limited%":%"分级%"}"字符串所有的%替换为\\
// 参见./mock/percent.js
export const jsxFuncRegex  =  /(([^{}]*)return[\s]*)(<([a-z]+)([^<]+)?>[\s\S]*?<\/\4>)([\s\S])*?(?=})/g;
// 如果一个函数返回了jsx，那么将这个函数的函数体匹配出来
// 参考./mock/jsxRegex.js