### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子解释
`DropTarget`和`DragSource`一样可以被嵌套。和DragSource不一样的是，多个DropTarget可以对同一个DragSource进行处理。React拖拽库`没有方法来阻止冒泡`。我们的DropTarget可以通过比较monitor.isOver()和monitor.isOver({shallow:true})去判断当前hover的是哪一个DropTarget。你可以通过判断`monitor.didDrop()`和`monitor.getDropResult()`来判断drop事件是否已经被内嵌的`DropTarget`处理了并返回一个不同的结果。如下面的例子:

```js
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

function getStyle(backgroundColor) {
  return {
    border: '1px solid rgba(0,0,0,0.2)',
    minHeight: '8rem',
    minWidth: '8rem',
    color: 'white',
    backgroundColor,
    padding: '2rem',
    paddingTop: '1rem',
    margin: '1rem',
    textAlign: 'center',
    float: 'left',
    fontSize: '1rem',
  };
}

/**
 * (2)DropTarget的属性，不包含通过@DropTarget装饰器添加的属性
 * @type {Object}
 */
const boxTarget = {
  drop(props, monitor, component) {
    console.log('monitor.getDropResult():',monitor.getDropResult());
    const hasDroppedOnChild = monitor.didDrop();
    // console.log('hasDroppedOnChild==',hasDroppedOnChild);
    // 如果你放置到最内部的Dustbin元素，那么这里的console会执行3次，其中最外层的两个返回true(其子元素获取到drop事件),最内层的返回false
    //(3)通过monitor.didDrop()来判断是否被子级的DropTarget处理了。isgreedy判断是否是`not greedy`
    if (hasDroppedOnChild && !props.greedy) {
      return;
    }
    //如果我们的drop事件触发的时候是放置到子级Dustbin，同时也是`greedy`的组件树，那么我们要求重新渲染
    //当前组件，而且drop事件还是会不断冒泡，从而导致整个组件树中当前Dustbin以上的元素的hasDropped为true
    //(因为由于drop事件冒泡，导致他们的hashDroppedChild返回的都是true)，而当前元素的hasDroppedOnChild
    //为false。从而接受drop事件的Dustbin的显示`dropped`，而其他的所有的父级元素显示`dropped on child`。
    //就是因为`hasDroppedOnChild`的值的变化
    component.setState({
      hasDropped: true,
      hasDroppedOnChild,
    });
  },
};

//(1)实例化我们的Dustbin的时候采用方式<Dustbin greedy></Dustbin>
@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({ shallow: true }),
  //(4)判断是否是hover在当前元素上，而不是子元素上
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    isOverCurrent: PropTypes.bool.isRequired,
    greedy: PropTypes.bool,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props);
    //默认hasDropped和hasDroppedOnChild都是false,那么每一个Dustbin组件的这两个属性都是false
    this.state = {
      hasDropped: false,
      hasDroppedOnChild: false,
    };
  }

  render() {
    const { greedy, isOver, isOverCurrent, connectDropTarget, children } = this.props;
    const { hasDropped, hasDroppedOnChild } = this.state;
    //(5)这在drop事件的时候我们通过setState来完成
    const text = greedy ? 'greedy' : 'not greedy';
    //显示Dustbin的UI
    let backgroundColor = 'rgba(0, 0, 0, .5)';
    //如果是在当前的Dustbin上面设置不同的背景色。或者在子级元素上而且是greedy
    if (isOverCurrent || (isOver && greedy)) {
      //(5.1)isOverCurrent表示当前hover的元素，其值设为`darkgreen`，而isOver表示该hover事件是否已经被子级的Dustbin处理过了，而且hover事件是冒泡的，所有所有的父级的Dustbin的背景色也变成了`darkgreen`.
      //(5.2)如果是`not greedy`这个组件树，那么只有被hover的组件的背景色变成了`darkgreen`
      backgroundColor = 'darkgreen';
    }
    //如果`isOverCurrent`为true,那么表示当前的hover元素
    return connectDropTarget(
      <div style={getStyle(backgroundColor)}>
        {text}
        {/*greedy or `not greedy`*/}
        <br />
        {hasDropped &&
          <span>dropped {hasDroppedOnChild && ' on child'}</span>
        }
         {/*`droped or `dropped on child`*/}
        <div>
          {children}
           {/*嵌套的Dustbin都被放置到这里作为children属性的值
             */}
        </div>
      </div>,
    );
  }
}
```

