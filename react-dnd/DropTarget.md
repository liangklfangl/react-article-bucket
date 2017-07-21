### 1.DropTarget
通过`DropTarget`来包裹你的组件可以使得你的组件对特定类型的元素拖拽,hover，drop行为作出反应。`DropTarget`本身是一个高阶组件。使用DropTarget的时候不要忘了将你的最顶层组件包裹在`DragDropContext`中。

#### 2.DropTarget签名
使用`DropTarget`的时候要注意，如果在第一次调用的时候指定了其所有的参数，那么以后调用的时候只需要传入你的组件class就可以了，即只需要传入一个参数。我们的`DropTarget`也可以作为ES7的decorator使用。

```js
import { DropTarget } from 'react-dnd';
@DropTarget(types, spec, collect)
export default class MyComponent {
  /* ... */
}
```

#### 3.DropTarget参数
##### 3.1 type
该参数是必须的。可以是string或者es6的symbol类型或者是一个函数返回该组件的一个props。我们的DropTarget只会对指定的`相同类型`的DragSource作出反应。

##### 3.2 spec
该参数是必须的。他是一个js对象，该对象上允许注册有限的方法。他描述了`DrapTarget如何处理drag和drop事件`。

##### 3.3 collect
该参数是必须的。他需要返回js对象，该对象会被作为`props`注入到你的组件。他接受两个参数，`connect`和`monitor`。

##### 3.4 options
该参数可选。是一个js对象，如果传递给你的组件的props不是原始值(primitive，基本类型)或者函数，你可以在这个对象指定一个自定义的`arePropsEqual(props, otherProps)`属性来提升性能。这当你的应用存在性能问题的时候才能用到。

下面我们详细说明一下第二个参数，他必须实现DropTarget的一些方法，下面的这些方法它都可以指定。

- drop(props, monitor, component):
   可选方法。当一个指定类型的元素被放置到该元素中触发。你可以返回undefinde或者一个js对象。如果你返回一个js对象，他会作为drop方法的返回值。此时DragSource可以通过在`endDrag`方法中通过`monitor.getDropResult()`来获取。这当你需要判断是哪一个DropTarget接受到drop事件从而做出不同的处理的时候特别有用。如果你有多个嵌套的DropTarget，你可以通过`monitor.didDrop()`和`monitor.getDropResult()`来判断嵌套的DropTarget是否已经对drop事件进行了处理。这两个方法以及DragSource的`endDrag`方法通常用于触发Flux的action。如果`canDrop()`方法返回了false，那么这个方法不会触发。

- hover(props, monitor, component)
   可选的方法。当一个元素在组件中hover的时候触发。你可以通过`monitor.isOver({ shallow: true })`得出当前的hover是发生在该target上还是嵌套的DropTarget上。这个方法在`canDrop`返回false的情况下也会调用。

- canDrop(props, monitor)
  可选方法。判断当前的DropTarget是否可以接受元素的drop。如果你总是接受drop，那么你可以不指定这个方法。这个方法当你需要依赖于`props`或者`monitor.getItem`来判断是否允许drop的时候有用。在该方法中不需要调用`canDrop`

通过上面的论述你应该看到了：我们的spec参数是不处理`enter`和`leave`事件的。你可以在你的collect方法中返回`monitor.isOver()`的结果，这样你可以使用`componentWillReceiveProps `和`componentDidUpdate`钩子函数来在你的组件中处理enter和leave事件。你也可以通过`monitor.isOver({ shallow: true })`来判断，如果你不想要嵌套的DropTarget去处理。

#### 4.每一个方法的具体参数含义
 - props
   你的组件的当前的props
 - monitor
   他是一个`DropTargetMonitor`实例对象。可以通过这个方法来判断当前拖拽的状态，例如当前拖拽的元素以及元素的种类，当前以及初始的坐标和偏移以及它是否已经被放下等。
 - component
  如果你指定了这个参数，那么它是你组件的一个实例。使用这个属性你可以访问指定的DOM节点的位置，大小或者调用`setState`或者其他的组件方法。在`canDrag`方法中我们不会有这个属性，这是因为在调用这个方法的时候组件实例可能已经不存在了。如果在`isDragging`和`canDrag`方法中你想要依赖于组件的state状态，那么你可以考虑通过将state放在父组件中，这样你可以仅仅使用props来完成你想要的功能。而且，从另一方面来说，仅仅依赖于props也会使得你的代码更加清晰。

#### 5.collect方法
仅仅指定DropTarget的`type`和`spec`是不够的。下面几个问题你也需要考虑：

- 将React Dnd`事件的句柄`connect到组件中的某些节点中
- 将我们拖动的状态传递给我们的组件

React组件中所有的通信都是通过props来完成的，因此React Dnd也可以为你的组件注入不同的props。而且，React Dnd可以允许你自由命名props的名称。你自己定义的 `collect`方法会被React DnD调用，同时传入一个`connector`，你可以使用这个`connector`将你的节点connect到后端，同时提供的`monitor`的方法可以随时获取到拖动的状态。这个collect方法必须返回一个js对象，这个js对象会被注入到你的组件。

#### 5.1.collect的两个参数
- connect
  这个是`DropTargetConnector`的一个实例，它仅仅含有一个`dropTarget()`方法。这个方法返回一个函数，这个函数会被传入到你的组件中，进而将你target的DOM节点连接到React DnD的后端去。如果你的collect方法返回`{ connectDropTarget: connect.dropTarget() } `，那么你的组件将会接受到`connectDropTarget`这个props，你可以使用这个方法将组件中render函数中的某些节点设置为可以放置的。如下所示:

```js
return this.props.connectDropTarget(<div>...<\/div>)
```

- monitor
  他是一个`DropTargetMonitor`实例。你可以使用它获取到当前拖拽的状态。

#### 6.DropTarget返回值
`DropTarget`会对你的组件进行包裹，从而返回一个新的组件。为了方便组件测试，可以使用下面的方法来获取组件内部状态。
- 静态方法DecoratedComponent
  返回DragSource包裹后的组件
- 实例方法
  其中`getDecoratedComponentInstance()`返回包裹的组件实例。`getHandlerId()`返回DragSource的ID值，可以通过这个ID来模拟拖拽事件的测试。

#### 7.DropTarget内嵌规则
如果某一个DropTarget被另外一个DropTarget包裹，对于`hover`和`drop`事件来说那么最内层的DropTarget会一直往上冒泡，而且这种冒泡是无法取消的。每一个DropTarget可以通过`monitor.isOver()` 和`monitor.isOver({ shallow: true }) `来判断是子节点还是当前的DrapTarget被`hover`。对于`drop`方法来说，每一个DropTarget都会判断自己是否是第一个DropTarget，而这是通过`monitor.didDrop()`返回false来完成的。任何父级的DropTarget都会使用子级的DropTarget对drop方法返回的结果进行覆盖，而这个过程是通过显式返回另外一个`drop()`的结果来完成。如果父级的DropTarget的drop方法返回了undefined，他不会改变内层DropTarget的`drop`方法返回的值。那些`canDrop()`返回false的DropTarget不会触发`drop()`方法。


#### 8.处理文件和URL
如果使用HTML5 backend，你可以通过为一个DropTarget注册`HTML5Backend.NativeTypes.FILE或者HTML5Backend.NativeTypes.URL`内置的类型来处理文件drop。由于浏览器的安全限制，`monitor.getItem()`不会提供关于file和URL的任何信息直到drop方法被调用。

#### 9.DropTarget示例
```js
import React from 'react';
import { findDOMNode } from 'react-dom';
import { DropTarget } from 'react-dnd';

// Drag sources and drop targets only interact
// if they have the same string type.
// You want to keep types in a separate file with
// the rest of your app's constants.
const Types = {
  CHESSPIECE: 'chesspiece'
};

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const chessSquareTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    const item = monitor.getItem();
    return canMakeChessMove(item.fromPosition, props.position);
  },

  hover(props, monitor, component) {
    // This is fired very often and lets you perform side effects
    // in response to the hover. You can't handle enter and leave
    // here—if you need them, put monitor.isOver() into collect() so you
    // can just use componentWillReceiveProps() to handle enter/leave.

    // You can access the coordinates if you need them
    const clientOffset = monitor.getClientOffset();
    const componentRect = findDOMNode(component).getBoundingClientRect();

    // You can check whether we're over a nested drop target
    const isJustOverThisOne = monitor.isOver({ shallow: true });

    // You will receive hover() even for items for which canDrop() is false
    const canDrop = monitor.canDrop();
  },

  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const item = monitor.getItem();

    // You can do something with it
    ChessActions.movePiece(item.fromPosition, props.position);

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

@DropTarget(Types.CHESSPIECE, chessSquareTarget, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDropTarget: connect.dropTarget(),
  // You can ask the monitor about the current drag state:
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  canDrop: monitor.canDrop(),
  itemType: monitor.getItemType()
}))
export default class ChessSquare {
  componentWillReceiveProps(nextProps) {
    if (!this.props.isOver && nextProps.isOver) {
      // You can use this as enter handler
    }

    if (this.props.isOver && !nextProps.isOver) {
      // You can use this as leave handler
    }

    if (this.props.isOverCurrent && !nextProps.isOverCurrent) {
      // You can be more specific and track enter/leave
      // shallowly, not including nested targets
    }
  }

  render() {
    // Your component receives its own props as usual
    const { position } = this.props;

    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isOver, canDrop, connectDropTarget } = this.props;

    return connectDropTarget(
      <div className='Cell'>
        {isOver && canDrop && <div class='green' />}
        {!isOver && canDrop && <div class='yellow' />}
        {isOver && !canDrop && <div class='red' />}
      <\/div>
    );
  }
}
```

