### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子说明
该例子展示了如何通过dragPreview来给元素拖动的时候展示一个效果。其主要代码如下:

```js
@DragSource(ItemTypes.BOX, BoxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  //实现预览
  isDragging: monitor.isDragging(),
}))
```

