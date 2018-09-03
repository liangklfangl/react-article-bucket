#### 1.html格式的table如何转化为markdown格式
解答:可以采用[to-markdown](https://github.com/domchristie/to-markdown),只需要下面的一句代码就可以了:
```js
//其中tableHtml是我们的html格式的table，而gfm表明符合github标准的markdown
const markdownTable = toMarkdown(tableHtml, { gfm: true });
```
其中gfm(github flavor markdown)表明这是[GitHub 风格的 Markdown 正式规范](https://linux.cn/article-8399-1.html)

#### 2.获取一个markdown文件中所有的代码块
```js
const commonmark = require("commonmark");
const reader = new commonmark.Parser();
const parsed = reader.parse("");
//parse方法传入你需要解析的字符串
const parsedJSON = {}；
const walker = parsed.walker();
   while ((event = walker.next())) {
    node = event.node;
     if (event.entering && node.type === "code_block") {
       //通过node的_info属性
      if (node._info === "css") {
        parsedJSON.css = node.literal;
      } else if (node._info === "html") {
        parsedJSON.html = node.literal;
      } else if (node._info === "javascript" || node._info === "js") {
        parsedJSON.js = node.literal;
      }
    }
  }
```
具体使用你可以参考[commonmark](https://github.com/commonmark/commonmark.js)，commonmark其实让markdown在规范道路上更近了一步，而[`GFM`](https://qkldx.net/topic/576/github-%E9%A3%8E%E6%A0%BC%E7%9A%84-markdown-%E6%AD%A3%E5%BC%8F%E8%A7%84%E8%8C%83-%E5%8F%91%E5%B8%83)又是基于commonmark的，当评估GFM规范 的时候，你可以清楚的知道哪些是GFM特定规范的补充内容，因为它们都高亮显示了。并且你也会看到原有规范的所有部分都保持原样，因此，GFM 规范能够与任何其他的实现`保持兼容`。我们是在现存的CommonMark规范中来完成这一项工作的，同时还特意关注以确保我们的扩展是原有规范的一个严格且可选的超集。如果有疑问自行google。

#### 3.解决cheerio调用load方法中文乱码的问题
解决：只需要在调用load方法时候传入一个参数就可以了。
```js
  const $ = cheerio.load(marked(contentParse), {
    decodeEntities: false
    //参数
  });
```

#### 4.link和script标签在html页面原样展示
很多情况下，我们有一个字符串，但是我们需要将里面的"<script/>"标签内容原样展示，这时候就需要对我们的标签进行转义，此时你可以参考我的[转义字符串中的script标签](https://github.com/liangklfangl/string.protype)。此时我们可以将转义后的字符串转化为markdown格式:
```js
var scriptRegex = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gm;
var linkRegex = /(<link\b[^>]*>)([\s\S]*?)(<\/link>)/gm;
/**
 * 转义script标签防止被解
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function escapeChars(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/'/g, '&acute;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/\|/g, '&brvbar;');
  return str;
}

  var toMarkdown = require("to-markdown");
  var descriptionContent = encodeScript($(whenUse).nextUntil("h2").html());
  //html片段并转义script标签
  var readme = "<p>" + descriptionFirst.html() + "</p><h2>" + whenUse.html() + "</h2>" + descriptionContent;
  toMarkdown(readme, { gfm: true });
  //to-markdown将我们的html转化为markdown，此时我们转义后的script又回到了script标签了
```
此时[react-markdown](https://github.com/rexxars/react-markdown)就可以原样解析出来了。当然，我们的link标签也是需要编码的:
```js
function encodeLink(str){
  return str.replace(linkRegex,function(matched,$1,$2,$3){
   const replacedStr = escapeChars($1)+$2+escapeChars($3)
   return replacedStr;
  });
}
```

#### 5.使用codeMirror报错
报错信息如下:
<pre>
Uncaught TypeError: Cannot read property 'value' of null
    at Function.H.fromTextArea (codemirror.min.js:1)
    at MarkdownEdit._this.mountedMdEditor (MarkdownEdit.js:96)
    at MarkdownEdit.componentDidMount (MarkdownEdit.js:148)
    at ReactCompositeComponent.js:264
    at measureLifeCyclePerf (ReactCompositeComponent.js:75)
    at ReactCompositeComponent.js:263
    at CallbackQueue.notifyAll (CallbackQueue.js:76)
    at ReactReconcileTransaction.close (ReactReconcileTransaction.js:80)
    at ReactReconcileTransaction.closeAll (Transaction.js:209)
    at ReactReconcileTransaction.perform (Transaction.js:156)
</pre>

一开始我猜测是我没有给textarea设置value或者defaultValue：
```js
<textarea
    name="markdownRaw"
    id="markdownRaw"
    style={{ width: "100%", display: "none" }}
/>
```
最后发现不是这么回事，而是我将这个textarea放到Modal里面，导致Modal没有展示的时候无法获取到这个textarea，所以修改为如下内容即可:
```js
<Modal
  title="你在编辑在线文档"
  width={"90%"}
  height={"calc(100vh - 60px)"}
  visible={this.state.isEditMd}
  onOk={this.handleOk}
  onCancel={this.handleCancel}
>
  <div
    id="iframewrapper"
    style={{ height: "100%", width: "100%" }}
  />
</Modal>
<textarea
  name="markdownRaw"
  id="markdownRaw"
  style={{ width: "100%", display: "none" }}
/>
<\/Col>
```
这里使用codeMirror遇到的问题都是与Modal有关，所以一般我们都是完成一定的操作后Modal显示了，然后做特定的操作，如下:
```js
editMarkdown = source => {
  this.setState(
    {
      isEditMd: true
    },
    () => {
      this.submitTryit();
    }
  );
};
```

#### 6.在react中高亮我们的jsx代码
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

#### 7.通过DOM操作高亮代码
```js
import hljs from "highlight.js/lib/highlight";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
highlightCode = () => {
const domNode = ReactDOM.findDOMNode(this);
//这里不再是domNode.querySelectorAll('pre code')
const nodes = domNode.querySelectorAll("code");
// 注册语言
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("css", css);
for (let i = 0; i < nodes.length; i++) {
  // console.log("nodes[i]==", nodes[i]);
  const tagName = nodes[i].tagName;
  // code标签
  let innerHTML = nodes[i].innerHTML;
  // console.log("获取焦点的inerinnerHTML为==", innerHTML);
  innerHTML = innerHTML.replace(/(silk|npm|propTypes)/g, function($1) {
    return `<span style="color:red">${$1}</span>`;
  });
  // console.log("获取焦点的inerinnerHTML的replaced为==", innerHTML);
  nodes[i].innerHTML = innerHTML;
  hljs.highlightBlock(nodes[i]);
}
// console.log("高亮后的node为====>", nodes);
const aTags = domNode.querySelectorAll("a");
//以这种方式来解决浏览器的后退问题，即a标签以新页面打开
for (let j = 0; j < aTags.length; j++) {
  if (!aTags[j].getAttribute("target")) {
    aTags[j].setAttribute("target", "_blank");
  }
}
};
```
上面这种方式就是通过**操作DOM**来高亮特定的关键字。关键点在于字符串操作。

#### 8.setValue或者getValue获取codeMirror的值
```js
const code =
      typeof stringOrObjectSchema == "object"
        ? serialize(stringOrObjectSchema, { space: 2 })
        : stringOrObjectSchema;
this.CodeMirror.codeMirror.setValue(code);
// 设置值
this.CodeMirror.codeMirror.getValue();
// 获取值
<CodeMirror
  options={optionsMirror}
  mode="text/typescript-jsx"
  defaultValue={this.state.code}
  ref={CodeMirror => {
    this.CodeMirror = CodeMirror;
  }}
  onChange={this.onSchemaChange}
\/>
```

参考资料:

[如何看待尝试标准化并取代 Markdown 的 CommonMark ？](https://www.zhihu.com/question/25417178/answer/30765483)

[通用标注(CommonMark)](http://www.commonmark.cn/w/)

[《GitHub 风格的 Markdown 正式规范》发布](https://qkldx.net/topic/576/github-%E9%A3%8E%E6%A0%BC%E7%9A%84-markdown-%E6%AD%A3%E5%BC%8F%E8%A7%84%E8%8C%83-%E5%8F%91%E5%B8%83)
