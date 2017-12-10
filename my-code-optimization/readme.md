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
