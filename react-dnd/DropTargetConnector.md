### 1.DropTargetConnector
`DropTargetConnector`会作为参数传入DragTarget的collect方法。它的唯一方法`dropTarget()`可以用于将组件的某一个DOM节点赋予DropTarget的功能。

### 2.DropTargetConnector's方法
你可以在collect方法中调用DropTargetConnector的`dropTarget()`方法。这个函数的返回值作为props传入到你的组件。你可以在`render`和`componentDidMount`方法中将某一个节点指定为可以处理drop事件的元素。它的内部机制就是通过将你传入的组件赋予一个`ref`属性。这个回调会将你的DOM节点连接到拖拽的backend.

- dropTarget() => (elementOrNode)
  返回一个函数用于在组件内部调用从而将一个节点设置`DropTarget`角色。通过在你的collect方法中返回如下的内容:

```js
{ connectDropTarget: connect.dropTarget() }
```
你可以将任何React元素设置为可以放置拖拽元素的。为了实现这个效果，你可以在在render方法中按照如下方式使用:

```js
 this.props.connectDropTarget(element) 
```

### DragTargetConnector实例
```js
import React from 'react';
import { DropTarget } from 'react-dnd';

/* ... */

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

@DropTarget(/* ... */)
export default class DropZone {
  render() {
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div>
        You can drop here!
      </div>
    );
  }
}
```
