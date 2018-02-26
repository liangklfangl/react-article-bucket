#### 1.将字符串转化为对象
可以采用如下任意一种方式:
```js
strToJson = str => {
    if (!str) {
      return {};
    }
    // var json = new Function("return " + str)();
    // 两种方式都是可以的
    var json = eval("("+str+")");
    return json;
};
```
这里采用的eval方法比较容易理解，而new Function这种方式用的比较少，我们看看它的使用场景:
```js
var myFunction = new Function('users', 'salary', 'return users * salary');
```
其中前两个是函数的参数，而第三个参数是函数体。使用这种方式，我们可以在Nodejs或者浏览器中获取到
全局对象:
```js
(function(win) {
    // Do something with the global
    // 因为这里的this没有定义，所以直接会访问外部作用域的值，所以是window
})(Function('return this')());
```

#### 2.高效率的克隆一个对象
注意：下面这种方法克隆的对象不能含有**函数**,同时如果值是**undefined**，那么这个key会被去掉，而且对于**正则**表达式类型和**循环引用**也是不可取的。这种方式因为是native实现的，所以效率也比较高:
```js
function deepCopy(obj){
    const DATE_STRING ="[object Date]";
    if(Array.prototype.toString.call(obj)==DATE_STRING){
        return new Date(JSON.parse(JSON.stringify(obj)));
    }else{
      return JSON.parse(JSON.stringify(obj));
    }
}
```
而且这种嵌套的对象或者数组也是会返回完全不一致的对象:
```js
var obj ={name:'qinliang',city:["Hangzhou","dalian"]}
var obj1 = deepCopy(obj);
obj.city == obj1.city;
// false
var obj2={name:'qinliang',home:{location:'hangzhou',street:'xixibeiyuan'}}
var obj3= deepCopy(obj2);
obj2.home == obj3.home
// false
```
如果是浅复制，那么对象或者数组的引用是相同的:
```js
var obj ={a:1,b:2,c:[1,2]};
    var shallowCopy = shallow(obj);
    function shallow(obj){
        var shallowObj = {};
        for(var name in obj){
            if(obj.hasOwnProperty(name)){
                shallowObj[name] = obj[name]
            }
        }
        return shallowObj
    }
shallowCopy.c === obj.c;
// true
```

#### 3.用户快速通过键盘输入不发请求
很多情况下会遇到用户快速输入的情况，如果每次输入都发送请求到服务端，那么会使得浏览器需要Event Loop执行大量的[callback队列](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/browser-QA.md), 这对于浏览器UI渲染将会有一定的影响。同时，也会造成服务端接口被频繁调用，因此可以采用下面的方式解决:
```js
// Get the input box
var textInput = document.getElementById('test-input');
// Init a timeout variable to be used below
var timeout = null;
// Listen for keystroke events
textInput.onkeyup = function (e) {
    // Clear the timeout if it has already been set.
    // This will prevent the previous task from executing
    // if it has been less than <MILLISECONDS>
    clearTimeout(timeout);
    // Make a new timeout set to go off in 800ms
    timeout = setTimeout(function () {
        console.log('Input Value:', textInput.value);
    }, 500);
};
```
这种方式不仅仅可以用于网络请求，当在为input的onChange指定了事件，但是并不希望用户在input中能直接输入数据，可以采用下面的方式来完成,这样在用户快速输入的情况下是不会多次弹窗提示框的。
```js
onInputFocus = e => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      Dialog.confirm({
        content: "无法直接输入，请点击修改或者添加按钮!",
        title: "无法直接输入",
        onOk: () => {
          return;
        }
      });
    }, 500);
  };
```

#### 4.获取iframe的window对象
```js
function getIframeWindow(iframeElement){
    return iframeElement.contentWindow || iframeElement.contentDocument.parentWindow;
}
```

#### 5.修改package.json的某个属性或者添加一个属性
```js
 fs.readFile(path.join(cwd, "./package.json"), (err, res) => {
  if (err) {
    this.log("发布该组件失败.....");
    return;
  }
  pkg = JSON.parse(res);
  // 这里是JSON.parse而不是stringify,虽然res是一个对象
  pkg["std"] = true;
  // 强制发布
  fs.writeFile(
    path.join(cwd, "./package.json"),
    JSON.stringify(pkg, null, 10),
    (err, res) => {
      if (!err) {
        this.log("发布该组件成功.....");
      }
    }
  );
});
```
当然上面的readFile也可以使用[readFileSync](https://nodejs.org/dist/latest-v9.x/docs/api/fs.html#fs_fs_readfilesync_path_options)来替换。

参考资料:

[new Function()](https://davidwalsh.name/new-function)

[What is the most efficient way to deep clone an object in JavaScript?](https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)

[Issues with Date() when using JSON.stringify() and JSON.parse()](https://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse/11491993#11491993)

[Wait for User to Stop Typing, Using JavaScript](https://schier.co/blog/2014/12/08/wait-for-user-to-stop-typing-using-javascript.html)

[Iframes, onload, and document.domain](https://www.nczonline.net/blog/2009/09/15/iframes-onload-and-documentdomain/)
