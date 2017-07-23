### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子总结
你会发现移动元素的时候其实就是通过setState来替换每一个Card的位置而已。

```js
moveCard(id, atIndex) {
    const { card, index } = this.findCard(id);
    //找到被拖动的Card的属性，如：
    // {
    //   id: 4,
    //   text: 'Create some examples',
    // }
   //以及该card在this.state.cards中的下标值
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1],
          //首先删除我们的DragSource，同时在我们DragTarget前面插入我们的DragSource
          [atIndex, 0, card],
        ],
      },
    }));
  }
```
同时你要注意，我们将Card被设置为了`DragSource`和`DropTarget`两种角色：

```js
const cardSource = {
  //我们的DragSource放置的属性包括id和index
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findCard(props.id).index,
    };
  },
  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
    //（3）在DragSource中我们获取到被拖动的元素的id和originalIndex属性，同时获取到该DragSource是否
    //已经被特定的DropTarget处理，如果没有处理我们移动到其原来的位置即可。
    if (!didDrop) {
      props.moveCard(droppedId, originalIndex);
    }
  },
};

const cardTarget = {
  //(3)我们的canDrop一直返回false，但是这里如果返回true也能达到同样的效果，返回false表示drop方法不会调用
  //从而依赖于父级container的drop方法，但是hover方法是不管canDrop返回false/true都是会调用的。如果返回true，那么Card本身的drop方法也会被调用
  canDrop() {
    return false;
  },
  //(4)hover的时候我们的monitor.getItem()表示DragSource的信息，而props表示DropTarget的信息
  //因为其是用于@DropTarget的decorator的。和drop事件的不同在于，即使canDrop返回了false也会被调用
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props;
    //获取DropTarget的id的值
    if (draggedId !== overId) {
      //如果DragSouce和DropTarget的id的值不一样，那么我们才会移动
      const { index: overIndex } = props.findCard(overId);
      //我们获取到DropTarget的index
      props.moveCard(draggedId, overIndex);
    }
  },
};

//(1)将我们的Card组件同时设置为@DropTarget和@DragSource，因为我们拖动的是否DragSource和DropTarget
//都是我们的Card实例
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
```
同时为了达到`DragSource`移出边界回到初始位置的目的，我们在`DragSource`中的`endDrag()`方法中进行了处理:

```js
const cardSource = {
  //我们的DragSource放置的属性包括id和index
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findCard(props.id).index,
    };
  },
  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
    //（3）在DragSource中我们获取到被拖动的元素的id和originalIndex属性，同时获取到该DragSource是否
    //已经被特定的DropTarget处理，如果没有处理我们移动到其原来的位置即可。
    if (!didDrop) {
      props.moveCard(droppedId, originalIndex);
    }
  },
};
```
注意：我们的Container也同时设置了两种角色，即`DragDropContext`和`DropTarget`,我们的`drop`事件会被container处理,因为Card的`drop`事件返回了false。

```js
@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
```

详细例子你可以直接在该目录下运行`npm run dev`
