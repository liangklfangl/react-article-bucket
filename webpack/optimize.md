#### 1.如何按需导入文件减小bundle.js大小
下面是ladash中对外导出的对象:
```js
   lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
```
这是为什么我们可以通过如下方式引入方法的原因:
```js
import { concat, sortBy, map, sample } from 'lodash';
//lodash其实是一个对象
```
但是还有一种常见的方法就是只引入我们需要的函数，如下:
```js
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import sample from 'lodash/sample';
```
之所以可以通过__相对路径__的方法引用是因为在lodash的npm包中，我们每一个方法都对应于一个独立的文件，并导出了我们的方法，如下面就是sortBy.js方法的源码:
```js
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});
module.exports = sortBy;
```
注意一点就是:通过后者来导入我们需要的文件比前者全部导入的文件要小的多。上面我已经说了原因，即后者将每一个方法都存放在一个独立的文件中，从而可以按需导入，所以文件也就比较小了。具体你可以[查看这里](https://lacke.mn/reduce-your-bundle-js-file-size/)来学习如何减少bundle.js的大小。当然，如果你使用了webpack3的tree-shaking，那么就不需要考虑这个情况了。tree-shaking会让没用的代码在打包的时候直接被剔除。








[Reduce Your bundle.js File Size By Doing This One Thing](https://lacke.mn/reduce-your-bundle-js-file-size/)

[lodash源码](https://github.com/lodash/lodash/blob/4.10.0/lodash.js)

[REACT.JS 最佳实践(2016)
](http://www.devstore.cn/essay/essayInfo/7663.html)
