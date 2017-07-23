### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子简要说明
每次有drop事件被触发的时候回更新`lastDroppedItem`为最新的`DragSource`对象，同时会更新我们的`droppedBoxNames`表示那些DragSource已经被放置，而且是通过`setState`来完成的，所以会导致下面的Dustbin组件和Box组件都会更新，其中Dustbin中显示`lastDroppedItem`的属性，而Box中通过`isDropped`来更新UI状态
