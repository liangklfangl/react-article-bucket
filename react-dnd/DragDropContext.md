### 1.DragDropContext
使用`DragDropContext`来包裹你的组件可以完成React拖拽。它可以允许你指定backend，同时在幕后设置共享的拖动状态。例如下面的例子:

```js
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

@DragDropContext(HTML5Backend)
export default class YourApp {
  /* ... */
}
```

#### 2.DragDropContext签名
- backend
 该参数是必须的，指的是一个`React拖动backend`。除非你想要使用一个自定义的backend，否则使用HTML5 backend就已经足够了。

#### 3.DragDropContext返回值
`DragDropContext`来包裹你的组件，从而返回一个全新的组件。静态方法如下:

- DecoratedComponent
  返回一个被包裹的组件类型

实例方法如下:
- getDecoratedComponentInstance()
 返回一个被包裹的组件的实例
- getManager
  返回一个内部的manager，通过这个方法可以获取指定backend
