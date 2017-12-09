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
