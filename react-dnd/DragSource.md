### 1.DragSource
使用`DragSource`包裹我们的组件从而使得其可以拖拽。`DragSource`是一个高阶组件，其接受三个参数，下面具体对每一个参数进行说明。使用`DragSource`的时候，我们需要将应用的顶级组件包裹在`DragDropContext`中。

#### 2.DragSource签名
使用`DragSource`的时候要注意，如果在第一次调用的时候指定的其所有的参数，那么以后调用的时候只需要传入你的组件class就可以了，即只需要传入一个参数。我们的`DragSource`也可以作为ES7的decorator使用。

```js
import { DragSource } from 'react-dnd';
@DragSource(type, spec, collect)
export default class MyComponent {
  /* ... */
}
```

#### 2.DragSource参数
##### 2.1 type
该参数是必须的。可以是`string`或者es6的`symbol`类型或者是一个`函数`返回该组件的一个props。只有那些注册了同样类型的`DropTarget`会对拖放事件进行处理。

##### 2.2 spec
该参数是必须的。他是一个js对象，该对象上允许注册有限的方法。他描述了`被拖拽的元素如何处理drag和drop事件`。

##### 2.3 collect
该参数是必须的。他需要返回js对象，该对象会被作为`props`注入到你的组件。他接受两个参数，`connect`和`monitor`。

##### 2.4 options
该参数可选。是一个js对象，如果传递给你的组件的props不是原始值(primitive，基本类型)或者函数，你可以在这个对象指定一个自定义的`arePropsEqual(props, otherProps)`属性来提升性能。这当你的应用存在性能问题的时候才能用到。

下面我们详细说明一下第二个参数，他必须实现DragSource的一些方法，下面的这些方法它都可以指定。

- beginDrag(props, monitor, component)
这个函数是必须的。当开始拖拽的时候调用。你必须返回一个js对象表示被拖动的数据。这个函数返回的对象是`DropTarget`对`DragSource`了解的所有信息,因此你需要告诉DropTarget他需要的基本信息。你可能想要在component属性中传入一个引用，但是你一定不要这么做，因为他会导致DropTarget对DragSource产生强烈的耦合。因此建议你返回`{id:props.id}`这样的数据类型。

- endDrag(props, monitor, component):
这个方法是可选的。当拖动结束的时候被调用。每次你调用`beginDrag`的时候，你也需要调用相应的`endDrap`方法。你可以调用`monitor.didDrop()`去检测某一个drop事件是否正确的被相应的dropTarget处理。如果该drop方法被处理，那么dropTarget会返回一个结果，而且该结果是一个js对象。该js对象可以通过`monitor.getDropResult()`来获取。这个方法是触发Flux中action的好地方。注意：`如果一个组件在拖动的时候已经被卸载，那么component参数会是null`。比如下面的例子:

```js
const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      sex:props.sex
    };
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    console.log('item--->',item);
    //(4.2)在endDrag中我们DragSourceMonitor获取到的就是被拖拽的对象，而拖拽的对象获取到的属性就是beginDrag中的信息,即{name,sex}
    const dropResult = monitor.getDropResult();
    //(3)在被DragSource中我们通过monitor.getDropResult()来获取到DropTarget的drop方法中返回的对象
    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  },
};
```
我们在`beginDrag`中返回的{name,sex}就是我们在endDrag中通过`monitor.getItem()`返回的被拖拽对象`DragSource`的所有属性。你可以查看[这个例子](./singleTarget/readme.md)

- canDrag(props, monitor)
该参数可选。使用这个方法可以判断当前的拖拽是否应该被允许。如果每次都应该被允许，那么你不需要考虑这个方法。这个方法当你依赖于某些props来判断拖拽是否应该被允许的时候才有用。注意：`在这个方法中你不应该调用canDrag(props, monitor)`

- isDragging(props, monitor)
该参数可选。默认情况下，只有通过DragSource来触发拖拽请求的情况下才被当做一次拖拽。你可以通过实现一个`isDragging`方法来覆盖这个默认的行为。他会返回类似于`props.id === monitor.getItem().id`的结果。这在一种情况下会特别有用，即初始的组件在拖拽期间可能被卸载，然后最后又会被挂载到一个完全不同的父级组件上。例如：当你在一个板子上移动一个卡片的时候，你想要保持它的拖拽时候的样式，即使这个组件已经被卸载，而另外一个组件被挂载上去。注意不要在这个方法中调用`monitor.isDragging()`


#### 3.每一个方法的具体参数含义

 - props
   你的组件的当前的props
 - monitor
   他是一个`DragSourceMonitor`实例对象。可以通过这个对象来判断当前拖拽的状态，例如当前拖拽的元素以及元素的种类，当前以及初始的坐标和偏移以及它是否已经被放下等。
 - component
  如果你指定了这个参数，那么它是你组件的一个实例。使用这个属性你可以访问指定的DOM节点的位置，大小或者调用`setState`或者其他的组件方法。在`isDragging`和`canDrag`方法中我们不会有这个属性，这是因为在调用这两个方法的时候组件实例可能不存在。如果在`isDragging`和`canDrag`方法中你想要依赖于组件的state状态，那么你可以考虑通过将state放在父组件中，这样你可以仅仅使用props来完成你想要的功能。而且，从另一方面来说，仅仅依赖于props也会使得你的代码更加清晰。

#### 4.collect方法
仅仅指定DragSource的`type`和`spec`是不够的。下面几个问题你也需要考虑：

- 将React Dnd`事件的句柄`connect到组件中的某些节点中
- 将我们拖动的状态传递给我们的组件
React组件中所有的通信都是通过props来完成的，因此React Dnd也可以为你的组件注入不同的props。而且，React Dnd可以允许你自由命名props的名称。你自己定义的 `collect`方法会被React DnD调用，同时传入一个`connector`，你可以使用这个`connector`将你的节点connect到后端，同时提供的`monitor`的方法可以随时获取到拖动的状态。这个collect方法必须返回一个js对象，这个js对象会被注入到你的组件。

#### 4.1.collect的两个参数
- connect
  这个是`DragSourceConnecto`r的一个实例，顾名思义就是对DragSource的连接。他提供两个方法，dragPreview()和dragSource()。其中dragSource方法你可能经常使用，这个方法返回一个函数，这个函数会被传入到你的组件中，进而将你拖拽的DOM节点连接到React DnD的后端去。如果你的collect方法返回`{ connectDragSource: connect.dragSource() }`，那么你的组件就会接受到一个connectDragSource作为props。因此，你可以使用这个方法来将该组件的render中的相关节点设置为可以拖拽的，如下:

```js
return this.props.connectDragSource(<div>...<\/div>)
```
而至于`dragPreview`是为了在你拖动元素的时候展示一个定制化的拖动的效果。通过[handlePreview](./handlePreview/readme.md)下面的例子你就很容易明白了。


- monitor: 是一个`DragSourceMonitor`实例，你可以使用这个对象来获取当前拖动的状态。

#### 5.DragSource返回值
`DragSource`会对你的组件进行包裹，从而返回一个新的组件。为了方便组件测试，可以使用下面的方法来获取组件内部状态。
- 静态方法DecoratedComponent
  返回DragSource包裹后的组件
- 实例方法
  其中`getDecoratedComponentInstance()`返回包裹的组件实例。`getHandlerId()`返回DragSource的ID值，可以通过这个ID来模拟拖拽事件的测试。

#### 6.DragSource内嵌规则
如果某一个DragSource被另外一个DragSource包裹，那么最内层的DragSource会有更高的优先级。对于那些`canDrag`返回false的DragSource会被直接跳过。只有最内层的DragSource会接受到`beginDrag`以及`endDrag`，当DragSource被确定后不会存在所谓的冒泡行为。

#### 7.DragSource实例

```js
import React from 'react';
import { DragSource } from 'react-dnd';
//只有在type类型相同的时候我们的DragSource和DropTarget之间才会产生交互。因此，你可以将我们的type信息放置到独立的文件中作为应用的const数据类型
const Types = {
  CARD: 'card'
};
/**
 * 指定DragSource的交互逻辑，只有`beginDrag`函数是必须的
 */
const cardSource = {
  canDrag(props) {
    //(1)你可以根据组件的props来判断是否可以被拖拽。canDrag的第一个参数就是组件的props
    return props.isReady;
  },
  //(2)第二个参数是DragSourceMonitor，通过它获取当前的拖拽状态
  isDragging(props, monitor) {
    // If your component gets unmounted while dragged
    // (like a card in Kanban board dragged between lists)
    // you can implement something like this to keep its
    // appearance dragged:
    return monitor.getItem().id === props.id;
  },
  //(3)第三个参数是你的组件的实例，该函数的返回值用于对被拖拽的对象进行描述
  beginDrag(props, monitor, component) {
    // Return the data describing the dragged item
    const item = { id: props.id };
    return item;
  },
  //(4)通过monitor.didDrop来获取Drag是否被正常处理了
  endDrag(props, monitor, component) {
    if (!monitor.didDrop()) {
      // You can check whether the drop was successful
      // or if the drag ended but nobody handled the drop
      return;
    }
    // When dropped on a compatible target, do something.
    // Read the original dragged item from getItem():
    const item = monitor.getItem();
    // You may also read the drop result from the drop target
    // that handled the drop, if it returned an object from
    // its drop() method.
    //(5)如果DropTarget对我们的drop事件进行了处理，同时在drop方法中返回了一个对象，那么我们可以通过monitor.getDropResult()来获取
    const dropResult = monitor.getDropResult();
    // This is a good place to call some Flux action
    CardActions.moveCardToList(item.id, dropResult.listId);
  }
};

@DragSource(Types.CARD, cardSource, (connect, monitor) => ({
  // Call this function inside render()
  // to let React DnD handle the drag events:
  connectDragSource: connect.dragSource(),
  // You can ask the monitor about the current drag state:
  isDragging: monitor.isDragging()
}))
export default class Card {
  render() {
    // Your component receives its own props as usual
    const { id } = this.props;
    // These props are injected by React DnD,
    // as defined by your `collect` function above:
    const { isDragging, connectDragSource } = this.props;
    return connectDragSource(
      <div>
        I am a draggable card number {id}
        {isDragging && ' (and I am being dragged now)'}
      <\/div>
    );
  }
}
```

