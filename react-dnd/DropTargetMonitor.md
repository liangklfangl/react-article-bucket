### DropTargetMonitor 


### Methods 

- canDrop()
  Returns true if no drag operation is in progress, and the owner's canDrop() returns true or is not defined.

- isOver(options)
  Returns true if there is a drag operation is in progress, and the pointer is currently hovering over the owner(指针在所有者上面). You may optionally pass `{ shallow: true }` to strictly check whether only the owner is being hovered, as opposed to a nested target.

- getItemType()
  Returns a string or an ES6 symbol identifying the type of the current dragged item. Returns null if no item is being dragged.

- getItem()
 Returns a plain object representing the currently dragged item. `Every drag source must specify it` by returning an object from its beginDrag() method. Returns null if no item is being dragged.(每一个DragSource都需要通过在`beginDrag()`中返回一个对象的方式来指定)

- getDropResult()
 Returns a plain object representing the last `recorded drop result`. The drop targets may optionally specify it by returning an object from their drop() methods. When a chain of drop() is dispatched for the nested targets, bottom up, any parent that explicitly returns its own result from drop() overrides the drop result previously set by the child. Returns null if called outside drop().

- didDrop() 
 Returns true if `some drop target` has handled the drop event, false otherwise. Even if a target did not return a drop result(`DropTarget即使没有返回一个result,dipDrop也会返回true`), didDrop() returns true. Use it inside drop() to test whether any nested drop target has already handled the drop. Returns false if called outside drop().

- getInitialClientOffset()
 Returns the { x, y } client offset of the pointer at the time when the current drag operation has started. Returns null if no item is being dragged.

- getInitialSourceClientOffset()
  Returns the { x, y } client offset of the drag source component's root DOM node at the time when the current drag operation has started. Returns null if no item is being dragged.

- getClientOffset()
  Returns the last recorded `{ x, y }` client offset of the pointer while a drag operation is in progress. Returns null if no item is being dragged.

- getDifferenceFromInitialOffset()
  Returns the { x, y } difference between the last recorded client offset of the pointer and the client offset when current the drag operation has started. Returns null if no item is being dragged.

- getSourceClientOffset()
  Returns the `projected(投影)` { x, y } client offset of the drag source component's root DOM node, based on its position at the time when the current drag operation has started, and the movement difference. Returns null if no item is being dragged.
