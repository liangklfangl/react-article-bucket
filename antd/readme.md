#### 1.如何更新表格的某一条数据并要求组件重新渲染
我们有时候会要求更新表格的某一条数据并要求对组件进行重新渲染，比如一个常用的场景如`"上线/下线"`操作。此时我们可以通过下面的方式来完成:

```js
  //修改该条记录的上线和下线的状态
   const newItem = update(item,{status:{
        $set:wantStatus
      }});
 //其中newItem就是你对该条数据进行了更新后的结果
      this.setState(update(this.state,{
         dataSource:{
           $splice:[
             [index,1,newItem]
           ]
         }
      }))
```
上面这句代码表示将this.state.dataSource中下标为index的哪行记录设置为一个新的值，即newItem。对于上面的$splice的用法，你可以参考我在[react-dnd中的写法](../react-dnd/cancelDropOuside/Container.js)，替换成为下面的形式:

```js
 this.setState(update(this.state,{
         dataSource:{
           $splice:[
             [index,1],
             [index,0,newItem]
           ]
         }
      }))
```
此处我讲解一下react-dnd中的例子：

```js
/**
  * 移动card
  * props.moveCard(draggedId, overIndex)
  * @param  {[type]} id     被拖动的元素的id值
  * @param  {[type]} atIndex DropTarget即hover的那个Card的id值
  * @return {[type]}         [description]
  */
  moveCard(id, atIndex) {
    const { card, index } = this.findCard(id);
    //找到被拖动的Card的属性，如：
    // {
    //   id: 4,
    //   text: 'Create some examples',
    // }
   //以及该card在this.state.cards中的下标值
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1],
          //首先删除我们的DragSource，同时在我们DragTarget前面插入我们的DragSource
          [atIndex, 0, card],
        ],
      },
    }));
  }
```
其中参数id表示移动的那个卡片的id值，而atIndex表示要drop的那个卡片的id，所以我们首先删除我们的DragSource，然后在DragTarget前面插入我们的DragSource。如果你使用antd那么你只要关注render方法就能够很容易的知道当前的表格行的index:

```js
render(text, record, index) {

}
```











参考资料:

[immutability-helper](https://github.com/kolodny/immutability-helper)
