import React from "react";
import ThemedText from "./ThemeText.js";

export default class TodoList extends React.PureComponent {
  render() {
    return (<ul>
      {this.props.todos.map(todo =>
        <li key={todo}><ThemedText>{todo}</ThemedText></li>
      )}
    </ul>)
  }
}
