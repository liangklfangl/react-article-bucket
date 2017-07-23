### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子简介
我们将拖动组件的效果放在了一个iframe中。在`DropTarget`的`drop`方法中我们返回如下的值:

```js
const boxTarget = {
  drop() {
    return { name: 'Dustbin' };
  },
};
```
同时我们在`@DragSource`的`endDrag`方法中通过`monitor.getDropResult()`获取到`drop()`方法返回的值。

```js
const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
    };
  },
  /**
   * (2)在DragSource的endDrag方法中可以通过monitor.getDropResult()获取到DragTarget中drop方法的返回值
   * @param  {[type]} props   [description]
   * @param  {[type]} monitor [description]
   * @return {[type]}         [description]
   */
  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  },
};

```

