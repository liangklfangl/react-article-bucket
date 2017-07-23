### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子说明
这里例子展示了我们的DragSource和DropTarget的props属性每隔1s都会发生变化。我们的React dnd会持续跟踪props的变化，如果某一个组件接受到新的props，那么React dnd会重新计算拖动的状态。这个例子也展示了，一个自定义的`isDragging`的实现可以让一个DragSource看起来就像被拖动了一样，即使初始实例化拖动状态的组件接受到了新的props.
