/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(source) {
	var value = typeof source === "string" ? JSON.parse(source) : source;
	value = JSON.stringify(value)
		.replace(/\u2028/g, '\\u2028')
		.replace(/\u2029/g, '\\u2029');
	var module = this.version && this.version >= 2 ? `export default ${value};` : `module.exports = ${value};`;
	return module;
}
