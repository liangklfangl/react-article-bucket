import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemType';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  float: 'left',
};

//(1)我们的Box对象实例化的时候是通过这样的<Box name="Glass" />
const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
    };
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    //(4)我们这里获取到DragSourceMonitor获取到我们的DragSource对象的信息
    const dropResult = monitor.getDropResult();
    //(5)在dragTarget的drop方法中放置的对象可以在这里取到
    if (dropResult) {
      //(6)此时的getDropResult方法是得到DropTarget的drop方法的返回值
      //const boxTarget = {
    //   drop({allowedDropEffect}) {
    //     return {
    //       name: `${allowedDropEffect} Dustbin`,
    //       allowedDropEffect,
    //     };
    //   },
    // };
      let alertMessage = '';
      if (dropResult.allowedDropEffect === 'any' || dropResult.allowedDropEffect === dropResult.dropEffect) {
        alertMessage = `You ${dropResult.dropEffect === 'copy' ? 'copied' : 'moved'} ${item.name} into ${dropResult.name}!`;
      } else {
        alertMessage = `You cannot ${dropResult.dropEffect} an item into the ${dropResult.name}`;
      }
      window.alert( // eslint-disable-line no-alert
        alertMessage,
      );
    }
  },
};

//(2)DragSource的返回值会作为props传入到我们的组件
@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };

  render() {
    const { isDragging, connectDragSource } = this.props;
    const { name } = this.props;
    //Box组件接受到的name的props
    const opacity = isDragging ? 0.4 : 1;
    //(3)通过connectDragSource处理后我们的组件就可以被拖拽了
    return (
      connectDragSource(
        <div style={{ ...style, opacity }}>
          {name}
        </div>,
      )
    );
  }
}
