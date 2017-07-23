import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

//(2)Box实例化的时候是通过如下方式来完成的
// <Box name="Glass" />
// <Box name="Banana" />
// <Box name="Paper" />
// beginDrag将我们的name属性放到我们的DragSource中,但这里props只会包含name属性
const boxSource = {
  beginDrag(props) {
    return {
      name: props.name,
      sex:props.sex
    };
  },
  endDrag(props, monitor) {
    const item = monitor.getItem();
    console.log('item--->',item);
    //(4.2)在endDrag中我们DragSourceMonitor获取到的就是被拖拽的对象，而拖拽的对象获取到的属性就是beginDrag中的信息
    const dropResult = monitor.getDropResult();
    //(3)在被DragSource中我们通过monitor.getDropResult()来获取到DropTarget的drop方法中返回的对象
    if (dropResult) {
      window.alert( // eslint-disable-line no-alert
        `You dropped ${item.name} into ${dropResult.name}!`,
      );
    }
  },
};
//(4)通过@DragSource对我们的组件进行包装，使得其可以被拖拽
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
    //(4.1)我们的div里面放置的是Box组件的name属性props,即Glass,Banaer等
    const opacity = isDragging ? 0.4 : 1;
    return (
      connectDragSource(
        <div style={{ ...style, opacity }}>
          {name}
        </div>,
      )
    );
  }
}
