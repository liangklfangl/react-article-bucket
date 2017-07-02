import React from "react";
export default class Button extends React.Component {

//1. If contextTypes is not defined, then context will be an empty Object
//   such as Message component
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}
//这里我们的Button组件如果需要获取到context中的属性，我们可以通过指定contextTypes就可以了
//这是很容易的事情
Button.contextTypes = {
  color: React.PropTypes.string
};
