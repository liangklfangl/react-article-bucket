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
    return <div>{this.props.children}</div>
  }
}
//Add color props to context
ThemeProvider.childContextTypes = {
  color: React.PropTypes.string
}
