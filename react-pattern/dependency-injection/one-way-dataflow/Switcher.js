import React from "react";

export default class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this._onButtonClick = e => {
      this.props.changeStatus("open",!this.props.value);
    }
  }
  render() {
    return (
      <button onClick={ this._onButtonClick }>
        { this.props.value ? 'lights on' : 'lights off' }
      </button>
    );
  }
}
