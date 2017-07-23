### 1.DragLayer
在大多数情况下，我们的HTML5 backend的默认渲染方式已经足够了。但是，它的渲染方式存在诸多的限制。例如，它必须是一个`已经存在的节点的或者图片`，而且在`中途也是无法改变`的。

有时候，你可能想要执行自定义的渲染。这当你使用自定义的backend的时候也是必须的。`DragLayer`允许你设置拖拽时候的预览效果，只要你自己指定React组件就可以了。他是一个高阶组件，你只需要为他指定一个必须的参数，这个参数在下面会细说。为了使用`DragLayer`，你要将你的顶层的组件使用`DragDropContext`包裹。

使用`DragLayer`的时候要注意，如果在第一次调用的时候指定其所有的参数，那么以后调用的时候只需要传入你的组件class就可以了，即只需要传入一个参数。我们的`DragLayer`也可以作为ES7的decorator使用。如下面的代码:

```js
import { DragLayer } from 'react-dnd';
@DragLayer(collect)
export default class CustomDragLayer {
  /* ... */
}
```
下面给出DragLayer的一种用法:

```js
@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
```
你可以查看[customDragLayer](./customDrayLayer/readme.md)

#### 2.DragLayer参数

- collect
  该参数是必须的，它应该返回一个js对象，该对象会作为props注入到你的组件中。它接受一个唯一的`monitor`参数

- options
 可选的参数。是一个js对象，如果传递给你的组件的props不是原始值(primitive，基本类型)或者函数，你可以在这个对象指定一个自定义的`arePropsEqual(props, otherProps)`属性来提升性能。这当你的应用存在性能问题的时候才能用到。

#### 3.collect方法
该函数的签名和`DragSource`和`DropTarge`是一样的，但是他没有`connect`参数，因为`DragLayer`本身是不可以交互的，而仅仅是`用于反应拖动的状态`的。collect方法在每次全局拖动状态改变的时候调用，包括坐标的改变，这样你的组件就可以提供一个及时的自定义的拖动效果。你可以通过`monitor`来获取被拖动对象的坐标。collect方法有以下参数：

- monitor
  他是一个`DragLayerMonitor`实例，你可以通过这个对象来获取当前的拖动对象的状态，包括坐标。

#### 4.DragLayer返回值
`DragLayer`包裹你的组件从而可以返回一个新的组件。其静态方法如下:

- DecoratedComponent
  返回被包裹的组件类型

实例方法如下:

- getDecoratedComponentInstance
  该方法返回一个被包裹的组件实例。

#### 5.DragLayer实例
```js
import React from 'react';
import PropTypes from 'prop-types';
import ItemTypes from './ItemTypes';
import BoxDragPreview from './BoxDragPreview';
import { DragLayer } from 'react-dnd';
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%'
};
function getItemStyles(props) {
  const { currentOffset } = props;
  if (!currentOffset) {
    return {
      display: 'none'
    };
  }

  const { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform: transform,
    WebkitTransform: transform
  };
}

@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging()
}))
export default class CustomDragLayer {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    isDragging: PropTypes.bool.isRequired
  };

  renderItem(type, item) {
    switch (type) {
    case ItemTypes.BOX:
      return (
        <BoxDragPreview title={item.title} \/>
      );
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    if (!isDragging) {
      return null;
    }

    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}
```


