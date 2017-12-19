#### 说明
以下内容全部来自于[async.js](http://caolan.github.io/async/docs.html#series)内容。
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
//eachOfLimit.js
import noop from 'lodash/noop';
import once from './once';
import iterator from './iterator';
import onlyOnce from './onlyOnce';
import breakLoop from './breakLoop';
export default function _eachOfLimit(limit) {
    return function (obj, iteratee, callback) {
        callback = once(callback || noop);
        //0.如果limit指定为负数或者迭代的对象为空，那么直接调用回调即可
        if (limit <= 0 || !obj) {
            return callback(null);
        }
        var nextElem = iterator(obj);
        //1.获取传入的参数的迭代器对象
        var done = false;
        var running = 0;
        //6.如果某一个回调函数执行完成，那么running--，同时继续调用replenish补充
        function iterateeCallback(err, value) {
            running -= 1;
            //6.1 如果已经抛错，那么直接退出调用回调
            if (err) {
                done = true;
                callback(err);
            }else if (value === breakLoop || (done && running <= 0)) {
                done = true;
                return callback(null);
            }else {
                //6.2.如果没有结束那么继续执行replenish方法
                replenish();
            }
        }
        function replenish () {
            //4.如果小于并发的limit数量，那么一直运行，这样首次可以一次性补充到limit个。达到limit后不会继续插入新的任务，直到有任务已经结束
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
#### 4.waterfull vs parallel vs series异步方法详解
##### 4.1 如何将同步函数包装为异步
顾名思义:asyncify就是将我们的常规的函数包装为异步的，接受args+callback的方式，这也是nodejs所有的内部函数的签名。
```js
//initialParams.js
import slice from './slice';
export default function (fn) {
    return function (/*...args, callback*/) {
        var args = slice(arguments);
        var callback = args.pop();
        fn.call(this, args, callback);
    };
}
//asyncify.js
export default function asyncify(func) {
    return initialParams(function (args, callback) {
        var result;
        try {
            result = func.apply(this, args);
            //(2)将asyncify中传入的函数的返回值传递给callback回调函数
        } catch (e) {
            return callback(e);
        }
        // if result is Promise object
        // 1.如果Result是一个Promise对象，那么callback将会在setImmediate中被调用
        // 同时将result的结果传递给回调函数
        if (isObject(result) && typeof result.then === 'function') {
            result.then(function(value) {
                invokeCallback(callback, null, value);
            }, function(err) {
                invokeCallback(callback, err.message ? err : new Error(err));
            });
        } else {
            // 3.将函数本身调用的结果传递给回调函数
            callback(null, result);
        }
    });
}
/**
 * If the function passed to asyncify returns a Promise, that promises's resolved/rejected state will be used to call the callback, rather than simply the synchronous return value.
 * 1.如果传入asyncify函数的返回值为Promise，那么这个Promise的reject/resolve状态会用于判断调用不同的回调。如果resolve那么那么直接调用回调。如果reject了，那么
 * 那么在下一次循环中rethrow
 */
function invokeCallback(callback, error, value) {
    try {
        callback(error, value);
    } catch (e) {
        // 2.在下一次Event Loop的时候执行，抛出错误
        // https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/node-QA.md#5nodejs中的事件循环与异步非阻塞io
        setImmediate(rethrow, e);
    }
}
function rethrow(error) {
    throw error;
}
```
下面是asycify的具体的代码:
```js
//asyncify的返回值就是initialParams的返回值，接受(...args,callback)为参数
async.asyncify(function (contents) {
    return db.model.create(contents);
})
```
这个asyncify函数接受一个**同步函数，将它转化为异步的，同时将async.asyncify包裹的函数的返回值传递给回调函数callback**。这个方法常用于:waterfall/series或者其他异步的函数。为async.asyncify返回的函数传递的任何参数会被传递给包裹的函数，但是不包括最后一个回调函数(initialParams中的args.pop调用后args已经改变了)。如果有错误抛出，那么也会被传入到callback回调。

如果传入async.asyncify函数的返回值是Promise，那么这个Promise的resolve,reject状态会被传入到回调callabck中。这也就是说你可以为async.asyncify传入async函数!

##### 4.2 asyncify用于waterfull
下面是waterfall给出的完整的代码:
```js
export default  function(tasks, callback) {
    callback = once(callback || noop);
    if (!isArray(tasks)) return callback(new Error('First argument to waterfall must be an array of functions'));
    if (!tasks.length) return callback();
    var taskIndex = 0;
    function nextTask(args) {
        var task = wrapAsync(tasks[taskIndex++]);
        //1.首先将我们的task调用asyncify，asyncify后的函数接受(...args, callback)
        args.push(onlyOnce(next));
        //2.onlyOnce方法返回一个函数，这个函数只能被调用一次。这个函数会被放到本次nextTask的最后一个元素作为回调函数。即所有的回调函数签名都是一致的
        task.apply(null, args);
        //3.第一个回调函数被传入的只有callback,而第二个
    }
    /**
     *4.这个next方法就是asyncify处理传入的回调函数，该回调函数的第一个参数是error,可以参见asyncify的代码
     *5.slice(arguments, 1)就是将上一个回调函数的执行结果传递给下一个函数,因为asyncify后的函数接受的回调函数签名为(...args,callback)
     */
    function next(err/*, ...args*/) {
        if (err || taskIndex === tasks.length) {
            return callback.apply(null, arguments);
        }
        nextTask(slice(arguments, 1));
        // (slice(arguments, 1)为当前函数真实调用后的结果，并将这个结果返回给下一个函数
    }
    nextTask([]);
}
```
其中为每一个tasks中的函数都进行了asyncify处理，使得这个函数的签名为(...args,callback)。同时，因为asyncify处理的时候，**会将包裹的函数的真实调用结果传递给callback回调，同时第一个参数为error**。

下面是waterfall具体的调用代码实例:
```js
async.waterfall([
     // 1.第一个函数只有callback被传入
    //2.将slice(arguments, 1)的结果继续传入下一个函数
    function(callback) {
        callback(null, 'one', 'two');
    },
    //3.将slice(arguments, 1)的结果继续传入下一个函数
    function(arg1, arg2, callback) {
        // arg1 now equals 'one' and arg2 now equals 'two'
        callback(null, 'three');
    },
    //4.将slice(arguments, 1)的结果继续传入下一个函数,所以按理说下一个函数接受一个参数为"done"
    //5.下一次循环的时候taskIndex === tasks.length为true,所以直接调用
    //callback.apply(null, arguments);所以err为null，同时result为"done"
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
 ], function (err, result) {
    // result now equals 'done'
});
```
你也可以使用下面的方式来调用:
```js
// Or, with named functions:
async.waterfall([
    myFirstFunction,
    mySecondFunction,
    myLastFunction,
], function (err, result) {
    // result now equals 'done'
});
function myFirstFunction(callback) {
    callback(null, 'one', 'two');
}
function mySecondFunction(arg1, arg2, callback) {
    // arg1 now equals 'one' and arg2 now equals 'two'
    callback(null, 'three');
}
function myLastFunction(arg1, callback) {
    // arg1 now equals 'three'
    callback(null, 'done');
}
```
waterfull方法**顾名思义**:就是在Collection中的前一个asyncify的函数执行完毕后，再将结果传递给下一个asyncify的函数，当所有的函数都执行完毕后，调用我们的callback回调。

##### 4.3 asyncify用于parallel方法
上面的"如何控制并发的数量"部分已经说过如何控制并发遍历(eachOfLimt.js)。下面我们再讲一个用于不对并发量进行限制的方法(eachOf.js)。该方法可以用于对象和数组:
```js
// eachOf.js
function eachOfArrayLike(coll, iteratee, callback) {
    callback = once(callback || noop);
    var index = 0,
        completed = 0,
        length = coll.length;
    if (length === 0) {
        callback(null);
    }
    function iteratorCallback(err, value) {
        if (err) {
            callback(err);
        } else if ((++completed === length) || value === breakLoop) {
            callback(null);
        }
    }
    // 2.iteratee是已经被asyncify了，那么它接受(...args,callback)，传入的参数为(value,key,callback),其中callback会接受到该函数的真实的执行结果
    for (; index < length; index++) {
        iteratee(coll[index], index, onlyOnce(iteratorCallback));
    }
}
var eachOfGeneric = doLimit(doLimit, Infinity);
// 1.通过为我们的doLimit.js第二个控制并发量的参数设置为Infinity即可
export default function(coll, iteratee, callback) {
    var eachOfImplementation = isArrayLike(coll) ? eachOfArrayLike : eachOfGeneric;
    eachOfImplementation(coll, wrapAsync(iteratee), callback);
}
```
上面的eachOf方法我们可以知道，每一个回调中并没有在callback中传入value，只是循环调用集合中的方法而已。下面是parallel的代码：
```js
export default function _parallel(eachfn, tasks, callback) {
    callback = callback || noop;
    var results = isArrayLike(tasks) ? [] : {};
    eachfn(tasks, function (task, key, callback) {
        //1.asyncify后的task函数接受一个回调函数，其接受的参数为(...args,callback)
        wrapAsync(task)(function (err, result) {
            // 2.这里的result是每一次执行函数后传入的结果
            if (arguments.length > 2) {
                result = slice(arguments, 1);
            }
            //3.这里的key是one或者two
            results[key] = result;
            callback(err);
        });
    }, function (err) {
        // 5.虽然eachOf.js没有保存每一次调用集合中函数的返回值，但是parallel函数保存了
        callback(err, results);
    });
}
```
该方法的真实用法如下:
```js
async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
function(err, results) {
//所有集合中元素的调用接口都会传递给parallel的回调函数， callback(err, results);
});
```
注意：我们parallel回调函数的值也是**按顺序**的，即第一个回调函数的值....。parallel和waterfull的**区别**在于:parallel不会控制并发量，而waterfall必须等前一个函数执行结束后才会执行下一个方法，同时也会将前一个方法的值传递给后一个方法。而parallel因为是并发执行的，所以只能获取到最终的结果而不能获取到前一个函数的执行结果。

##### 4.3 asyncify用于series
```js
// series.js
export default function series(tasks, callback) {
    parallel(eachOfSeries, tasks, callback);
}
```
我们看看eachOfSeries.js方法的代码:
```js
//eachOfSeries.js
export default doLimit(eachOfLimit, 1);
```
也就是series通过eachOfLimit.js将并发量控制为1。同时从series.js可以看到，它也使用了上面的parallel.js，所以它的返回值只可能是和parallel一样的类型，即**results[key] = result;**类型。也就是说，虽然series方法可以保证**代码按顺序执行，即前一个函数执行完毕才执行后面的函数(和parallel的主要区别)**，但是只有在回调函数中可以获取到所有函数的结果，而不能获取前一个函数的调用结果。下面是具体的例子:
```js
async.series([
     function(callback) {
        // do some stuff ...
         callback(null, 'one');
     },
     function(callback) {
         // do some more stuff ...
         callback(null, 'two');
     }
 ],
 // optional callback
 function(err, results) {
     // results is now equal to ['one', 'two']
 });
```
或者可以采用下面的方式:
```js
async.series({
    one: function(callback) {
        setTimeout(function() {
            callback(null, 1);
        }, 200);
    },
    two: function(callback){
        setTimeout(function() {
          callback(null, 2);
        }, 100);
    }
}, function(err, results) {
    // results is now equal to: {one: 1, two: 2}
});
```

#### 5.waterfull vs parallel vs series方法总结
从上面的分析我们知道，控制并发量其实就是控制了**同一个时间最多执行的函数个数**，其主要是通过eachOfLimit.js实现的。
