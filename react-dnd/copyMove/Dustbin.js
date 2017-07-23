import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from './ItemType';
// export default {
//   BOX: 'box',
// };

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

/**
 * (1)我们的DropTarget可以有一个drop方法，当一个指定类型的元素被放置到该元素中触发。你可以返回undefinde或者一个js对象。如果你返回一个js对象，他会作为drop方法的返回值。此时DragSource可以通过在`endDrag`方法中通过`monitor.getDropResult()`来获取。
 * @type {Object}
 */
const boxTarget = {
  drop({allowedDropEffect}) {
    return {
      name: `${allowedDropEffect} Dustbin`,
      allowedDropEffect,
    };
  },
};



@DropTarget(ItemTypes.BOX, boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  //(2)你可以通过`monitor.isOver({ shallow: true })`得出当前的hover是发生在该target上还是嵌套的DropTarget上
  isOver: monitor.isOver(),
  //(3)判断当前的DropTarget是否可以接受元素的drop。如果你总是接受drop，那么你可以不指定这个方法。这个方法当你需要依赖于`props`或者`monitor.getItem`来判断是否允许drop的时候有用
  canDrop: monitor.canDrop(),
}))
/**
 *   <Dustbin allowedDropEffect="any" />
 */
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    allowedDropEffect: PropTypes.string.isRequired,
  };

  render() {
      //(4)其中Dustbin可以接受到drop类型通过props被传入到组件中
      // <Dustbin allowedDropEffect="any" />
      // <Dustbin allowedDropEffect="copy" />
      // <Dustbin allowedDropEffect="move" />
    const { canDrop, isOver, allowedDropEffect, connectDropTarget } = this.props;
    const isActive = canDrop && isOver;
    //判断当前元素是否是active
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }
  //(5)通过connectDropTarget来将当前元素设置为DropTarget对象
    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        { `Works with ${allowedDropEffect} drop effect` }<br /><br />
        {isActive ?
          'Release to drop' :
          'Drag a box here'
        }
      </div>,
    );
  }
}
