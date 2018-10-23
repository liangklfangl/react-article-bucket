### 1.验证码使用rax-button老是折行
```js
 <Touchable style={styles.countDownBox}>
    <Button>
      {this.state.isCountingDown &&
        this.state.currentCountingDownNum}秒后重新获取!
    </Button>
</Touchable>
```
此时动态产生的this.state.currentCountingDownNum将会和后面的"秒后重新获取!"文案分布在两行，可以采用rax-text来替换rax-button,同时去掉Touchable。
```js
<Text>
    {this.state.isCountingDown &&
      this.state.currentCountingDownNum}秒后重新获取!
<\/Text>
```

### 2.rax-modal不能指定key
即你指定了key，而且两次的key不一样的情况下，遇到一个问题:上一次visible为false，后一次visible为true,但是弹窗就是没有展示。看到rax-modal的源码:
```js
componentWillReceiveProps(nextProps) {
    if (
      nextProps.visible != this.props.visible &&
      nextProps.visible != this.state.visible
    ) {
      this.toggle(nextProps.visible);
    }
  }
```
应该是后面的判断导致的nextProps.visible != this.state.visible。本次直接不指定key！

### 3.rax-toast不做节流的问题
rax-toast本身不做节流，即节流并不在内部实现，同时也没有开放出API提供Toast的隐藏功能，所以可以采用如下通用的节流方案来完成:
```js
 const HEART_BEAT = 300;
  /**
   * 节流显示toast
   */
  showToast = text => {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Toast.show(text);
    }, HEART_BEAT);
  };
```

### 4.rax中函数减少使用bind或者render中的匿名函数
我们一般都会在render里面使用匿名函数:
```js
 <Button
    style={styles.immediateGet}
    onPress={()=>{this.getPrizeImmediate(prize)}}>
    {displayText}
<\/Button>
```
此时onPress句柄在每次render的时候都会是一个全新的函数，可以通过如下的方式来解决:
```js
getPrizeImmediate=(prize)=>{
  return ()=>{
    prize
    // blala
  }
}
```

``js
<Button
    style={styles.immediateGet}
    onPress={this.getPrizeImmediate(prize)}>
    {displayText}
<\/Button>
```

上面这种方法来自于[React/Rax 解决绑定事件的参数传递问题](http://www.ptbird.cn/rax-event-bind-params.html)这个文章，越想越不对劲，这不明显和bind是一样的嘛，两次调用返回的明显就是不同的，**dog shit**!实例如下:
```jsx
class Text extends React.Component{
  constructor(props){
   super(props);
   this.initalBindTest = this.bindTest();
   this.state = {
     name:'覃亮'
   };
  }
  bindTest=()=>{
    return ()=>{
    console.log(1);
    this.setState({
      name:Math.random()+"罄天"
    });
  }
  }
  render(){
    console.log('this.bindTest()===',this.bindTest()===this.bindTest());
    //两次调用引用都不一样
     console.log('this.bindTest()===',this.bindTest()===this.initalBindTest));
    return <div style={{height:'100px',border:'1px dashed pink'}}>
    我的名字叫{this.state.name}
    <button onClick={this.bindTest()}>点击我重新渲染</button>
  </div>
  }
}
ReactDOM.render(
  <Text/>,
  document.getElementById('example')
);
```

### 5.rax中内联style和外联style共存
```js
import styles from "./universalcallup.less";
<Div style={[styles.cardContainer, this.props.style ? this.props.style : {}]}
>
<\/Div>
```
其中styles是我自己写的less文件，而后面this.props.style就是外部传入的内联style样式!

### 6.rax中根据外部容器自适应宽度
这个使用rax的Grid布局就行了:
```js
import { Row, Col } from 'rax-grid';
<Row style={styles.rowBox}>
  <Col
    style={{
      flex: 92,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
  <\/Col>
  <Col style={{ flex: 204 }}>
  <\/Col>
  <Col
    style={{
      flex: 79,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
  <\/Col>
<\/Row>
```
其中flex的值是根据设计稿计算出来的!

### 7.rax的元素宽度没有自动设置为外层元素宽度
这是因为你使用了flex布局，flex布局的**"包裹性"**使得宽度自动设置为内容的宽度。所以使用上面的rax-grid就能解决问题!

### 8.rax的文字一行放不下直接换行
```css
.awardName {
  width: 180;
  font-size: 24;
  font-weight: bold;
  color: #333333;
  flex-basis: auto;
}
```
可以参考[这里](https://blog.csdn.net/qq_38334525/article/details/78443944),不要加固定的高度+不要加white-space:no-wrap。

### 9.rax的文字设置font-size不生效
```css
.actionText {
  font-size: 20;
  text-align: center;
  /*rax-text的text-align:center是可以居中对齐的*/
  color: #ff5c35;
  font-weight: bold;
}
```
文字样式**必须设置到rax-text上**:
```js
 <Text style={styles.actionText}>{displayText}<\/Text>
```

### 10.rax的图片不展示
```css
.closeIcon {
  align-items: center;
  justify-content: center;
  width: 30;
  height: 26;
  position: relative;
  left: 10;
  top: 12;
}
```
rax中图片必须设置宽度和高度才行,包括icon和picture。

### 11.rax中使用base64作为图片
```js
 <Image
  style={[{ width: 12, height: 18 }, styles.img]}
  source={{
    uri:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAASCAYAAABvqT8MAAAABGdBTUEAALGPC/xhBQAAASpJREFUKBV9kj1SwzAQhXdFRUvLUHKHOAUXYYjdkNDwkw64ACRNyAwzTEIRJxyEzj4Dl4CSTstbycIjbCGPJe3u97RPHhM1Q0bZoeSD0xCnVqMFmWb7xPJOQm8QTlKw5p2AF/U3ts+IGfIXyYfjlAhAOwBekdglMkJsLnhbrduq30UCTcHSNeYn3faJOoKOyJgJl9Wr5nW4O/htO/OuXpLhKTJM1q6kGJ6Ham+HUJQiuyErC8RCTad/BSqMRETjXkuhg1tZvlSHl/Ec7EXFP4Hk2QjoBmkcbG5xt3nSkoNJNurew9VMz+u1FMGG73jnYRV0LOETnsFy6U5WuKwfFQwjsuRgsUlYRb8dIpj5nrfxyVEH93t/ygdsHJGHHwKQXKU4OZZicJkEmsIPZil2E0PFItUAAAAASUVORK5CYII="
  }}
/>
```
下图片可以使用这种base64的方式来减少http请求次数。

### 12.rax中不支持背景图的解决方法
```js
<Div style={[this.props.style]}>
    <Image
      source={{
        uri: "//gw.alicdn.com/tfs/TB1Yi.xjSzqK1RjSZPxXXc4tVXa-400-120.png"
      }}
      style={[
        styles.cardContainer,
        { position: "absolute", width: 400, height: 120 },
        this.props.style
        //接受外层的style可以作为它的宽度和高度，这样可以完全填充高度和宽度
      ]}
    />
    <Div
      style={[
        styles.cardContainer,
        this.props.style ? this.props.style : {}
      ]}
    >
   <\/Div>
<\/Div>
```
这样外层传入的this.props.style可以**同时作为外层容器**和除了Image以外的包裹容器，而Image本身作为了背景图。此处image本身采用的absolute处理即可。

### 13.rax中自适应宽度的组件开发
首先采用rax-grid将页面分成不同的区块,充分利用col的flex属性:
```js
import { Row, Col } from "rax-grid";
```
然后采用flex布局的时候不要想着用padding什么来填充宽度，而是充分利用flex布局来居中元素达到自适应的效果，这是基于设计稿一般都是对称的!



参考资料:

[React/Rax 解决绑定事件的参数传递问题](http://www.ptbird.cn/rax-event-bind-params.html)
