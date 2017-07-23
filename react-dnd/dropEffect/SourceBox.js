import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1rem',
  marginBottom: '1rem',
  cursor: 'move',
};

const boxSource = {
  //(1)那么在DropTarget的drop方法中获取不到任何关于DragSource的信息
  beginDrag() {
    return {};
  },
};

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class SourceBox extends Component {
  static propTypes = {
    isDragging: PropTypes.bool.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    showCopyIcon: PropTypes.bool,
  };

  render() {
    //(2)实例化这个组件的时候  <SourceBox showCopyIcon />
    const { isDragging, connectDragSource, showCopyIcon } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    const dropEffect = showCopyIcon ? 'copy' : 'move';

    return connectDragSource(
      <div style={{ ...style, opacity }}>
        When I am over a drop zone, I have {showCopyIcon ? 'copy' : 'no'} icon.
      </div>,
      { dropEffect },
    );
  }
}
