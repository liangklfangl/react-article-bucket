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
    </div>
  }
}
ThemedText.contextTypes = {
  theme: React.PropTypes.object
}
