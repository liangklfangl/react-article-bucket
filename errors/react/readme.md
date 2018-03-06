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
