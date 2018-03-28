#### 写在前面的话
这个章节主要是一些对于日常代码的优化，希望通过这部分的代码能够提升自己代码的优雅度。

#### 1.数组转化为Object对象
除了使用for循环+变量的方式来转化以外，建议使用下面的方法。
```js
var options = [
  {
    "optionText": "key1",
    "optionValue": "value1",
  },
  {
    "optionText": "key2",
    "optionValue": "value2",
   
  },
  {
    "optionText": "key3",
    "optionValue": "value3",
  }
]
var keyMap =  options.reduce((pre,cur)=>{
    pre[`${cur.optionText}`] = cur.optionValue
    return pre
},{});
keyMap;
// 迭代后的对象如下
// {
//   "key1": "value1",
//   "key2": "value2",
//   "key3": "value3"
// }
```

#### 2.去重对象数组变为map
```js
var arr = [{
   component_name:'he',
     name:'he'
},{
   component_name:'he1',
     name:'he1'
},
{
   component_name:'he2',
     name:'he2'
},
{
   component_name:'he2',
     name:'he2'
},
{
   component_name:'he3',
     name:'he3'
},
{
   component_name:'he3',
     name:'he3'
}];

var uniqueMap = arr.reduce(function(pre,cur){
//   表示已经存在了，那么我要删除它
  if(pre[`${cur.component_name}`]){
     return pre
  }else{
     pre[`${cur.component_name}`] = cur.name
     return pre
  }
},{});
```
此时我们发现所有的数组元素通过`component_name`已经去重了!

#### 3.some/every提前退出循环
```js
let fulled = true;
Object.keys(message.data).some((key, idx) => {
  if (!message.data[key]) {
    fulled = false;
    // 只是退出some
    return true;
  }
});
if (!fulled) {
  Toast.error(`请确认必填字段已经填写完成再保存!`);
  return;
}
```
上面的例子表示，只要message.data有一个值为空，那么就通过`return true`退出循环，但是此时并不是退出我们自己的函数，只是退出some函数而已，因此外层要通过fulled来判断。如果采用every只要return false就退出循环了:
```js
let fulled = true;
Object.keys(message.data).every((key, idx) => {
  if (!message.data[key]) {
    fulled = false;
    // 只是退出every
    return false;
  }
});
if (!fulled) {
  Toast.error(`请确认必填字段已经填写完成再保存!`);
  return;
}
```
顾名思义，some/every表示只要有一个满足条件/每一个都满足条件，通过它就能退出循环了。当然也可以使用forEach:
```js
function test(){
 var BreakException = {};
  try {
    [1, 2, 3].forEach(function(i) {
      if (i === 2) throw BreakException;
      console.log(i);
    });
  } catch (e) {
    // 其他异常直接抛出
    if (e !== BreakException) {
      throw e;
    } else {
      return false;
    }
}
 console.log("end");
 // 这句代码永远不会执行，因为i==2的时候已经return false，函数test已经返回
}
```
或者借助finally来实现:
```js
function example() { 
    var returnState = false; // initialisation value is really up to the design
    try { 
        returnState = true; 
    } 
    catch {
        returnState = false;
    }
    finally { 
        return returnState; 
    } 
} 
```
注意，下面的代码返回false:
```js
function example() {
    try {
        return true;
    }
    finally {
        return false;
    }
}
```

#### 4.不要在for循环中删除对象
```js
function filterNotExportedLib(imports, exportNames) {
  const localImports = [];
  for (let t = 0, len = imports.length; t < len; t++) {
    if (exportNames.indexOf(imports[t]&&imports[t].name) != -1) {
      localImports.push(imports[t]);
      //imports.splice(t, 1);
      // for循环里面不要调用删除操作，应该使用局部变量
    }
  }
  return localImports
}
```

#### 5.reduce+concat对数组进行操作
```js
// ["/Users/qinliang.ql/Desktop/test/src","/Users/qinliang.ql/Desktop/test","/Users/qinliang.ql/Desktop","/Users/qinliang.ql","/Users","/"]
var dirs = paths.reduce(function (dirs, aPath) {
      // dirs表示已经获取到的目录,即(prev,cur)
      return dirs.concat(modules.map(function (moduleDir) {
          // aPath表示就是当前的reduce循环的cur变量
          return path.join(prefix, aPath, moduleDir);
      }));
}, []);
```



参考资料:

[如何跳出forEach遍历](http://annvov.github.io/forEach.html)

[JavaScript中forEach循环数组时，如何中途跳出循环？](https://segmentfault.com/q/1010000003866554/)

[Javascript: try/catch return statement](https://stackoverflow.com/questions/3837994/javascript-try-catch-return-statement)
