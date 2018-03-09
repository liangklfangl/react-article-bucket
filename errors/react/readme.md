##### 1.react-docgen报错
错误信息为:
<pre>
/Users/qinliang.ql/Desktop/test/node_modules/_react-docgen@3.0.0-beta9@react-docgen/dist/parse.js:78
  throw new Error(ERROR_MISSING_DEFINITION);
  ^

Error: No suitable component definition found.
    at parse (/Users/qinliang.ql/Desktop/test/node_modules/_react-docgen@3.0.0-beta9@react-docgen/dist/parse.js:78:9)
    at Object.defaultParse [as parse] (/Users/qinliang.ql/Desktop/test/node_modules/_react-docgen@3.0.0-beta9@react-docgen/dist/main.js:66:30)
    at fs.readFile (/Users/qinliang.ql/Desktop/test/index.js:10:35)
    at FSReqWrap.readFileAfterClose [as oncomplete] (fs.js:511:3)
</pre>

此时你的代码是:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
class MyComponent extends React.Component{
    render(){
        return <div>内容<\/div>
    }
  }
MyComponent.propTypes = {
  foo: PropTypes.number,
  bar: function(props, propName, componentName) {
  },
  baz: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
};
MyComponent.defaultProps = {
  foo: 42,
  baz:12,
  bar: function(){}
};
export default Component;
```
此时很显然是因为你export default导出的是Component，这个并不是你的组件，而是MyComponent!

##### 2.babylon解析class出错
<pre>
/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:4457
  throw err;
  ^

SyntaxError: Unexpected token (111:3)
    at Parser.pp$5.raise (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:4454:13)
    at Parser.pp.unexpected (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:1761:8)
    at Parser.pp$3.parseIdentifier (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:4332:10)
    at Parser.pp$3.parsePropertyName (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:4156:96)
    at Parser.parsePropertyName (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:6229:23)
    at Parser.pp$1.parseClassBody (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:2483:12)
    at Parser.pp$1.parseClass (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:2406:8)
    at Parser.pp$1.parseStatement (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:1843:19)
    at Parser.parseStatement (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:5910:22)
    at Parser.pp$1.parseBlockBody (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:2268:21)
    at Parser.pp$1.parseTopLevel (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:1778:8)
    at Parser.parse (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:1673:17)
    at Object.parse (/Users/qinliang.ql/Desktop/silk/node_modules/_babylon@6.18.0@babylon/lib/index.js:7305:37)
    at parser (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/transform_index.js:7:18)
    at transformer (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/transform_index.js:76:20)
    at fs.readFile (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/build.js:161:40)
</pre>
最后发现是代码中有一块代码注释有问题，如果不满足如下的格式，可能出现该问题,建议使用[DocBlockr](https://github.com/spadgos/sublime-jsdocs)。如果react-docgen抛出了如下的错误也可能是该问题:

<pre>
# /Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/utils/parseJsDoc.js:26
#   return { name: tag.type.name ? tag.type.name : tag.type.expression.name };
# TypeError: Cannot read property 'name' of undefined
#     at getType (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/utils/parseJsDoc.js:26:70)
#     at getReturnsJsDoc (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/utils/parseJsDoc.js:53:13)
#     at parseJsDoc (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/utils/parseJsDoc.js:82:14)
#     at /Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/handlers/componentMethodsJsDocHandler.js:58:42
#     at Array.map (<anonymous>)
#     at componentMethodsJsDocHandler (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/handlers/componentMethodsJsDocHandler.js:53:21)
#     at /Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/parse.js:45:14
#     at Array.forEach (<anonymous>)
#     at /Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/parse.js:44:14
#     at Array.map (<anonymous>)
#     at executeHandlers (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/parse.js:42:31)
#     at parse (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/parse.js:81:12)
#     at Object.defaultParse [as parse] (/Users/qinliang.ql/Desktop/silk/node_modules/_react-docgen@2.20.1@react-docgen/dist/main.js:66:30)
#     at async.parallel (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/build.js:191:43)
#     at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:3874:9
#     at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:473:16

</pre>


##### 3.重复引入多版本的react解决方案
遇到下面的错误:
<pre>
Uncaught Error: addComponentAsRefTo(...): Only a ReactOwner can have refs. You might be adding a ref to a component that was not created inside a component's `render` method, or you have multiple copies of React loaded (details: https://fb.me/react-refs-must-have-owner).
    at invariant (invariant.js?7839*:41)
    at Object.addComponentAsRefTo (ReactDOM.js:19810)
    at attachRef (ReactDOM.js:20080)
    at Object.ReactRef.attachRefs (ReactDOM.js:20099)
    at ReactDOMComponent.attachRefs (SyntheticEvent.js?00d7*:118)
    at CallbackQueue.notifyAll (EventPluginRegistry.js?f2c2*:214)
    at ReactReconcileTransaction.close (ReactDOM.js:19953)
    at ReactReconcileTransaction.closeAll (LinkedValueUtils.js?98bc*:67)
    at ReactReconcileTransaction.perform (LinkedValueUtils.js?98bc*:14)
    at batchedMountComponentIntoNode (ReactNoopUpdateQueue.js?4a11*:78)
</pre>

原因:我在组件中没有`import ReactDOM from "react-dom"`但是我的页面中有如下调用ReactDOM的代码:
```js
ReactDOM.render(<App name="liangklfangl"/>, document.getElementById('app'));
```
index.html中通过script标签引入了特定版本的react-dom。此时会报出错误。

解决方法如下:

(1)首先在页面中直接import依赖ReactDOM
```js
import ReactDOM from "react-dom";
```

(2)删除页面通过script标签引入的特定版本的ReactDOM。如果不是出于特定原因，我们可以把React,ReactDOM直接打包到最后的bundle中。这样，即使有多个版本的React也不会出现问题。比如我的组件依赖于0.9.1版本的React，同时依赖于A组件，A组件依赖于B版本的React\@15.4.0。那么如果是直接打包，那么我组件使用0.9.1版本的React，同时A组件使用B版本的React即可，因为它们只会使用特定版本的API，所以并没有什么关系。但是如果你使用script引入React，那么就是全局的，可能会B版本的冲突，从而出现上面的问题。

