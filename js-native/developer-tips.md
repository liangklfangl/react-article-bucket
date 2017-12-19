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


参考资料:

[new Function()](https://davidwalsh.name/new-function)

[What is the most efficient way to deep clone an object in JavaScript?](https://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-deep-clone-an-object-in-javascript)

[Issues with Date() when using JSON.stringify() and JSON.parse()](https://stackoverflow.com/questions/11491938/issues-with-date-when-using-json-stringify-and-json-parse/11491993#11491993)
