#### 简要说明
这个文章我主要会写一些ES6开发中的常用技巧，通过这些技巧不仅能够提升代码的优雅度，同时对于ES6本身的学习也是很好的参考资料。

问题1：ES6中某一个对象的key是变量，而不是字符串?

```js
 const key = 'authorName';
 const value = 'liangklfangl';
 this.props.onChange({
     [`${name}`] : `value`
    })
```
此种用法你可以参考[我的$autoArray方法](../antd/readme.md)

问题2:在Generator函数中断

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

问题3:Generator函数编译源码_context.next控制下次循环

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
也就是说，我们在`真正执行第二次next`的时候才会输出console的信息!这对于理解yield的执行顺序是很有益处的!特别是如下经常遇到的代码:
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
也就是通过`if判断`来决定是否yield一个新的操作。打包后的完整逻辑如下:
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
