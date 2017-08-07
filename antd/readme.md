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

#### 2.弹窗使用componentDidMount替代componentWillReceiveProps
对于弹窗来说，使用componentDidMount比componentWillReceiveProps要好的多。所以当存在一种情况,即编辑和添加一条记录`共用弹窗`的情况下，我们就会遇到两者选择的问题。但是对于两者来说，不管是添加还是编辑可以通过一个字段来决定，比如data,在编辑的时候data为该条记录的值，而添加的时候data为null。这个data可以作为props传入到弹窗组件中，进而在弹窗组件中通过this.props.data来对该条记录处理。就像我开头说的，即可以通过componentWillReceiveProps也可以通过componentDidMount来处理，但是在componentWillReceiveProps中要复杂的多：

- setState调用的时候我们的componentWillReceiveProps也会被调用，所以在弹窗内部如果存在维护state的情况下就显得比较尴尬，因为每次setState被调用该方法都会触发

- componentWillReceiveProps每次收到的nextProps都是打开弹窗的值，即该条记录的值，而不会随着setState调用而发生改变。而为了导致每次的值的改变我们就会使用this.state来维护，而这就会陷入第一种情况的问题

基于以上两种原因，我们一般会使用componentDidMount来取代componentWillReceiveProps，而取代的方式就是给弹窗一个key，而这个key每次的都是变化的，所以自然而然想到了visibile，即弹窗的可见性：

```js
  <Popup visible={this.state.popupVisible} key={this.state.popupVisible}>
  <\/Popup>
```
这样，每次打开弹窗和关闭弹窗都会是一个完全不同的`弹窗对象`，所以你可以安心的在`componentDidMount`中处理逻辑。比如，编辑的时候给弹窗传入该条记录作为this.props而添加的时候传入data=null。此处我需要给你看看使用antd的Table的时候是如何的:

```js
{
    title: '操作',
    key: 'action',
    render: (item,record,index) => (
      <div>
        <a onClick={() => this.edit(item)}>编辑</a>
     </div>
    ),
  }
```
`虽然Table中的dataSource中并没有action这一行`，但是我们依然可以为该行实例化一个`编辑`操作，而render方法中会传入该条记录本身，以及该记录的index。

#### 3.选中Select的option的时候填充的是key

#### 4.设置Select的autocomplete为off

#### 5.如何将数组中某一个对象的值修改并让组件进行更新
```js
this.setState(update(this.state,{
    checkShowObj:{
      $splice:[[index,1,{
        isShow:true,
        index:index
      }]]
    }
  }))
```
此时将我们的index下标的元素替换为一个新的元素，当然其作用和下面的代码是相同的:

```js
 update.extend('$auto', function(value, object) {
  //注意：这里做了一个判断，如果更新的这个对象存在那么直接在这个对象上更新，否则对一个空对象更新并返回结果
    return object ?
      update(object, value):
      update({}, value);
  });
 //第一个参数表示调用$autoArray的时候传入的值，即需要更新成为的值，而object表示原始的值即没有更新之前的。注意，这里都是调用update来完成数据更新的，update会返回更新后的值
  update.extend('$autoArray', function(value, object) {
    return object ?
      update(object, value):
      update([], value);
  });
 this.setState(update(this.state,{
    checkShowObj:{
      //注意：这里使用$auto也是可以的
      $autoArray:{
        //注意：这里的[index]表示变量而不是key为index
        [index] : {
         $set:{
           isShow:true,
           index:index
         }
        }
      }
    }
  }))
```
这里讲到了自定义的命令，我们下面来看一个例子:

```js
//所以自定义命令的时候接受两个参数，其中第一个参数表示调用命令的时候传入的值，如此时的$addtax:0.8，而我们的original就是更新的原始数据的price为123
update.extend('$addtax', function(tax, original) {
  return original + (tax * original);
});
const state = { price: 123 };
const withTax = update(state, {
  price: {$addtax: 0.8},
});
assert(JSON.stringify(withTax) === JSON.stringify({ price: 221.4 }));
```
其中自定义命令的第一个参数表示当前调用命令传入的值，而第二个参数表示`更新之前的原始的值`。此处original表示的就是state.price即`123`。但是，如果你的price是一个对象，那么你要对这个对象进行修改之前必须做一次`shallow clone`。如果你觉得克隆比较麻烦，那么你依然可以使用`update`来完成。

```js
return update(original, { foo: {$set: 'bar'} })
```

如果你不想在全局的update上进行操作，那么你可以自己创建一个update的副本，然后对这个副本进行操作，如下:

```js
import { newContext } from 'immutability-helper';
const myUpdate = newContext();
myUpdate.extend('$foo', function(value, original) {
  return 'foo!';
});
```
针对上面的$auto和$autoArray方法，我们再给出下面的例子:

```js
update.extend('$auto', function(value, object) {
  return object ?
    update(object, value):
    update({}, value);
});
update.extend('$autoArray', function(value, object) {
  return object ?
    update(object, value):
    update([], value);
});
var state = {}
var desiredState = {
  foo: [
    {
      bar: ['x', 'y', 'z']
    },
  ],
};
var state2 = update(state, {
  foo: {$autoArray: {
    0: {$auto: {
      bar: {$autoArray: {$push: ['x', 'y', 'z']}}
    }}
  }}
});
console.log(JSON.stringify(state2) === JSON.stringify(desiredState)) // true
```
通过上面两个例子我是要告诉你，如果你使用$autoArray的话，你可以对数组进行更新，更新特定的元素。但是如果你是要更新一个特定的下标可以采用`[index]`这种方式，而不需要仅仅采用`0/1`类似的下标。



参考资料:

[immutability-helper](https://github.com/kolodny/immutability-helper)
