### React.PureComponent带来的问题
展示context不正常的情况。即展示如下的几个问题：

（1）当点击按钮的时候，按钮本身颜色发生变化，但是TodoList这个组件没有变化，因为它
   继承了React.PureComponent，所以组件的props/state没有发生变化，那么组件不会重新渲染。
   因此，我们的TodoList里面的所有的组件颜色都不会发生变化，因为shouldComponentUpdate
   返回了false!!!!因此不管是TodoList还是他的子组件都不会更新。只要将它修改为普通的Component即可

（2）更加糟糕的是，我们也不能在TodoList中手动实现shouldComponentUpdate,因为SCU根本
    就不会接收到context数据(只有当它的state或者props修改了才能接收到)。
                 
(3)因此，shouldComponentUpdate如果返回false，那么所有的子组件都不会接收到context的
   更新。如这里的TodoList组件返回了false,那么TodoList下所有的ThemedText从context中获取
   到的color都不会更新，这很重要!!!!

问题提示：当你点击按钮，导致App组件的state发生变化，从而ThemeProvider重新渲染的同时(SCU返回true)，放置到context中的数据也同步更新了，从而导致ThemeProvider被重新渲染了。而对于ThemedText，以及button >ThemedText来说，其SCU默认返回true,所以肯定会更新。所以ThemedText可以获取到ThemeProvider更新后的context数据。而我们的TodoList是React.PureComponent，所以只有当props发生变化的时候才会重新渲染，而不管你点击按钮与否，我们的TodoList的props并没有发生变化，所以不会重新渲染。但是，当你将React.PureComponent修改为React.Component以后，当你点击按钮后，我们TodoList >ul>li>ThemeText也会变为红色! 关于两者的区别你可以查看[在React.js中使用PureComponent的重要性和使用方式](http://www.open-open.com/lib/view/1484466792204)。其中PureComponent只有在组件的state或者props发生变化以后才会调用render方法，从而能够提升性能。

### 运行

```js
sudo npm install webpackcc -g
npm install 
npm run dev
```

### 我们通过定义Provider从而将特定的属性放在context中
如下面的例子就是使用了context，子组件通过定义contextType就可以获取到该组件放置到context中的属性，其中react-redux也是同样的做法。

```js
import React from "react";
/**
 * 这个ThemeProvider组件就是简单的将属性放到context中
 */
export default class ThemeProvider extends React.Component {
 //Will invoke when state or props change!
  getChildContext() {
    return {color: this.props.color}
  }
  render() {
    return <div>{this.props.children}<、/div>
  }
}
//Add color props to context
ThemeProvider.childContextTypes = {
  color: React.PropTypes.string
}
```
下面我们看看如何使用了这个Provider组件:

```js
const TODOS = ["Get coffee", "Eat cookies"];
import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "./ThemeProvider.js";
import ThemedText from './ThemeText.js';
import TodoList from "./TodoList.js";
export default class App extends React.Component {
  constructor(p, c) {
    super(p, c)
    this.state = { color: "blue" }
  }
  render() {
    return (
         <ThemeProvider color={this.state.color}>
              <button onClick={this.makeRed.bind(this)}>
                <ThemedText>Red please!</ThemedText>
              </button>
              <TodoList todos={TODOS} />
        </ThemeProvider>
        )
  }
  //rewrite color attr in state
  makeRed() {
    this.setState({ color: "red" })
  }
}
ReactDOM.render(
  <App />,
  document.getElementById("react-content")
)
```
通过上面的组件树我们来看看ThemeText和TodoList组件，首先来看看ThemeText组件:

```js
import React from "react";
export default class ThemedText extends React.Component {
  render() {
    return <div style={{color: this.context.color}}>
      {this.props.children}
    <\/div>
  }
}
//Will get color prop from parent Component context
ThemedText.contextTypes = {
  color: React.PropTypes.string
}
```
所以我们的ThemeText组件也只是希望通过定义`contextTypes`来访问ThemeProvider在context中放置的color属性。我们接下来看看TodoList组件:

```js
import React from "react";
import ThemedText from "./ThemeText.js";
export default class TodoList extends React.PureComponent {
  render() {
    return (<ul>
      {this.props.todos.map(todo =>
        <li key={todo}><ThemedText>{todo}</ThemedText></li>
      )}
    <\/ul>)
  }
}
```
我们的TodoList组件也是直接使用了ThemedText组件，所以我们的组件树结构是如下的:

<pre>
App
  ThemeProvider
    button
      ThemeText
    TodoList
      ul 
        li
          ThemedText
</pre>



参考资料:

[在React.js中使用PureComponent的重要性和使用方式](http://www.open-open.com/lib/view/1484466792204)

[React PureComponent 源码解析](https://segmentfault.com/a/1190000006741060)
