#### 前言
这部分主要写一些自己在编码过程中逐渐悟到应该使用设计模式的部分。欢迎star,issue。

#### 1.渲染回调模式
假如react-dnd需要要实现拖拽文案的时候也可以实现拖拽图片，那么就需要把渲染jsx的方法提供给子级组件去调用。比如下面的方法:
```js
<DraggableItem
    dataSource={dataSource}
    contentStyle={{}}
    style={{ margin: 0, padding: 0 }}
    onChange={data => {
        console.log("onChange被调用", data);
    }}
    >
    {/* 关键代码 */}
    {item => {
        return (
        <div
            style={{
            display: "inline-block",
            width: "200px",
            height: "200px"
            }}
        >
            <img style={{ width: "100%", height: "100%" }} src={item.img} />
        </div>
        );
    }}
</DraggableItem>
```
而在DraggableItem组件内部可以通过this.props.children调用该方法从而实现组件使用者自定义jsx：
```js
<div style={this.props.style}>
{dataSource.map((card, i) => (
    <Item
    contentStyle={this.props.contentStyle || {}}
    key={"universal__item--" + i}
    moveItem={this.moveCard}
    index={i}
    id={card}
    >
    {/* 关键代码  */}
    {this.props.children(card)}
    </Item>
))}
</div>
```
而下面是结合了渲染回调和React16.x的context的**稍微复杂点的例子**:
```js
const defaultTheme = {
  background: 'white',
  color: 'black',
};
const fooTheme = {
  background: 'red',
  color: 'green',
}
const ThemeContext = createReactContext(defaultTheme);
```
下面是Provider的代码:
```js
class ThemeProvider extends React.Component {
  state = {
    theme: defaultTheme
  }
  render() {
    return (
      <ThemeContext.Provider value={this.state.theme}>
        <Content/>
        <div>
          <button onClick={() => {
            this.setState(state => ({
              theme: state.theme === defaultTheme ? fooTheme : defaultTheme
            }))
          }}>
            Toggle Theme
          </button>
        </div>
      </ThemeContext.Provider>
    );
  }
}
```
而Consumer的部分如下:
```js
const Banner = ({theme}) => {
  return (<div style={theme}>Welcome!</div>);
};
const Content = () => (
  <ThemeContext.Consumer>
    {
      context => {
        return <Banner theme={context} />
      }
    }
  </ThemeContext.Consumer>
);
```
而ThemeContext.Consumer内部就是使用的渲染回调，该组件会接受到context，然后可以将context传递到子级组件中。



#### 2.列表中所有Item依赖于接口全局变量
比如有一个列表，列表中每一个组件的渲染都依赖于全局变量，而且这种全局变量的获取是依赖于接口的，此时可以通过如下方式解决:
```js
import React, { Component } from 'react';
import EventProxy from "eventProxy";
window.data = [];
// js执行到这个位置的时候就请求，只会执行一次
//全局的
getVariables.then(data => {
  window.data = data;
  EventProxy.trigger('variableReceived', data);
});

class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 赋值
      data: window.data
    };
    if (window.data.length === 0) {
      // 若还没请求，则添加监听来等待数据
      EventProxy.on('variableReceived', data => {
        this.setState({
          data
        });
      });
    }
  }
  render() {
    return <div />;
  }
}
export default Item;
```




参考资料:

[React 16.3新的Context API真的那么好吗？](https://blog.csdn.net/qq_33150267/article/details/79823993)

[Context](https://reactjs.org/docs/context.html#contextprovider)