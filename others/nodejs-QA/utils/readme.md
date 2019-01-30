#### 主要内容
在本章节，主要是一些Nodejs工具函数。如果你有任何问题欢迎issue,同时也欢迎star！

#### 1.nodejs的打印深层次对象
当然可以使用如下方式:
```js
const util = require('util');
util.inspect(object,{showHidden:true,depth:4});
```
但是更好的方法请参考[这个方法](./source/index.js)。如下使用即可:
```js
console.log(require("./source/index.js").dump(args));
// 这个args可以深层次嵌套的对象
```
