const TODOS = ["Get coffee", "Eat cookies"];
import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "./ThemeProvider.js";
import ThemedText from './ThemeText.js';
import TodoList from "./TodoList.js";
export default class App extends React.Component {
  constructor(p, c) {
    super(p, c)
    this.state = { color: "blue" };
    this.makemeRed = this.makeRed.bind(this);
  }
  render() {
    return (
    	 <ThemeProvider color={this.state.color}>
         {/*ThemeProvider将color放到context中，从而希望下面所有的组件都能够直接通过contextType的声明来获取该color的值*/}
		      <button onClick={this.makemeRed}>
		         {/*ThemedText通过this.context.color获取到父组件的color属性设置style*/}
		      	<ThemedText>Red please!</ThemedText>
		      </button>
		       {/*ThemedText内部全部产生的ThemeText组件，从this.context.color获取到父组件的color属性设置style*/}
		      <TodoList todos={TODOS} />
		      {/*
                （1）当点击按钮的时候，按钮本身颜色发生变化，但是TodoList这个组件没有变化，因为它
                继承了React.PureComponent，所以组件的props没有发生变化，那么组件不会重新渲染。
                因此，我们的TodoList里面的所有的组件颜色都不会发生变化，因为shouldComponentUpdate
                返回了false!!!!因此不管是TodoList还是他的子组件都不会更新
                （2）更加糟糕的是，我们也不能在TodoList中手动实现shouldComponentUpdate,因为SCU根本
                     就不会接收到context数据(只有当它的state或者props修改了才能接收到)。
                 (3)因此，shouldComponentUpdate如果返回false，那么所有的子组件都不会接收到context的
                   更新。如这里的TodoList组件返回了false,那么TodoList下所有的ThemedText从context中获取
                   到的color都不会更新，这很重要!!!!
		       */}
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
