module.exports = function (source) {
  if (this.cacheable) this.cacheable();

  var value = typeof source === "string" ? JSON.parse(source) : source;

  value = JSON.stringify(value)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');

  if (this.version && this.version >= 2) {
    this.emitWarning(`⚠️  JSON Loader\n
It seems you're using webpack >= v2.0.0, which includes native support for JSON.
Please remove this loader from webpack.config.js as it isn't needed anymore and
is deprecated. See the v1.0.0 -> v2.0.0 migration guide for more information
(https://webpack.js.org/guides/migrating/#json-loader-is-not-required-anymore)\n`)
  }

  return `module.exports = ${value}`;
}
