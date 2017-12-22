#### 简要说明
这个文章我主要会写一些ES6开发中的常用技巧，通过这些技巧不仅能够提升代码的优雅度，同时对于ES6本身的学习也是很好的参考资料。

#### 问题0:判断数组中某一个元素是否存在的优雅写法
```js
function remove(array, item) {  
  var index = array.indexOf(item);  
  return !!~index && !!array.splice(index, 1);  
}  
```
即!!~index表示在数组中存在!
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
也就是说，我们在`真正执行第二次next`的时候才会输出console的信息，也就是此时`才开始`从上一次的yield继续往下执行if语句(通过_context.next来控制新的case分支的执行)!这对于理解yield的执行顺序是很有益处的!特别是如下经常遇到的代码:
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
即，通过if来控制是否yield一个操作最后会转化为通过_context.next来控制执行哪一个具体的case分支!而真正if..else的作用只是控制`_context.next`来执行下面哪一个case而已，即`控制_context.next`的值!

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

#### 3.3 Generator函数体内外数据交换
假如有如下的例子:
```js
function* gen(x){
  var y = yield x + 2;
  console.log('y=',y);
  // 打印undefined
  var z =  yield y+3;
  return y;
}
var g = gen(1);
g.next();
//{value: 3, done: false}
g.next()
//{value: NaN, done: false}
//此时调用next没有参数值，表示上一次的yield没有值返回，所以是undefined
```
也就是告诉我们:如果需要将上一次yield的值传递给下一次yield使用，那么`必须通过`为next传入参数来完成，否则就会出现上面的第一个yield其实没有返回任何值，所以value为undefined的情况。而下面的例子就会输入:
```js
function* gen(x){
  var y = yield x + 2;
  console.log('y=',y);
  //4
  var z =  yield y+3;
  return z;
}
var g = gen(1);
g.next()
// {value: 3, done: false}
g.next(4);
// {value: 7, done: false}
// 表示上一次yield执行后的返回值为4
g.next();
// {value: undefined, done: true}
// 因为直接设置第二个yield返回值为undefined，所以得到则值就是undefined
```
而下面的值就是正常的:
```js
function* gen(x){
  var y = yield x + 2;
  console.log('y=',y);
  //2
  var z =  yield y+3;
  return z;
}
var g = gen(1);
g.next()
// {value: 3, done: false}
g.next(2);
//表示上一次yield返回值为2
// {value: 5, done: false}
g.next(6);
// {value: 6, done: true}
// next(6)表示第二个yield直接返回值为6，所以return的z值就是6
```
通过上面的例子我们知道，如果需要将`上`一次yield的执行结果返回给`下一个`yield使用，那就必须使用next方法传入才可以!那么这个`特性`有什么用呢？其实从上面的例子中我们看到，通过next将上一次的yield执行结果传入下一个yield，这个结果其实是保存在`局部变量`里面的。回到下面的代码:
```js
try {
    const repos = yield call(fetchGet, requestURL, queryData);
  } catch (err) {
    Modal.error({
      title: "获取详情失败",
      content: "进入trycatch"
    });
  }
```
其实就是把yield后的调用结果`保存到repos`里面，从而让后面的代码能够使用它!
```js
function* gen(x){
  var y = yield x + 2;
  var z =  yield y+3;
  return z;
}
var g = gen(1);
```
正是因为如此，上面的第二个yield才能使用第一个yield的返回值y，而这个y的实际结果就是由next传入的参数决定的!而这个过程如果使用了co，那么`它都帮我们处理`了!

#### 3.4 Generator真的解决了回调地狱吗
我们可能在Generator函数中写出如下的代码:
```js
function* generator(){
    try {
    const repos = yield call(fetchGet, requestURL, queryData);
    if (repos.success == true) {
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
      title: "获取详情出错",
      content: "进入trycatch"
    });
  }
}
```
与此同时我们可能纠结于代码的执行顺序，即是否yield执行完毕后才能执行下面的代码，因为后面的代码会依赖于该yield的返回值repos。问出这样的问题，说明你在思考，而问题的答案其实我在前面已经说过了，即看编译后的代码。每一次case的执行都是要通过调用一次next从而让`_context.next`的值发生变化。否则后面的代码不会执行，所以答案是:"YES"!而如果是从[Web API](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/browser-QA.md#71-web-api以及相关概念)的角度来分析，按道理来说，yield代码表示启动一个浏览器线程用于完成ajax请求，而后面的代码会立即执行(因为Web API是异步的)。那么结果是不是这样的呢？答案是:NO!
```js
import  "babel-polyfill";
var co = require('co');
function* generator(){
  var result = yield new Promise(function(resolve,reject){
    setTimeout(function(){
      console.log('resolve的值为');
      resolve(`返回值`);
    },Math.round(2000));
  })
  console.log('result==='+result);
}
co(generator);
```
上面代码的简洁版本如上，那么按照你的理解是先打印:"result===返回值"然后才打印"resolve的值为"，但是实际上并不是这样!结果是先打印"resolve的值为"然后打印:"resolve的值为"。这得利于`Generator的流程控制`，即它将保证yield执行后才能执行后续的代码。这其实很好理解，Generator作为`流程控制工具`能够摆脱回调地狱，因此它必须保证前面一个请求成功了才能发起后面的请求。这也是回调地狱出现想要解决的问题!

那么按照`Web API`的观点如何理解呢？其实yield一个请求是将该Web API放到事件循环中，而当该请求成功后(Promise被resolve)`回调函数`将会通过事件循环进入调用栈中执行。因为Generator本身流程控制的功能，导致yield后的代码无法正常执行，必须等到事件循环将回调函数在调用栈中执行完毕以后才继续执行后面的代码。也就是说，虽然yield被放入事件队列中执行，但是后续的代码也不能立即执行，必须等到它执行完毕后才行，即它是`阻塞`的。通过这种方式解决了回调地狱的问题(代码不需要无限嵌套)，使得代码本身更加优雅。而回调地狱本身也是`阻塞`的，即必须等待前面一个请求成功后才能触发后面的请求，所以Generator并没有改变回调地狱的本质，但是换回了代码的更加优雅!

#### 3.5 co如何处理自动执行Generator的异常(reject掉)
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

#### 3.6 yield与for循环
很早的时候我就有一个疑问:"如果将yield的产生放在for循环里面，那么yield的顺序是否也能够保证顺序执行呢?"答案是:"能!"，下面是我给出的一个例子:
```js
import "babel-polyfill";
const co = require('co');
const outer = ['outer1','outer2','outer3'];
const inner = ['inner1','inner2','inner3'];
let counter = 1;
function *update(){
  for(let i=0;i<outer.length;i++){
  for(let j=0;j<inner.length;j++){
     console.log(counter);
    counter++;
    yield new Promise(function(resolve,reject){
      setTimeout(function(){
        console.log('resolve的值为',`${outer[i]}${inner[j]}`);
        resolve(`${outer[i]}${inner[j]}`);
      },Math.round(Math.random()*100));
    })
  }
 }
}
co(update)
```
此时你会发现打印的顺序为:"outer1inner1","outer1inner2","outer1inner3","outer2inner1","outer2inner2","outer2inner3","outer3inner1","outer3inner2","outer3inner3"。而且你会发现，在我的例子中我的每一个Promise都会推迟一个随机的时间执行，这是为了模仿我们的网络请求的。结论告诉我们:浏览器的事件队列是顺序执行的，[先进入事件队列会在先执行](../others/nodejs-QA/browser-QA.md)。那么你可能会好奇对于这种双重for循环的Generator函数会被babel打包成为那种格式？请看下面打包后的代码:
```js
'use strict';
require('babel-polyfill');
var _marked = /*#__PURE__*/regeneratorRuntime.mark(update);
var co = require('co');
var outer = ['outer1', 'outer2', 'outer3'];
var inner = ['inner1', 'inner2', 'inner3'];
var counter = 1;
function update() {
  var _this = this;
  var _loop, i;
  return regeneratorRuntime.wrap(function update$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
            var _loop2, j;
            return regeneratorRuntime.wrap(function _loop$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    _loop2 = /*#__PURE__*/regeneratorRuntime.mark(function _loop2(j) {
                      return regeneratorRuntime.wrap(function _loop2$(_context) {
                        while (1) {
                          switch (_context.prev = _context.next) {
                            case 0:
                              console.log(counter);
                              counter++;
                              _context.next = 4;
                              // (3)延迟指定的时间模仿网络请求
                              return new Promise(function (resolve, reject) {
                                setTimeout(function () {
                                  console.log('resolve的值为', '' + outer[i] + inner[j]);
                                  resolve('' + outer[i] + inner[j]);
                                }, Math.round(Math.random() * 100));
                              });
                            case 4:
                            case 'end':
                              return _context.stop();
                          }
                        }
                      }, _loop2, _this);
                    });
                    j = 0;
                  case 2:
                    if (!(j < inner.length)) {
                      _context2.next = 7;
                      break;
                    }
                    return _context2.delegateYield(_loop2(j), 't0', 4);
                  case 4:
                    j++;
                    _context2.next = 2;
                    break;

                  case 7:
                  //第二层循环_context2停止
                  case 'end':
                    return _context2.stop();
                }
              }
            }, _loop, _this);
          });
          i = 0;
        //(2)如果外层循环还没有结束，那么走外层的循环_loop(i),否则退出外层的循环，直接停止Gernerator
        case 2:
          if (!(i < outer.length)) {
            _context3.next = 7;
            break;
          }
          return _context3.delegateYield(_loop(i), 't0', 4);
        case 4:
          i++;
          _context3.next = 2;
          break;
        // (3)直接走外层的stop结束循环,外层为_context3
        case 7:
        case 'end':
          return _context3.stop();
      }
    }
  }, _marked, this);
}
co(update);
```
也就是告诉我们外层的Generator函数执行完毕后才会退出，而内部会根据每次循环yield单独的case语句!而且出现了多重循环的时候出现了\_context3,\_context2,\_context等多个控制循环case的变量。

#### 3.7 如何判断一个函数为Generator函数
可以通过**constructor.name**来判断:
```js
function isGeneratorFunction(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return  (ctor.displayName || ctor.name) === "GeneratorFunction"
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        // 对于原生的generator函数，我们通过判断它的constructor的name属性
      : false;
  };
```

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

那么你可能会继续问：如果if..else外面的变量和内部的变量重复了，那么是否会报错呢?比如下面的代码:
```js
const condition = false;
console.log('我的名字为:',myName);
const myName = "liangklfangl";
if(condition){
  const myName = "罄天";
}else{
  const myName = "覃亮";
}
```
我们看看babel打包后的代码:
```js
"use strict";
var condition = false;
console.log('我的名字为:', myName);
var myName = "liangklfangl";
if (condition) {
  var _myName = "罄天";
} else {
  var _myName2 = "覃亮";
}
```
也就是说babel将if..else中定义的变量都重新命名了，因此不会存在和外部变量同名的问题。

#### 问题5:Async与Generator函数关系
##### 问题5.1:Async与Generator函数以及Async的特点
`一句话，async 函数就是 Generator 函数的语法糖`。比如Generator函数，依次读取两个文件。
```js
var fs = require('fs');
var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) reject(error);
      resolve(data);
    });
  });
};
var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
写成 async 函数，就是下面这样。
```js
var asyncReadFile = async function (){
  var f1 = await readFile('/etc/fstab');
  var f2 = await readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};
```
一比较就会发现，async 函数就是将 Generator 函数的星号（\*）替换成async，将yield 替换成 await，`仅此而已`。async 函数对 Generator 函数的改进，体现在以下三点:

- **内置执行器**
  Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。
  ```js
  var result = asyncReadFile();
  ```
- **更好的语义**
   async 和 await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。
- **更广的适用性**
   co 函数库约定，yield 命令后面只能是`Thunk函数或Promise`对象，而 async 函数的 await 命令后面，可以跟Promise对象和原始类型的值（数值、字符串和布尔值，但这时**等同于同步操作**）。
async 函数的实现，就是将Generator函数和自动执行器，包装在一个函数里。
```js
async function fn(args){
  // ...
}
// 等同于
function fn(args){ 
  return spawn(function*() {
    // ...
  }); 
}
```
所有的 async 函数都可以写成上面的第二种形式,因此**可以直接调用**，其中的spawn函数就是自动执行器。下面给出spawn函数的实现，基本就是前文自动执行器的翻版。
```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    var gen = genF();
    //获取迭代器
    function step(nextF) {
      try {
        var next = nextF();
      } catch(e) {
        return reject(e); 
      }
      if(next.done) {
        return resolve(next.value);
      } 
      //将上次结果传入本次
      Promise.resolve(next.value).then(function(v) {
        step(function() { return gen.next(v); });      
      }, function(e) {
        step(function() { return gen.throw(e); });
      });
    }
    step(function() { return gen.next(undefined); });
  });
}
```
async函数是非常新的语法功能，新到都不属于 ES6，而是属于 ES7。目前，它仍处于提案阶段，但是转码器 Babel 和 regenerator 都已经支持，转码后就能使用。

##### 问题5.2:Async函数的特点
从上面自动执行器的代码可以看到，直接调用async函数后返回的是**Promise**对象，因此可以直接采用下面的方法调用。
```js
async function Test(){}
Test().then(()=>{},()=>{})
```
同时，我们也可以采用和Generator函数一样(**原理上面已经讲过,来源于Generator对于流程的控制**)，让当前代码停止执行，然后过一定时间后继续执行。
```js
function timeout(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
async function asyncPrint(value, ms) {
  await timeout(ms);
  // 因为async只是Generator的语法糖，所以只有调用next后才能继续执行。async也是一样的
  // 和阻塞代码是一致的!!
  console.log(value)
  // 50ms后这句代码才能继续执行
}
asyncPrint('hello world', 50);
```

##### 问题5.3:使用for循环来动态await
await命令后面的 Promise 对象，运行结果可能是**rejected**，所以最好把await命令放在 try...catch 代码块中。
```js
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}
// 另一种写法
async function myFunction() {
  await somethingThatReturnsAPromise().catch(function (err){
    console.log(err);
  });
}
```
await 命令只能用在 async 函数之中，如果用在**普通函数**，就会报错。
```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 报错
  docs.forEach(function (doc) {
    await db.post(doc);
  });
}
```
上面代码会报错，因为await用在普通函数之中了。但是，如果将 forEach 方法的参数改成async函数，也有问题。
```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  // 可能得到错误结果
  docs.forEach(async function (doc) {
    await db.post(doc);
  });
}
```
上面代码可能不会正常工作，原因是这时三个db.post 操作将是**并发执行**，也就是同时执行，而不是同步执行。正确的写法是**采用for循环**。
```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  for (let doc of docs) {
    await db.post(doc);
  }
}
```
如果确实希望多个请求并发执行，可以使用 Promise.all 方法。
```js
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));
  // 得到一个Promise列表集合，因为await本身返回的是Promise
  let results = await Promise.all(promises);
  console.log(results);
}
// 或者使用下面的写法
async function dbFuc(db) {
  let docs = [{}, {}, {}];
  let promises = docs.map((doc) => db.post(doc));
  let results = [];
  for (let promise of promises) {
    results.push(await promise);
  }
  console.log(results);
}
```
以上内容来源于[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)。

##### 问题5.4:为什么不能在forEach/map方法中await
如果需要按顺序执行代码，比如如下的代码:
```js
let docs = [{}, {}, {}];
docs.forEach(async function (doc, i) {
  var result = await new Promise(function(resolve,reject){
    setTimeout(function(){
      resolve(`返回值`+i);
    },Math.round(5000));
  })
  console.log('result==='+result);
});
console.log('主循环已经退出!');
```
此时会立即输出"主循环已经退出!",5s后再输出3次"result===返回值0","result===返回值1","result===返回值2"。这告诉我们以下内容:
<pre>
 1. 主函数提前退出，这和Generator函数是不一样的，后者会等待Generator函数完成后回到主函数后退出因为await其实是在子函数中，
 而不是主函数中,它无法阻止主函数继续执行!
 2. 数组中每一个元素都按顺序执行forEach中的函数，所以导致三个Promise并发执行，因为每次执行的函数都不一样，应该使用for循环替换
</pre>
而不能使用map方法的原理和上面的forEach是一致的:
```js
let docs = [{}, {}, {}];
let promises = docs.map((doc) => db.post(doc));
// WARNING: this doesn't work
let results = promises.map(async function(promise) {
  return await promise;
});
// This will just be a list of promises :(
console.log(results);
```
而这两种方式的解决方法如下,其中**forEach使用for循环来替代**:
```js
let docs = [{}, {}, {}];
for (let i = 0; i < docs.length; i++) {
  let doc = docs[i];
  await db.post(doc);
}
```
而map方法可以通过**for循环或者Promise.all的方式**来解决:
```js
let docs = [{}, {}, {}];
let promises = docs.map((doc) => db.post(doc));
let results = [];
// for循环里面await
for (let promise of promises) {
  results.push(await promise);
}
console.log(results);
```
也可以采用Promise.all方法解决:
```js
let docs = [{}, {}, {}];
let promises = docs.map((doc) => db.post(doc));
// Promise.all
let results = await Promise.all(promises);
console.log(results);
```
那么此处你可能在想，**为什么**要用Promise.all来执行呢?我们再看一个例子:
```js
async function downloadContent(urls) {
    return urls.map(async (url) => {
        const content = await httpGet(url);
        return content;
    });
}
```
这个代码有两个问题:
<pre>
 1.这个方法的结果将会得到Promise数组，而不是string数组
 2. map方法中的函数在执行后还没有完成，因为await方法只会暂停map中的箭头函数，而httpGet()方法是异步resolve的
 (forEach/map执行后内部的函数并没有执行完毕，和Generator函数一样此时返回的只是await httpGet(url)而已，后续的代码还没有执行)。也就是说，
 此时的await不会等待downloadContent()方法执行完毕。
</pre>

回到上面的forEach/map方法，有什么方式可以保证Promise不是并发执行的呢?下面使用Promise来解决呢?请看下面的代码:
```js
var promise = Promise.resolve("0");
var docs = [{}, {}, {}];
docs.forEach(function (doc,i) {
  promise = promise.then(function (value) {
      //(2)这里的value就是上一次resolve的值，一开始是0
      return new Promise(function(resolve,reject){
        //(1)这里发起请求获取到服务端的数据，然后动态传递给下一个请求
        //这就是顺序执行代码
        setTimeout(function(){
          resolve(value+":"+Math.random());
        },Math.round(200));
    })
  });
});
promise.then(function (values) {
  console.log('最后得到的数据为:',values);
  //得到所有的每一次resolve后的值
});
//(3)这里的代码会在上面的Promise.then和forEach执行完毕之前执行，但是Promise.then
//会在forEach中所有的代码执行完成以后才会执行
console.log('Promise.then已经执行完毕了!');
```
以上例子原文请[点击](https://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html)这里。

##### 问题5.5: Async函数代码执行顺序
比如下面的代码:
```js
async function asyncFunc() {
   console.log('lalal');
   // 第一步
   await new Promise(function(resolve,reject){
       resolve(1);
   })
  console.log('asyncFunc()'); 
  // 第三步
  return 'abc';
}
asyncFunc().then(x => console.log(`Resolved: ${x}`)); 
// 第四步
console.log('main'); 
// 第二步
```
**执行顺序**如下:
<pre>
lalal
main
asyncFunc()
Resolved: abc
</pre>

执行结果告诉我们:
<pre>
1.直接调用async方法的时候await之前的代码是提前执行的
2.async方法是异步的，返回的是Promise,所以调用async方法后的代码是不会被阻塞的!
</pre>

##### 问题5.6:如何判断某个函数是否是async
```js
Object.prototype.toString.call(fn);
//"[object AsyncFunction]"
//或者通过下面的方法来判断，即Symbol.toStringTag属性
var supportsSymbol = typeof Symbol === 'function';
function isAsync(fn) {
    return supportsSymbol && fn[Symbol.toStringTag] === 'AsyncFunction';
}
```

#### 问题6:ES6的Symbol类型
##### 问题6.1:默认具有迭代器的对象
**Symbol.iterator**为每一个对象定义了默认的迭代器。该迭代器可以被 for...of 循环使用。当需要对一个对象进行迭代时（比如开始用于一个for..of循环中），它的**@@iterator方法**都会在不传参情况下被调用，返回的迭代器用于获取要迭代的值。一些内置类型拥有默认的迭代器行为，其他类型（如**Object**）则没有。下表中的内置类型拥有默认的@@iterator方法：
<pre>
Array.prototype[@@iterator]()
TypedArray.prototype[@@iterator]()
String.prototype[@@iterator]()
Map.prototype[@@iterator]()
Set.prototype[@@iterator]()
</pre>

##### 问题6.2:自定义迭代器
```js
var myIterable = {}
myIterable[Symbol.iterator] = function* () {
    yield 1;
    yield 2;
    yield 3;
};
[...myIterable] // [1, 2, 3]
```
如果一个迭代器 @@iterator 没有返回一个迭代器对象，那么它就是一个不符合标准的迭代器，这样的迭代器将会在运行期抛出异常，甚至非常诡异的 Bug。
```js
var nonWellFormedIterable = {}
nonWellFormedIterable[Symbol.iterator] = () => 1
[...nonWellFormedIterable] // TypeError: [] is not a function
```

##### 问题6.3:Symbol类型的说明
- Symbol是一个基本数据类型
  ES6 引入了一种新的原始数据类型Symbol，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）
- Symbol值不能与其他类型的值进行`运算`
```js
let sym = Symbol('My symbol');
"your symbol is " + sym
// TypeError: can't convert symbol to string
`your symbol is ${sym}`
// TypeError: can't convert symbol to string
```
但是可以**显式的**转化为String。
```js
let sym = Symbol('My symbol');
String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```
- Symbol 值也可以转为布尔值，但是不能转为数值
```js
let sym = Symbol();
Boolean(sym) // true
!sym  // false
if (sym) {
  // ...
}
Number(sym) // TypeError
sym + 2 // TypeError
```
- Symbol 值作为对象属性名时，不能用点运算符
```js
const mySymbol = Symbol();
const a = {};
a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"
```
上面代码中，因为**点运算符后面总是字符串**，所以不会读取mySymbol作为标识名所指代的那个值，导致a的属性名实际上是一个字符串，而不是一个 Symbol 值。同理，在对象的内部，使用Symbol 值定义属性时，Symbol 值必须放在方括号之中。
```js
let s = Symbol();
let obj = {
  [s]: function (arg) { ... }
};
obj[s](123);
```
- Symbol 作为属性名，该属性不会出现在for...in、for...of循环中
Symbol作为属性名，该属性**不会**出现在for...in、for...of循环中，也不会被Object.keys()、Object.getOwnPropertyNames()、JSON.stringify()返回。但是，它也**不是私有**属性，有一个**Object.getOwnPropertySymbols**方法，可以获取指定对象的所有 Symbol 属性名。Object.getOwnPropertySymbols方法返回一个数组，成员是当前对象的所有用作属性名的 Symbol 值。
```js
const obj = {};
let a = Symbol('a');
let b = Symbol('b');
obj[a] = 'Hello';
obj[b] = 'World';
const objectSymbols = Object.getOwnPropertySymbols(obj);
objectSymbols
// [Symbol(a), Symbol(b)]
```
另一个新的 API，**Reflect.ownKeys**方法可以返回所有类型的键名，包括常规键名和Symbol键名。
```js
let obj = {
  [Symbol('my_key')]: 1,
  enum: 2,
  nonEnum: 3
};
Reflect.ownKeys(obj)
//  ["enum", "nonEnum", Symbol(my_key)]
```
由于以 Symbol 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。
```js
let size = Symbol('size');
class Collection {
  constructor() {
    this[size] = 0;
  }
  add(item) {
    this[this[size]] = item;
    this[size]++;
  }
  static sizeOf(instance) {
    return instance[size];
  }
}
let x = new Collection();
Collection.sizeOf(x) // 0
x.add('foo');
Collection.sizeOf(x) // 1
Object.keys(x) // ['0']
Object.getOwnPropertyNames(x) // ['0']
Object.getOwnPropertySymbols(x) // [Symbol(size)]
```
上面代码中，对象x的size属性是一个 Symbol 值，所以Object.keys(x)、Object.getOwnPropertyNames(x)都无法获取它。这就造成了一种**非私有的内部方法**的效果。

- Symbol.for与Symbol.keyFor的区别
有时，我们希望重新使用同一个Symbol值，Symbol.for方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的Symbol值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的Symbol值。
```js
let s1 = Symbol.for('foo');
let s2 = Symbol.for('foo');
s1 === s2 // true
```
上面代码中，s1和s2都是 Symbol值，但是它们都是同样参数的Symbol.for方法生成的，所以实际上是**同一个值**。Symbol.for()与Symbol()这两种写法，都会生成新的 Symbol。它们的**区别**是，前者会被登记在全局环境中供搜索，后者不会。Symbol.for()不会每次调用就返回一个新的 Symbol 类型的值，而是会**先检查**给定的key是否已经存在，如果不存在才会新建一个值。比如，如果你调用Symbol.for("cat")30 次，每次都会返回同一个 Symbol 值，但是调用Symbol("cat")30 次，会返回 30 个不同的 Symbol 值。
```js
Symbol.for("bar") === Symbol.for("bar")
// true
Symbol("bar") === Symbol("bar")
// false
```
上面代码中，由于Symbol()写法**没有登记机制**，所以每次调用都会返回一个不同的值。Symbol.keyFor方法返回一个已登记的 Symbol 类型值的key。
```js
let s1 = Symbol.for("foo");
Symbol.keyFor(s1) // "foo"
let s2 = Symbol("foo");
Symbol.keyFor(s2) // undefined
```
上面代码中，变量s2属于未登记的 Symbol 值，所以返回undefined。
需要注意的是，Symbol.for为 Symbol 值登记的名字，是**全局环境**的，可以在不同的 iframe 或 service worker 中取到同一个值。
```js
iframe = document.createElement('iframe');
iframe.src = String(window.location);
document.body.appendChild(iframe);
iframe.contentWindow.Symbol.for('foo') === Symbol.for('foo')
// true
```
上面代码中，iframe 窗口生成的 Symbol 值，可以在主页面得到。

- 保证模块代码只会执行一次
```js
// mod.js
function A() {
  this.foo = 'hello';
}
if (!global._foo) {
  global._foo = new A();
}
module.exports = global._foo;
```
然后，加载上面的mod.js。
```js
const a = require('./mod.js');
console.log(a.foo);
```
上面代码中，变量a任何时候加载的都是A的同一个实例。但是，这里有一个问题，全局变量global.\_foo是可写的，任何文件都可以修改。
```js
const a = require('./mod.js');
global._foo = 123;
```
上面的代码，会使得别的脚本加载mod.js都失真。为了防止这种情况出现，我们就可以使用 Symbol。
```js
// mod.js
const FOO_KEY = Symbol.for('foo');
function A() {
  this.foo = 'hello';
}
if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}
module.exports = global[FOO_KEY];
```
上面代码中，可以保证global[FOO_KEY]不会被无意间覆盖，但**还是可以**被改写。
```js
const a = require('./mod.js');
global[Symbol.for('foo')] = 123;
```
如果键名使用Symbol方法生成，那么外部将无法引用这个值，当然也就无法改写。
```js
// mod.js
const FOO_KEY = Symbol('foo');
// 后面代码相同 ……
```
上面代码将导致其他脚本都无法引用FOO_KEY。但这样也有一个问题，就是如果多次执行这个脚本，每次得到的FOO_KEY都是不一样的。虽然 Node会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是完全可靠。其他内容请[点击这里](http://es6.ruanyifeng.com/#docs/symbol)阅读。

#### 问题5:Fetch API问题
##### 问题5.1:Fetch与Ajax对比
fetch 规范与 jQuery.ajax() 主要有两种方式的不同，牢记：

(1)当接收到一个代表错误的HTTP状态码时，从fetch()返回的Promise不会被标记为reject， **即使该 HTTP 响应的状态码是404或500**。相反，它会将 Promise 状态标记为 resolve（但是会将resolve 的返回值的**ok属性**设置为 false），  仅当**网络故障时或请求被阻止时**，才会标记为 reject。

(2)默认情况下, fetch不会从服务端发送或接收任何cookies, 如果站点依赖于用户 session，则会导致未经认证的请求（要发送 cookies，必须设置**credentials**选项）。

##### 问题5.2:功能检测
Fetch API 的支持情况，可以通过检测**Headers、Request、Response或 fetch()** 是否在 Window 或 Worker 域中。比如你可以这样做：
```js
if(self.fetch) {
    // run my fetch request here
} else {
    // do something with XMLHttpRequest?
}
```
##### 问题5.3:fetch API使用
如果遇到网络故障，fetch() promise 将会 reject，带上一个 TypeError对象。虽然这个情况经常是遇到了**权限问题(CORS),域名解析失败,无法连接服务器**——比如 404 不是一个网络故障。想要精确的判断fetch()是否成功，需要包含promise resolved 的情况，此时再判断 Response.ok 是不是为 true。
```js
function addUser(details) {
  return fetch('https://api.example.com/user', {
    mode: 'cors',
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(details),
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-XSRF-TOKEN': getCookieValue('XSRF-TOKEN')
    }
  }).then(response => {
    return response.json().then(data => {
      // 消耗stream
      if (response.ok) {
        return data;
      } else {
        return Promise.reject({status: response.status, data});
      }
    });
  });
}
```
除了传给 fetch()一个资源的地址，你还可以通过使用Request()构造函数来创建一个 request 对象，然后再作为参数传给 fetch()：
```js
var myHeaders = new Headers();
var myInit = { method: 'GET',
               headers: myHeaders,
               mode: 'cors',
               cache: 'default' };
//传入一个Request
var myRequest = new Request('flowers.jpg', myInit);
fetch(myRequest).then(function(response) {
  return response.blob();
}).then(function(myBlob) {
  var objectURL = URL.createObjectURL(myBlob);
  myImage.src = objectURL;
});
```
Request()和fetch()接受同样的参数。你甚至可以传入一个已存在的request对象来创造一个拷贝。
```js
var anotherRequest = new Request(myRequest,myInit);
```
这个很有用，因为request和response bodies只能被使用一次（这里的意思是因为设计成了 stream 的方式，所以它们只能被读取一次,参见上面的response.json()）。创建一个拷贝就可以再次使用 request/response 了，当然也可以使用不同的init参数。以上内容来自[使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)。





参考资料:

[【转向Javascript系列】深入理解Generators](http://www.alloyteam.com/2016/02/generators-in-depth/)

[regeneratorRuntime](https://github.com/facebook/regenerator/blob/master/packages/regenerator-runtime/runtime.js)

[Diving Deeper With ES6 Generators](https://davidwalsh.name/es6-generators-dive)

[A Practical Introduction to ES6 Generator Functions](https://thejsguy.com/2016/10/15/a-practical-introduction-to-es6-generator-functions.html)

[Asynchronous APIs Using the Fetch API and ES6 GeneratorsRelated Topics:](https://www.sitepoint.com/asynchronous-apis-using-fetch-api-es6-generators/)

[async 函数的含义和用法](http://www.ruanyifeng.com/blog/2015/05/async.html)

[Taming the asynchronous beast with ES7](https://pouchdb.com/2015/03/05/taming-the-async-beast-with-es7.html)

[Tips for using async functions (ES2017)](http://2ality.com/2016/10/async-function-tips.html)

[A Primer on ES7 Async Functions](https://code.tutsplus.com/tutorials/a-primer-on-es7-async-functions--cms-22367)

[Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)

[Symbol](http://es6.ruanyifeng.com/#docs/symbol)


[可迭代协议与迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols)

[Why I won’t be using Fetch API in my apps](https://medium.com/@shahata/why-i-wont-be-using-fetch-api-in-my-apps-6900e6c6fe78)
