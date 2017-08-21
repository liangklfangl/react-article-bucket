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
