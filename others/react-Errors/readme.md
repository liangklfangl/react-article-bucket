#### 1.React页面有多个id存在的问题
问题：导致某一个特定id的元素仿佛被执行了多次。比如下面的现象就是textarea被多次添加内容，导致非常奇怪的问题
```js
//组件Component的名字为Demo
  autodivheight = () => {
    let winHeight = 0,
      height;

    if (window.innerHeight) {
      winHeight = window.innerHeight;
    } else if (document.body && document.body.clientHeight) {
      winHeight = document.body.clientHeight;
    }
    //通过深入Document内部对body进行检测，获取浏览器窗口高度
    if (document.documentElement && document.documentElement.clientHeight) {
      winHeight = document.documentElement.clientHeight;
    }
    height = winHeight * 0.68;
    this.editor.setSize("100%", height);
    if (document.getElementById("iframeResult")) {
      document.getElementById("iframeResult").style.height = height + "px";
    }
  };
  componentDidMount() {
    this.editor = CodeMirror.fromTextArea(
      document.getElementById(`textareaCode${this.props.index}`),
      {
        mode: mixedMode,
        selectionPointer: true,
        lineNumbers: false,
        matchBrackets: true,
        indentUnit: 4,
        indentWithTabs: true
      }
    );
    window.addEventListener("resize", this.autodivheight);
    this.submitTryit();
  }

/**移除resize方法 */
  componentWillUnmount(){
    window.removeEventListener("resize", this.autodivheight);
  }
  /**
    * 提交我们的代码进行进一步的处理，实现iframe的preview
    */
  submitTryit = () => {
    let text = this.editor.getValue();
    const patternHtml = /<html[^>]*>((.|[\n\r])*)<\/html>/im;
    const patternHead = /<head[^>]*>((.|[\n\r])*)<\/head>/im;
    const array_matches_head = patternHead.exec(text);
    const patternBody = /<body[^>]*>((.|[\n\r])*)<\/body>/im;
    const array_matches_body = patternBody.exec(text);
    const basepath_flag = 1;
    const basepath = "";
    if (array_matches_head) {
      text = text.replace("<head>", "<head>" + basepath);
    } else if (patternHtml) {
      text = text.replace("<html>", "<head>" + basepath + "</head>");
    } else if (array_matches_body) {
      text = text.replace("<body>", "<body>" + basepath);
    } else {
      text = basepath + text;
    }
    console.log("text===", text);
    const ifr = document.createElement("iframe");
    ifr.setAttribute("frameborder", "0");
    ifr.setAttribute("id", "iframeResult");
    document.getElementById("iframewrapper").innerHTML = "";
    document.getElementById("iframewrapper").appendChild(ifr);
    //将我们的结果iframe放到我们需要的地方
    const ifrw = ifr.contentWindow
      ? ifr.contentWindow
      : ifr.contentDocument.document
        ? ifr.contentDocument.document
        : ifr.contentDocument;
    //向我们的iframe中写入我们处理好的text内容
    ifrw.document.open();
    ifrw.document.write(text);
    ifrw.document.close();
    this.autodivheight();
  };
  render(){
    return (
       <textarea
         // id={`textareaCode${this.props.index}`}
          id="textareaCode"
          name="textareaCode"
          style={{ width: "100%" }}
        >
        )
  }
```
假如这个页面实例化了多个Demo组件，那么页面就会存在多个id为*textareaCode*的元素，此时会出现意想不到的结果，所以我们id可以设置为如下内容:
```js
id={`textareaCode${this.props.index}`}
```
这样整个页面中就不会存在id相同的组件了。

#### 2.textarea使用如下方式不会更新数据
问题：在react组件的render方法中，如果有如下代码:
```js
render(){
   const variable ="blablabla";
   <textarea
  id={`textareaCode${this.props.index}`}
  name="textareaCode"
  style={{ width: "100%", display: "none" }}
  defaultValue={variable}
 \/>
}
```
按道理说，每次组件重新渲染都会导致textarea里面的内容变化，但是实际上并不会。所以我们应该关注react中*受控组件*的概念:
```js
render(){
   <textarea
  id={`textareaCode${this.props.index}`}
  name="textareaCode"
  style={{ width: "100%", display: "none" }}
  defaultValue={this.state.html}
 \/>
}
```

