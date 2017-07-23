import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
};

const cardSource = {
  //我们的DragSource放置的属性包括id和index
  beginDrag(props) {
    return {
      id: props.id,
      originalIndex: props.findCard(props.id).index,
    };
  },
  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();
    //（3）在DragSource中我们获取到被拖动的元素的id和originalIndex属性，同时获取到该DragSource是否
    //已经被特定的DropTarget处理，如果没有处理我们移动到其原来的位置即可。
    if (!didDrop) {
      props.moveCard(droppedId, originalIndex);
    }
  },
};

const cardTarget = {
  //(3)我们的canDrop一直返回false，但是这里如果返回true也能达到同样的效果，返回false表示drop方法不会调用
  //从而依赖于父级container的drop方法，但是hover方法是不管canDrop返回false/true都是会调用的。如果返回
  //true那么我们的Card的drop也会调用
  canDrop() {
    return false;
  },
  drop(){
    console.log('Card的drop被调用');
  },
  //(4)hover的时候我们的monitor.getItem()表示DragSource的信息，而props表示DropTarget的信息
  //因为其是用于@DropTarget的decorator的。和drop事件的不同在于，即使canDrop返回了false也会被调用
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem();
    const { id: overId } = props;
    //获取DropTarget的id的值
    if (draggedId !== overId) {
      //如果DragSouce和DropTarget的id的值不一样，那么我们才会移动
      const { index: overIndex } = props.findCard(overId);
      //我们获取到DropTarget的index
      props.moveCard(draggedId, overIndex);
    }
  },
};

//(1)将我们的Card组件同时设置为@DropTarget和@DragSource，因为我们拖动的是否DragSource和DropTarget
//都是我们的Card实例
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired,
    findCard: PropTypes.func.isRequired,
  };


 /**
  * (2)Card组件被实例化的时候采用下面的方法
  *  <Card
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
            findCard={this.findCard}
          />
  下面是一个card的数据
   {
        id: 1,
        text: 'Write a cool JS library',
      }
  */
  render() {
    const { text, isDragging, connectDragSource, connectDropTarget } = this.props;
    //text表示实例化的时候传入Card组件的text属性
    const opacity = isDragging ? 0 : 1;
    return connectDragSource(connectDropTarget(
      <div style={{ ...style, opacity }}>
        {text}
      </div>,
    ));
  }
}
