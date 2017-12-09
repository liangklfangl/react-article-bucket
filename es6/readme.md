#### 简要说明
这个文章我主要会写一些ES6开发中的常用技巧，通过这些技巧不仅能够提升代码的优雅度，同时对于ES6本身的学习也是很好的参考资料。

#### 问题1：ES6中某一个对象的key是变量，而不是字符串?

```js
 const key = 'authorName';
 const value = 'liangklfangl';
 this.props.onChange({
     [`${name}`] : `value`
    })
```
此种用法你可以参考[我的$autoArray方法](../antd/readme.md)

#### 问题2:在Generator函数中断

如果在Generator函数中调用了history.push进行跳转，那么就会直接中断Generator的执行，所以会抛出下面的错误:
<pre>
Generator is already running
</pre>

可以通过如下的方式进行解决:
```js
if (action.history) {
    setTimeout(() => {
      action.history.push({
        pathname: "/pageView/tsklist"
      });
    }, 0);
  }
```

### 问题3:Generator代码执行顺序
#### 3.1 Generator函数编译源码_context.next控制下次循环
比如下面的Generator函数:
```js
function* g() {
    yield 'a';
    yield 'b';
    yield 'c';
    return 'ending';
}
const iterator = g();
```
编译后的结果为:
```js
'use strict';
var _marked = /*#__PURE__*/regeneratorRuntime.mark(g);
function g() {
    return regeneratorRuntime.wrap(function g$(_context) {
        // (1)while(true)循环
        while (1) {
            //(2)重置_context.prev表示上一次循环的值
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    // (3)表示下一次循环为2，即_context.prev为2
                    return 'a';
                case 2:
                    _context.next = 4;
                    //(4)下一次循环4
                    return 'b';
                case 4:
                // (5)下一次循环6
                    _context.next = 6;
                    return 'c';
                case 6:
                //(6)直接执行return语句，同时结束
                    return _context.abrupt('return', 'ending');
                case 7:
                case 'end':
                //(7)7或者'end'的时候context正常结束
                    return _context.stop();
            }
        }
    }, _marked, this);
}
var iterator = g();
```
其实我想分析下当`存在if判断`时候的Generator函数打包情况。比如下面的源码:
```js
function* g() {
    yield 'a';
    if(true){
      console.log('true循环');
    }
    yield 'b';
    yield 'c';
    return 'ending';
}
const iterator = g();
```
打包后将得到如下代码:
```js
'use strict';
var _marked = /*#__PURE__*/regeneratorRuntime.mark(g);
function g() {
    return regeneratorRuntime.wrap(function g$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 'a';
                case 2:
                // (1)if判断将会被打包到这里，作为case 2分支的内容
                    if (true) {
                        console.log('true循环');
                    }
                    _context.next = 5;
                    return 'b';
                case 5:
                    _context.next = 7;
                    return 'c';
                case 7:
                    return _context.abrupt('return', 'ending');
                case 8:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}
var iterator = g();
```
也就是说，我们在`真正执行第二次next`的时候才会输出console的信息(通过_context.next来控制新的case分支的执行)!这对于理解yield的执行顺序是很有益处的!特别是如下经常遇到的代码:
```js
 try {
    const repos = yield call(fetchGet, requestURL, queryData);
    if (repos.success == true) {
        // (1)后面的yield必须等到前面的第一次fetchGet执行完毕
      if (action.data.projectDetail) {
        yield put(
          saveRes4Project(action.id, repos.data, action.data.projectDetail)
        );
      } else {
        yield put(saveRes4Project(action.id, repos.data));
      }
      // (2)必须是异步的才能不打断Generator函数执行
      if (action.history) {
        setTimeout(() => {
          action.history.push({
            pathname: "/pageView/tsklist"
          });
        }, 0);
      }
    } else {
      Modal.error({
        title: "获取详情失败",
        content: repos.message
      });
    }
  } catch (err) {
    Modal.error({
      title: "获取详情失败",
      content: "进入trycatch"
    });
  }
```
上面这种例子的精简版如下:
```js
function* g() {
    yield 'a';
    //通过if判断决定是否yield
    if(!this.stop){
       yield 'b';
      console.log('true循环');
    }
    yield 'c';
    return 'ending';
}
const iterator = g();
```
也就是通过`if判断`来决定是否yield一个新的操作。打包后的完整逻辑如下(经过[regeneratorRuntime.mark](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js#L132)处理):
```js
'use strict';
var _marked = /*#__PURE__*/regeneratorRuntime.mark(g);
// 此时_marked将会有next,return,throw,toString等方法
function g() {
    return regeneratorRuntime.wrap(function g$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 'a';
                //(1)这里的if判断转化为case判断来执行 
                case 2:
                    if (this.stop) {
                        _context.next = 6;
                        break;
                    }
                    _context.next = 5;
                    return 'b';
                case 5:
                    // (4)一定要注意这里我们的console.log单独走了一个case。下次将会执行case 6的分支
                    console.log('true循环');
                case 6:
                    _context.next = 8;
                    // (2)表示下一步执行case 8的操作
                    return 'c';
                    //(3)这一步执行的操作
                case 8:
                    return _context.abrupt('return', 'ending');
                case 9:
                case 'end':
                    return _context.stop();
            }
        }
    }, _marked, this);
}
var iterator = g();
```
即，通过if来控制是否yield一个操作最后会转化为通过_context.next来控制执行哪一个具体的case分支!

#### 3.2 Generator函数与try...catch
try..catch与Generator在一起，对于理解yield的异常情况非常有帮助。比如，我们有如下的代码:
```js
function *foo() {
    try {
      yield 2;
      //注意:yield后代码一直在这个case，除非你手动调用了next方法走下一个case
    }catch (err) {
        console.log( "foo caught: " + err );
    }
    yield; // pause
    // now, throw another error
    throw "Oops!";
}
function *bar() {
    yield 1;
    try {
        yield *foo();
    }
    catch (err) {
        console.log( "bar caught: " + err );
    }
}
var it = bar();
```
此时编译后的代码如下:
```js
"use strict";
var _marked = /*#__PURE__*/regeneratorRuntime.mark(foo),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(bar);
function foo() {
    return regeneratorRuntime.wrap(function foo$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                 //(1) yield 2通过try..catch包裹
                case 0:
                    _context.prev = 0;
                    _context.next = 3;
                    return 2;
                //(2)即使yield前面没有变量获取返回的值，此时Generator函数也会停止，走一个全新的case
                case 3:
                    _context.next = 8;
                    break;
                //注意:被try..catch包裹的代码会在这里捕获到，捕获的方式是通过_context["catch"]即外层Generator的
                //catch捕获到，如果_context["catch"](0)不存在就会继续冒泡到外层组件。如果一切正常直接通过case 8,
                //否则通过case 5的try...catch抓取
                case 5:
                    _context.prev = 5;
                    _context.t0 = _context["catch"](0);
                    console.log("foo caught: " + _context.t0);
                //(3)单独的空的yield也走一个独立的case分支
                case 8:
                    _context.next = 10;
                    return;
                //(4)单独的空yield被执行完毕后遇到的throw方法单独也会走一个case
                case 10:
                    throw "Oops!";
                case 11:
                //(5)执行_context.stop()后Generator函数执行完毕
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this, [[0, 5]]);
}
function bar() {
    return regeneratorRuntime.wrap(function bar$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                //(1)第一步yield 1，同时指定下一次循环的_context2.next为2
                case 0:
                    _context2.next = 2;
                    return 1;
               //(2)第二步yield*，传入_context2.delegateYield的_context2.prev = 2。下一次循环的走case 4的逻辑
                case 2:
                    _context2.prev = 2;
                    return _context2.delegateYield(foo(), "t0", 4);
                case 4:
                // (3)如果一切正常，那么直接通过_context2.next = 9退出循环
                    _context2.next = 9;
                    break;
                // (4)如果一切不正常，那么直接通过_context2["catch"](2)抓取该throw
                case 6:
                    _context2.prev = 6;
                    _context2.t1 = _context2["catch"](2);
                    console.log("bar caught: " + _context2.t1);
                case 9:
                case "end":
                    return _context2.stop();
            }
        }
    }, _marked2, this, [[2, 6]]);
}
var it = bar();
```
这个例子，你必须明白:
<pre>
1.yield的结果没有通过变量来保存也会消耗一次next调用。这是由上面的 \_context.next来控制的！所以必须通过next调用走下一个case,因此上面的foo()方法中的throw可以被抓取到
2.对于try..catch包裹的代码块，如果没有throw那么会走独立的case退出，而异常情况会通过_context2["catch"]捕获
3.yield\*的情况，如果内层Generator没有捕获，那么会冒泡到外层Generator。比如foo方法中的throw "Oops!"也会被外层Generator抓取到!
</pre>

上面讲了没有变量保存yield结果的情况，那么对于`有yield保存变量的情况`如下:
```js
function *foo() {
    var z = yield 3;
    var w = yield 4;
    console.log( "z: " + z + ", w: " + w );
}
function *bar() {
    var x = yield 1;
    var y = yield 2;
    yield *foo(); // `yield*` delegates iteration control to `foo()`
    var v = yield 5;
    console.log( "x: " + x + ", y: " + y + ", v: " + v );
}
var it = bar();
it.next();      // { value:1, done:false }
it.next( "X" ); // { value:2, done:false }
it.next( "Y" ); // { value:3, done:false }
it.next( "Z" ); // { value:4, done:false }
it.next( "W" ); // { value:5, done:false }
// z: Z, w: W
it.next( "V" ); // { value:undefined, done:true }
// x: X, y: Y, v: V
```
此时打包后的结果为:
```js
"use strict";
var _marked = /*#__PURE__*/regeneratorRuntime.mark(foo),
    _marked2 = /*#__PURE__*/regeneratorRuntime.mark(bar);
function foo() {
    var z, w;
    // (4)此时z,w为局部变量，bar()中无法正常获取，分别为z: Z, w: W
    return regeneratorRuntime.wrap(function foo$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return 3;
                case 2:
                    z = _context.sent;
                    _context.next = 5;
                    return 4;
                case 5:
                    w = _context.sent;
                    console.log("z: " + z + ", w: " + w);
                case 7:
                case "end":
                    return _context.stop();
            }
        }
    }, _marked, this);
}
function bar() {
    var x, y, v;
    return regeneratorRuntime.wrap(function bar$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                //(1)第一次为undefined
                case 0:
                    _context2.next = 2;
                    return 1;
                //(2)第二次传入了X，那么 _context2.sent为X
                case 2:
                    x = _context2.sent;
                    _context2.next = 5;
                    return 2;
                //(3)第三次传入了Y，那么_context2.sent为Y
                case 5:
                    y = _context2.sent;
                    return _context2.delegateYield(foo(), "t0", 7);
                case 7:
                    _context2.next = 9;
                    return 5;
                //（5）最后传入V，那么 _context2.sent为V
                case 9:
                    v = _context2.sent;
                    console.log("x: " + x + ", y: " + y + ", v: " + v);
                case 11:
                case "end":
                    return _context2.stop();
            }
        }
    }, _marked2, this);
}

var it = bar();
it.next(); // { value:1, done:false }
it.next("X"); // { value:2, done:false }
it.next("Y"); // { value:3, done:false }
it.next("Z"); // { value:4, done:false }
it.next("W"); // { value:5, done:false }
// z: Z, w: W
it.next("V"); // { value:undefined, done:true }
// x: X, y: Y, v: V
```
你应该要了解:
<pre>
 1.yield\*通过return可以将子Generator的值返回给父级Generator
 2.子级Generator唯一将数据返回给父级Generator的方法就是通过return，而其内部的变量依然是局部变量   
</pre>

#### 3.4 co如何处理自动执行Generator的异常(reject掉)
下面是具体的co自动执行Generator的代码:
```js
function co(gen) {
  var ctx = this;
  var args = slice.call(arguments, 1);
  // we wrap everything in a promise to avoid promise chaining,
  // which leads to memory leak errors.
  // see https://github.com/tj/co/issues/180
  return new Promise(function(resolve, reject) {
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    if (!gen || typeof gen.next !== 'function') return resolve(gen);
    onFulfilled();
    //(1)成功回调,在回调中co会自动抓住每一个执行的yield的异常,然后reject掉
    function onFulfilled(res) {
      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }
      next(ret);
      return null;
    }
    //(2)value.then(onFulfilled, onRejected)如某一个yield已经异常，那么co会自动reject
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      // (4)将reject后的错误对象传递给我们的next方法，也就是传递给下一个Generator函数
      next(ret);
    }
    function next(ret) {
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);
      //(3)这里的每一个Promise都会获取到onFulfilled和onRejected两个回调函数
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}
```
下面是`co`自动处理error的情况:
```js
require("babel-polyfill");
import co from "co";
co(function* () {
  var result = yield Promise.resolve(true);
  var reject = yield Promise.reject("reject掉了");
  // (2)这里reject后,在catch中也能抓取到!
  throw new Error('Error报错了');
  //(1)这个错误我自己没有处理，所以在catch中也能够被抓取到!
  return result;
}).then(function (value) {
  console.log("正常了",value);
}, function (err) {
// (3)打印错误信息为"报错了 reject掉了"是一个string，而不是数组!
  // log any uncaught errors
  // (1)打印所有的未处理的异常，比如发送一个ajax请求后报错了
  // HANDLE ALL YOUR ERRORS!!!
  console.error("报错了",err);
});
```
总之，对于co执行Generator函数来说，在co方法内部将未知异常转化为了reject，从而在catch方法中能够正常获取到报错信息(报错信息是一个数组)。但是，我们要注意，如果`前一个yield`已经抛出异常导致reject掉了，那么后面的`代码压根不会执行`。上面的所有Generator相关的内容，我只为了告诉你:
```js
task(function *() {
  let artist = yield Artist.findByID(1);
  let songs = yield artist.getSongs();
  console.log(artist, songs);
});
```
对于这一类的代码，如果前面一个yield执行错误，那么后面的yield根本不会执行了!这和以前遇到的回调地狱代码的执行逻辑完全一致!

#### 问题4:在ES6的if..else定义同名变量的问题
比如下面的代码:
```js
const condition = false;
console.log('我的名字为:',myName);
if(condition){
  const myName = "罄天";
}else{
  const myName = "覃亮";
}
```
其实我们这里定义了两个同名变量`myName`,为什么babel打包的时候没有报错呢?不是说一个作用域里面不能有定义的两个相同的const命名变量吗？难道在ES6中if..else创建了独立的作用域？其实不是的!我们看看下面打包后的代码:
```js
"use strict";
var condition = false;
console.log('我的名字为:', myName);
if (condition) {
  var _myName = "罄天";
} else {
  var _myName2 = "覃亮";
}
```
我们看到const`没有变量类型声明提升`，所以第一个输出变量依然是myName。但是在if..else里面的同名变量被打包成为了不同的变量，所以运行打包后的代码将会报错。
<pre>
Uncaught ReferenceError: myName is not defined
</pre>

参考资料:

[【转向Javascript系列】深入理解Generators](http://www.alloyteam.com/2016/02/generators-in-depth/)

[regeneratorRuntime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)

[Diving Deeper With ES6 Generators](https://davidwalsh.name/es6-generators-dive)

[A Practical Introduction to ES6 Generator Functions](https://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html)
