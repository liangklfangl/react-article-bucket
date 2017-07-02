import React from "react";
export default class ThemedText extends React.Component {
  render() {
    return <div style={{color: this.context.color}}>
      {this.props.children}
    </div>
  }
}
//Will get color prop from parent Component context
ThemedText.contextTypes = {
  color: React.PropTypes.string
}

