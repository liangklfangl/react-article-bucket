#### 前言
下面是shell开发中遇到的常见问题，如果喜欢欢迎star！

#### 1.传入babel的不是tostring后的内容
```js
const readFile = function(fileName) {
  return new Promise(function(resolve, reject) {
    fs.readFile(fileName, function(error, data) {
      if (error) reject(error);
      resolve(data);
    });
  });
};
// 上面是Util.readFile方法
async function gen() {
  for (let t = 0, len = files.length; t < len; t++) {
    const fileContent = await Util.readFile(files[t]);
    // 1.此时不能是files[t]而必须是files[t].toString()
    const cnptName = ExtractExportedCnpt(fileContent.toString());
    // 2.上面是对文件内容进行处理
    // 注意:上面不要写成await ExtractExportedCnpt(Util.readFile(files[t]))
    // 因为异步的方法是Util.readFile
  }
}
```
报错如下:
```js
(node:45841) UnhandledPromiseRejectionWarning: TypeError: this.input.charCodeAt is not a function
    at Parser.skipSpace (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/node_modules/_babylon@6.18.0@babylon/lib/index.js:839:27)
    at Parser.nextToken (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/node_modules/_babylon@6.18.0@babylon/lib/index.js:755:56)
    at Parser.parse (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/node_modules/_babylon@6.18.0@babylon/lib/index.js:1673:10)
    at Object.parse (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/node_modules/_babylon@6.18.0@babylon/lib/index.js:7306:37)
    at parser (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/utils/extract_exported_cnpt.js:5:18)
    at transformer (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/utils/extract_exported_cnpt.js:30:20)
    at gen (/Users/qinliang.ql/Desktop/sy-dir-extract-cnpts-generator/bin/extract.js:44:22)
    at <anonymous>
```
