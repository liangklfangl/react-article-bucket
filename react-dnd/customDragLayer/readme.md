### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 简单说明
浏览器的API没有提供方法能够在拖动开始以后修改`DragPreview`。以前的jQuery UI从头开始实现了拖拽，但是react-dnd目前本身仅仅支持浏览器的拖动`backend`，这是他的一些限制。

但是，如果我们给`DragPreview`一个空的image，那么我们能够很大程度上定制化我们的拖动行为。我们的react-dnd提供了一个`DragLayer`来在你的顶层组件上实现一个固定的层级，在这层级上你可以使用你自己的拖动的预览组件。

如果你想要，我们可以在`DragLayer`这一层使用完全不同的组件。

### 例子详解
有以下几点需要注意：

(1)使用一个空的image作为`DragPreview`,因此浏览器不会绘制DragPreview，所以我们可以在自定义的DragLayer中任意绘制DragPreview

```js
import { getEmptyImage } from 'react-dnd-html5-backend';
componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    // (1)使用一个空的image作为DragPreview,因此浏览器不会绘制DragPreview，所以我们可以在
    // 自定义的DragLayer中任意绘制DragPreview
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      // IE兼容
      captureDraggingState: true,
    });
  }
```

(2)IE兼容：当我们拖动的时候我们使用css来隐藏我们真实的DOM节点，因为IE会忽略掉我们DragPreview中空的image节点

```js
function getStyles(props) {
  const { left, top, isDragging } = props;
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    // (6)IE兼容：当我们拖动的时候我们使用css来隐藏我们真实的DOM节点，因为IE会忽略掉我们DragPreview中空的image节点
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  };
}
```

(3)使用自定义的@DragLayer装饰器来生成自己的DragLayer

```js
@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
```

