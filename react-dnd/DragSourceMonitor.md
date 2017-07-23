### 1.DragSourceMonitor 

`DragSourceMonitor` 是传入`DragSource`的collect方法中的一个对象。通过它你可以获取到被拖拽元素的状态。绑定某一个monitor上的特定的DragSource被成为该monitor的所有者。 

### 2.Methods 

- canDrag()
 如果当前不是在拖动的状态那么应该返回true，如果monitor的所有者的`canDrag()`方法返回true或者改方法没有定义的情况下也应该返回true。

- isDragging()
  如果当前处于拖动状态，可以是所有者开始了拖动或者`isDragging()`被定义了同时返回了true

- getItemType()
  返回一个string或者ES6的symbol来指定当前被拖拽的对象的类型，如果没有元素被拖动那么返回null

- getItem()
   返回一个对象用于指定当前被拖动的元素，每一个DragSource都必须通过在`beginDrag()`中返回一个对象的方式指定该方法。如果没有元素被拖动那么返回null。

- getDropResult(): Returns a plain object representing the last recorded drop result(`最近监听的drop result`). The drop targets may optionally specify it by returning an object from their drop() methods. When a chain of drop() is dispatched for the nested targets, bottom up, any parent that explicitly returns its own result from drop() overrides the child drop result previously set by the child. Returns null if called outside endDrag().

- didDrop() Returns true if some drop target has handled the drop event(`有drop事件被处理`), false otherwise. Even if a target did not return a drop result(没有返回drop结果的时候也是返回true), didDrop() returns true. Use it inside `endDrag()` to test whether any drop target has handled the drop. Returns false if called outside endDrag().

- getInitialClientOffset(): Returns the { x, y } client offset of the pointer at the time when the current drag operation has started. Returns null if no item is being dragged.

- getInitialSourceClientOffset()
  在当前拖动状态开始的时候，我们获取DragSource的`根节点`的偏移量(client offset)，返回`{ x, y }`，如果没有元素被拖动那么返回null。

- getClientOffset()
  返回drag状态下指针pointer最近一次记录的偏移量(client Offset)，如果没有元素被拖动那么返回null

- getDifferenceFromInitialOffset(): Returns the `{ x, y } difference` between the last recorded client offset of the pointer and the client offset when current the drag operation has started. Returns null if no item is being dragged.

- getSourceClientOffset(): Returns the `projected(横向和纵向投影)` { x, y } client offset of the drag source component's root DOM node, based on its position at the time when the current drag operation has started, and the movement difference. Returns null if no item is being dragged.
