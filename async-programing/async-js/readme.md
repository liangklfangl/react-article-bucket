#### 1.如何保证函数只会被执行一次
```js
function once(fn) {
    return function () {
        if (fn === null) return;
        // 第二次进来的时候直接return，后面的代码不会执行
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
```
而下面的onlyOnce在被第二次调用的时候直接抛出错误:
```js
export default function onlyOnce(fn) {
    return function() {
        if (fn === null) throw new Error("Callback was already called.");
        var callFn = fn;
        fn = null;
        callFn.apply(this, arguments);
    };
}
```
#### 2.如何创建一个迭代器对象
```js
//getIterator.js
var iteratorSymbol = typeof Symbol === 'function' && Symbol.iterator;
export default function (coll) {
    return iteratorSymbol && coll[iteratorSymbol] && coll[iteratorSymbol]();
}
//下面是具体的代码
import isArrayLike from 'lodash/isArrayLike';
import getIterator from './getIterator';
import keys from 'lodash/keys';
function createArrayIterator(coll) {
    var i = -1;
    var len = coll.length;
    return function next() {
        return ++i < len ? {value: coll[i], key: i} : null;
    }
}
// 这里类似于Generator的迭代器，其key是通过循环下标来得到的
function createES2015Iterator(iterator) {
    var i = -1;
    return function next() {
        var item = iterator.next();
        if (item.done)
            return null;
        i++;
        return {value: item.value, key: i};
    }
}
//object是没有默认的迭代器行为的，他的key就是通过Object.keys来获取
function createObjectIterator(obj) {
    var okeys = keys(obj);
    var i = -1;
    var len = okeys.length;
    return function next() {
        var key = okeys[++i];
        return i < len ? {value: obj[key], key: key} : null;
    };
}
export default function iterator(coll) {
    // 数组的迭代器
    if (isArrayLike(coll)) {
        return createArrayIterator(coll);
    }
    var iterator = getIterator(coll);
    return iterator ? createES2015Iterator(iterator) : createObjectIterator(coll);
}
```
#### 3.如何控制并发的数量
```js
import noop from 'lodash/noop';
import once from './once';
import iterator from './iterator';
import onlyOnce from './onlyOnce';
import breakLoop from './breakLoop';
export default function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        //1.获取传入的参数的迭代器对象
        var done = false;
        var running = 0;
        function iterateeCallback(err, value) {
            running -= 1;
            if (err) {
                done = true;
                callback(err);
            }
            else if (value === breakLoop || (done && running <= 0)) {
                done = true;
                return callback(null);
            }
            else {
                //5.如果没有结束那么继续执行replenish方法
                replenish();
            }
        }
        function replenish () {
            //4.如果小于并发的limit数量，同时程序没有结束，那么一直运行。否则不会继续插入新的任务并迭代
            while (running < limit && !done) {
                var elem = nextElem();
                // 2.相当于直接调用next方法，但是只有在没有运行的代码的时候才会调用callback
                if (elem === null) {
                    done = true;
                    if (running <= 0) {
                        callback(null);
                    }
                    return;
                }
                running += 1;
                //3.传入的方法为value,key和回调函数
                iteratee(elem.value, elem.key, onlyOnce(iterateeCallback));
            }
        }
        //4.继续执行代码
        replenish();
    };
}
```
