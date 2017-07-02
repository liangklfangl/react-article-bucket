import React from "react";
import ReactDOM from "react-dom";
const messages = [{text:'hello'},{text:'world'}];
import Message from "./Message.js";
export default class MessageList extends React.Component {
//(2)Add getChildContext
 getChildContext() {
    return {color: "red"};
  }
  render() {
    const color = "purple";
    //[{text:'hello'},{text:‘world’}]
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}
//(1)Add MessageList.childContextTypes
MessageList.childContextTypes = {
  color: React.PropTypes.string
};

ReactDOM.render(<MessageList messages={messages}/>,document.querySelector('#react-content'));
