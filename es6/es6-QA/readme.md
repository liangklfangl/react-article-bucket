#### 1.__esModule是什么?ES6与commonjs规范转化
解答：你需要弄懂下面的概念,即ES6模块规范与commonjs规范的互换
<pre>
export function sum() {} 相当于 exports.sum = function() {}
export default sum 相当于 exports.default = sum
import {sum} from 'math' 相当于 var sum = require('math').sum
import sum from 'sum' 相当于 var sum = require('sum').default
import * as math from 'math' 相当于 var math = require('math')
</pre>
其中你需要仔细理解下面这段代码:
```js
import sum from 'sum' 
//相当于 var sum = require('sum').default
```
因为我们没有采用`import {sum} from 'sum'`,所以表示`sum`模块是以default的方式来导出的。即，sum模块必须有默认的导出值，不管是通过module.export或者export default方式。

讲到这里就讲到[babel-plugin-add-module-exports](https://github.com/59naga/babel-plugin-add-module-exports)，其默认会将export.default的值封装到module.export上。假如ES6代码如下:
```js
// index.js
export default 'foo'
```
经过babel编译会变成:
```js
'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'foo';
```
因此，在nodejs中我们就会有下面的`.default`的代码块:
```js
require('./bundle.js') // { default: 'foo' }
require('./bundle.js').default // 'foo'
```
但是，通过这个插件，我们就可以去掉那些`.default`的调用:
```js
'use strict';
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = 'foo';
module.exports = exports['default'];
```
因此，这也是为什么通过export default导出的模块可以通过require直接引用，而不需要出现`.default`的代码，就是因为有了如下的这一句代码:
```js
exports.default = 'foo';
module.exports = exports['default'];
```
而我们的__esModule为true只是为了标识该模块是ES6模块而已。

所以你可以有时候会看到如下的代码:
```js
  const Comp = (hasParams(dataPath) || pageData) && err !== 404 ?
    Template.default || Template : NotFound.default || NotFound;
```








参考资料：

[ES6 中 import/export 和 require/exports 对比](http://yanxi.me/2016/12/03/es6-import-export/)
