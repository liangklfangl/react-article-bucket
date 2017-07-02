### 代码运行

```js
sudo npm install webpackcc -g
npm install 
npm run dev
```

### 依然是React.PureComponent
和存在[问题的例子](../Context-Problematic/readme.md)相比，这里的TodoList组件依然是PureComponent类型：

```js
import React from "react";
import ThemedText from "./ThemeText.js";
export default class TodoList extends React.PureComponent {
  render() {
    return (<ul>
      {this.props.todos.map(todo =>
        <li key={todo}><ThemedText>{todo}<\/ThemedText><\/li>
      )}
    <\/ul>)
  }
}
```

但是我们的`Provider`不再是简单的只是将其自身的props放在context中那么简单了,其相当于自己维护了一个小型的事件系统:

```js
import React from "react";
import Theme from "./Theme.js";
export default class ThemeProvider extends React.Component {
  constructor(s, c) {
    super(s, c)
    this.theme = new Theme(this.props.color)
  }
  /**
   * 这个方法组件的shouldComponentUpdate之前肯定是被调用的，所以我们的这个内置的Theme
   * 对象肯定可以接收到下一个状态的color
   */
  componentWillReceiveProps(next) {
    this.theme.setColor(next.color)
  }
  //传入到子组件中的是theme而不是我们的color属性
  getChildContext() {
    return {theme: this.theme}
  }
  render() {
    return <div>{this.props.children}<\/div>
  }
}
//放到子组件中的是theme
ThemeProvider.childContextTypes = {
  theme: React.PropTypes.object
}
```
在我们的`Provider`中，我们放置到context中的，也不再是简单的接受到的props属性了，而是我们的事件系统实例对象。每次我们的Provider的props发生变化以后，我们会直接通知事件系统，要求事件系统进行处理，此处就是通过调用setColor完成。

```js
 componentWillReceiveProps(next) {
    this.theme.setColor(next.color)
  }
```
我们看看这里的Theme组件的真实面目：

```js
export default class Theme {
  // this.theme = new Theme(this.props.color)
  constructor(color) {
    this.color = color
    this.subscriptions = []
  }
 /*
  *每次setColor的时候将我们的subscription中的所有的函数都调用一遍，常用于重新渲染组件树
  */
  setColor(color) {
    this.color = color
    this.subscriptions.forEach(f => f())
  }
  /**
   * 调用subscribe方法来push一个函数用于执行
   */
  subscribe(f) {
    this.subscriptions.push(f)
  }
}
```
此处很显然，就像我们说的，我们的`Provider`不再是简单的将props放到context中了，而是将一个事件系统放在context中。

(1)首先：对于想接受到事件的组件来说，其必须订阅事件(pub-sub模式)，而订阅事件的时机就在于组件挂载以后，所以组件更新的时候也能接受到事件

```js
import React from "react";
export default class ThemedText extends React.Component {
    /**
     * 在我们的所有的子组件中，我们通过conext获取到的是theme的值，同时在componentDidMount
     * 中我们会获取到theme然后注册我们的事件，并且强制组件更新
     */
  componentDidMount() {
    this.context.theme.subscribe(() => this.forceUpdate())
  }
  render() {
    return <div style={{color: this.context.theme.color}}>
      {this.props.children}
    <\/div>
  }
}
ThemedText.contextTypes = {
  theme: React.PropTypes.object
}
```

(2)然后：当我们的`Provider`接受到新的属性以后，我们必须将订阅了该事件的所有的组件都通知一遍，而这在Provider的componentWillReceiveProps周期函数中进行处理。

```js
componentWillReceiveProps(next) {
    this.theme.setColor(next.color)
  }
```
自此，一个PureComponent由于state/props没有发生变化，而不重新渲染的问题就解决了。

### 说明
该例子说明了当我们的组件是React.PureComponent的情况下，由于state/props没有发生变化，从而组件本身以及所有的子组件接受不到context更新的情况。其解决方案就是:我们的Provider不再仅仅将其自身的props放入到context中，而是将一个小型的事件系统放到context中，对于那些想要接受到context更新的组件来说，其必须`订阅`context的更新事件，而context的更新事件的触发在我们的Provider的componentWillReceiveProps周期函数中，也就是说我们的Provider的props只要发生了变化，那些订阅了context变化的组件都会更新。

