#### 如何运行
```js
//cd到highlight的目录
npm install webpackcc -g
npm run dev
```

#### 在react中高亮我们的jsx代码
很多情况，我们都会遇到高亮jsx,js,css,html代码等需求，此时我们可以考虑使用prism和highlight，此处我们采用prism来完成。

第一步：下面是我们使用的html代码:
```js
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>React Prism | tomchentw</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/themes/prism.min.css">
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.5.1/prism.min.js"></script>
  </head>
  <body>
    <div id="react-content"></div>
  </body>
<\/html>
```
这一步我们引入了prism.js和prism.css两部分的代码。

第二步：我们使用[react-prism组件](https://github.com/tomchentw/react-prism)来显示代码
```js
import PrismCode from "react-prism";
import React from "react";
import ReactDOM from "react-dom";
export default class Test extends React.Component{
  render () {
    return (
      <div className="container">
         <PrismCode component="pre" className="language-jsx">
           {
            `   import { Breadcrumb } from 'antd';
                ReactDOM.render(
                <Breadcrumb>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item><a href="">Application Center</a></Breadcrumb.Item>
                    <Breadcrumb.Item><a href="
                ">Application List</a></Breadcrumb.Item>
                    <Breadcrumb.Item>An Application</Breadcrumb.Item>
                </Breadcrumb>
                , mountNode);
        `}
         </PrismCode>
      </div>
    );
  }
}
ReactDOM.render(<Test/>,document.getElementById('react-content'));
```
到了这一步，可能你的jsx还是无法正常高亮的，一个很可能的原因在于你打包成的最终的prism.js没有对于jsx的处理的插件。此时[打开这个页面](http://prismjs.com/download.html)，然后将languages部分将`React jsx`勾选上，然后点击下载。将最新的prism.js和prism.css引入到页面中就可以了。

最后：我们分析下react-prism这个组件的代码:

```js
import React, { PureComponent } from "react";
import { PropTypes } from "prop-types";
export default class PrismCode extends PureComponent {
  static propTypes = {
    async: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.any,
    component: PropTypes.node,
  };
  //(1)默认指定组件的props
  static defaultProps = {
    component: `code`,
  }
  componentDidMount() {
    this._hightlight();
  }
  //(2)在componentDidMount和componentDidUpdate中我们都要重新高亮显示
  componentDidUpdate() {
    this._hightlight();
  }
 //(5)此时提供的highlightElement方法就是高亮某一个element中的代码
 //Prism.highlightElement(element, async, callback)
  _hightlight() {
    Prism.highlightElement(this._domNode, this.props.async);
  }
  //(3)当组件加载完毕，我们通过ref来将该组件生成的DOM节点获取到
  _handleRefMount = (domNode) => {
    this._domNode = domNode
  }

  render() {
    const { className, component: Wrapper, children } = this.props;
    //(4)将我们的this.props.component赋值到Wrapper变量上，后续可以直接使用Wrapper变量
    return (
      <Wrapper
        ref={this._handleRefMount}
        className={className}
      >
        {children}
      <\/Wrapper>
    );
  }
}
```
其中有以下几个知识点:

(1)如果是ES6或者函数组件可以使用defaultProps
```js
static defaultProps = {
    component: `code`,
  }
```
上面是使用static在组件内部指定的，后面还可以在组件外直接指定:
```js
Greeting.defaultProps = {
  name: 'Mary'
};
```
(2)componentDidMount和componentDidUpdate中都需要重新调用高亮显示方法

(3)其他内容已经在上面分析过了，API[请参考这里](http://prismjs.com/extending.html)。


