### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子解释
- 当前的DragSource不能拖动
  如果当前的DragSource的`canDrag()`返回返回false，那么当你拖动的时候，他的上一级的`canDrag()`返回true的DragSource是可以继续拖动的。

- DragSource的传递
  即如果当前的元素的`canDrag()` 返回false，那么可以继续拖动上一级的`canDrag()`返回false的DragSource。否则拖动的就是当前的`canDrag()`返回true的DragSource。只有被激活的DragSource才会调用`beginDrag()` 和 `endDrag()`方法。
