### 1.DragDropContextProvider
除了使用`DragDropContext`,你也可以使用`DragDropContextProvider`元素来在你的应用中完成React拖拽。和`DragDropContext`类似，其会通过props属性来注入一个backend，而且backend也可以通过window对象来注入。如下面的例子:

```js
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContextProvider } from 'react-dnd';

export default class YourApp {
  render() {
    return (
      <DragDropContextProvider backend={HTML5Backend}>
      /* ... */
      <\/DragDropContextProvider>
    );
  };
}
```

### 2.DragDropContextProvider参数
- backend
  必须指定。指的是React拖拽的backend,除非你想要使用一个自定义的backend，否则使用HTML5 backend就已经足够了。
- window
 可选的参数。主要用于iframe的情况

### 3.注入一个window实例
为了支持iframe,我们必须能够注入已经注册了事件的window到HTML5 backend。你可以使用下面几个方式：
- 通过`window`这个props属性，其具有最高的优先级来判断应该使用哪个window
- 通过`window`这个context值，其优先级要低于前者
- 如果两者都没有指定，那么会使用全局的`window`上的属性
