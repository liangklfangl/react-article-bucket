#### 主要内容
在本章节，主要是一些Nodejs工具函数。如果你有任何问题欢迎issue,同时也欢迎star！

#### 1.nodejs的打印深层次对象
当然可以使用如下方式:
```js
const util = require('util');
util.inspect(object,{showHidden:true,depth:4});
```
但是更好的方法请参考[这个方法](./source/index.js)。如下使用即可:
```js
console.log(require("./source/index.js").dump(args));
// 这个args可以深层次嵌套的对象
```

#### 2.jsdoc自定义Tag和使用
```js
const logger = require("jsdoc/util/logger");
exports.handlers = {
  newDoclet({ doclet }) {
    if (doclet.scope == "complex") {
      // 表示是通过@complex这个tag注释的
      // 最后输出中可以通过这个scope==complex来判断是命中了自己的注解
      logger.warn("我找到complex这个注释并处理了!");
    }
  }
};
/**
     * 我想通过这种方式在constructor(opts)中里面注释opts对象，比如{name:'罄天',sex:'男'}
     */
exports.defineTags = function(dictionary, tagDefinitions) {
  dictionary
    .defineTag("complex", {
      canHaveType: true,
      canHaveName: true,
      mustHaveValue: true, 
      /**
     * 这个回调可以修改tag的内容
     * doclet:被命中的注释
     * tag:{"originalTitle":"complex","title":"complex","text":"{object} obj","value":{"type":{"names":["object"]},"name":"obj"}}
     */
      onTagged: function(doclet, tag) {
        doclet.name = doclet.name + "_complexed";
        doclet.scope = "complex";
      }
    })
    .synonym("cplx");
};

```

通过上面的方法就可以命中自己tag的注释，然后在jsdoc的最终输出json中找到scope为complex你的值。具体使用如下:
```js
 /**
  * @complex {object} {name:'姓名',sex:'女',locatioin:'地址',age:20} 
  */
  constructor(obj) {
    super(obj);
  }
```