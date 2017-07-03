const path = require("path");
const MT = require('mark-twain');
const fs = require('fs');
// const jsonML = MT(fs.readFileSync('code.md').toString());

function stringify(node, depth = 0) {
  const indent = '  '.repeat(depth);
  if (Array.isArray(node)) {
    return `[\n` +
      node.map(item => `${indent}  ${stringify(item, depth + 1)}`).join(',\n') +
      `\n${indent}]`;
  }
  if (
    typeof node === 'object' &&
      node !== null &&
      !(node instanceof Date)
  ) {
    // if (node.__BISHENG_EMBEDED_CODE) {
    //   return node.code;
    // }
    return `{\n` +
      Object.keys(node).map((key) => {
        const value = node[key];
        return `${indent}  "${key}": ${stringify(value, depth + 1)}`;
      }).join(',\n') +
      `\n${indent}}`;
  }
  return JSON.stringify(node, null, 2);
}

//source is content of markdown file
module.exports = function(source) {
	if(this.cacheable){
		this.cacheable();
	}
  const processMarkdown = MT(source);
  return `module.exports = ${stringify(processMarkdown)}`;
};
