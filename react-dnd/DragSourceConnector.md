### 1.DragSourceConnector
`DragSourceConnector`会作为传入`DragSource`的collect方法的一个参数。该方法会返回一个函数，该函数允许你为组件的节点指定特定的角色。

### 2.DragSourceConnector方法
在`collect`方法中调用`DragSourceConnector`的方法，这个方法的返回值函数会被作为props传入到你的组件中。你可以在`render`或者`componentDidMount`中使用它来判断DOM节点的角色。其内部的工作原理是：为我们的React的元素指定一个ref回调，这些回调会将你的组件的DOM节点连接到指定的拖拽backend。

- dragSource() => (elementOrNode, options?)
  返回一个函数，这个函数在组件的内部必须被调用，其会将组件内部的特定的Node节点设置为DragSource角色。通过在你的`collect`方法中返回` connectDragSource: connect.dragSource() }`，你可以将任何React元素设置为可以被拖拽的节点。为了达到这样的效果，在render函数内容使用`this.props.connectDragSource(element)`来完成

- dragPreview() => (elementOrNode, options?)
  该参数可选。其返回值为一个函数，在组件内部会被调用，其可以将一个指定的节点设置preview角色。通过在collect方法中返回`{ connectDragPreview: connect.dragPreview() } `，你可以给任何节点设置preview角色。为了达到这样的效果，在组件的render函数中使用`this.props.connectDragPreview(element)`来包裹你的元素。具有preview角色的节点指的是，当拖动开始的时候HTML5 backend应该显示的值。例如，你想要让一个元素可以被拖拽，同时具有一个自定义的处理函数，你可以将这个处理函数设置为`dragSource()`，同时将一个外部的更大一点的组件设置为`dragPreview()`。这样，大的preview节点将会显示在屏幕上，但是实际上只有一个小的DragSource是可以被拖拽的。另外一个可能的设置就是，在componentDidMout中将一个Image实例传递给`dragPreview`,这样你就可以使用真实的图片作为拖拽preview了。

### 2.DragSourceConnector选项
connector方法返回的函数可以接受参数。他们需要传递到组件的内部，例如：

```js
this.props.connectDragSource(<div>...<\/div>, { dropEffect: 'copy' })
```
下面描述的这些options配置都是HTML backend原生支持的，但是三方类库或者自定义的backend不一定支持。

#### 2.1 dragSource配置
- dropEffect
  这个参数是可选的。默认情况下是`move`，在支持这个特性的浏览中，如果你指定了`copy`那么会显示一个复制的图标，而配置了`move`的时候会显示move效果的图标。你可以使用这个方法给用户一个提示消息

#### 2.2 dragPreview配置
- captureDraggingState
  这个参数可选。是一个布尔值，默认情况下是false，如果设置为true，那么组件在拖动开始的时候会立刻做出反应而不是等待一小会。这也意味着屏幕上能产生特定的效果，而且`monitor.isDragging()`也会被设置为true。如果你为某些元素设置了样式，例如为拖动的元素设置了opacity透明度的变化，那么opacity的变化也会立刻显示在屏幕上。这样也意味着，这种情况会很少需要，因为false是默认的值。但是有些情况下，你必须设置为true，例如在IE中你想要你自己的DragLayer生效，而且不想要通过设置一个空的DragPreview来隐藏元素
- anchorX
  该参数可选。取值在[0,1]之间，默认是0.5。该参数用于指定当拖动的元素和DragPreview大小不一致的时候，拖动元素相对于DragPreview的横向的移动量。0表示将DragPreview设置在左侧，0.5在中间，而1表示将DragPreview放在右侧
- anchorY
  可选，值在[0,1]之间，默认是0.5。该参数用于指定当拖动的元素和DragPreview大小不一致的时候，拖动元素相对于DragPreview的纵向的移动量。0表示将DragPreview放在顶部，而1表示放在底部，0.5表示置于中间。

### 3.DragSourceConnector的例子
```js
import React from 'react';
import { DragSource } from 'react-dnd';

/* ... */

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview()
  };
}

@DragSource(/* ... */)
class ComponentWithCopyEffect {
  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(
      <div>
        This div shows a plus icon in some browsers.
      <\/div>,
      { dropEffect: 'copy' }
    );
  }
});

@DragSource(/* ... */)
class ComponentWithHandle {
  render() {
    const { connectDragSource, connectDragPreview } = this.props;

    return connectDragPreview(
      <div>
        This div is draggable by a handle!
        {connectDragSource(
          <div>drag me</div>
        )}
      <\/div>
    );
  }
}

@DragSource(/* ... */)
class ComponentWithImagePreview {
  componentDidMount() {
    const { connectDragPreview } = this.props;

    const img = new Image();
    img.src = 'http://mysite.com/image.jpg';
    img.onload = () => connectDragPreview(img);
  }

  render() {
    const { connectDragSource } = this.props;

    return connectDragSource(
      <div>
        This div shows an image when dragged!
      <\/div>
    );
  }
}
```

