import React from "react";
import ReactDOM from "react-dom";
import ThemeProvider from "./ThemeProvider.js";
import ThemedText from "./ThemeText.js";
import TodoList from  "./TodoList.js";
const TODOS = ["Get coffee", "Eat cookies"]

export default class App extends React.Component {
  constructor(p, c) {
    super(p, c)
    this.state = { color: "blue" };
    this.markColor = this.makeRed.bind(this);
  }
  render() {
    return (
           <ThemeProvider color={this.state.color}>
               {/*
                  （1）ThemeProvider将color这个props放到context中，不过不是直接放进去
                       而是采用一种更加优雅的方式来完成
                  （2）在ThemeProvider中传递给子组件的不再是color，而是一个依赖注入系统
                       然后所有需要接收到Context更新的组件全部subscribe这个事件即可
                  （3）TodoList我们依然使用的是React.PureComponent，但是其下面的ThemedText
                       组件却可以接收到我们的ThemeProvider的context更新(前提TodoList本身prop/state没有改变)
                  （4）这个事件系统的实现有点简单，我们需要在componentWillUnMount中取消
                        事件监听，同时应该使用setState而不是forceUpdate让组件更新
               */}
		      <button onClick={this.markColor}>
		      	<ThemedText>Red please!</ThemedText>
		      </button>
		      <TodoList todos={TODOS} />
		    </ThemeProvider>
    	)
  }

  makeRed() {
    this.setState({ color: "red" })
  }
}

ReactDOM.render(<App/>,document.querySelector('#react-content'));




ReactDOM.render(
  <App />,
  document.getElementById("react-content")
)
