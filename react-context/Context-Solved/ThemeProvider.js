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
    return <div>{this.props.children}</div>
  }
}
//放到子组件中的是theme
ThemeProvider.childContextTypes = {
  theme: React.PropTypes.object
}
