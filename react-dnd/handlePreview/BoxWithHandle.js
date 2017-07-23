import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from './ItemTypes';

//这是我们的connectDragPreview处理的元素，其表示我们在拖动的时候展示的样式
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  width: '20rem',
};

//这里我们的connectDragSource包裹的对象，即可以被拖动的元素
const handleStyle = {
  backgroundColor: 'green',
  width: '1rem',
  height: '1rem',
  display: 'inline-block',
  marginRight: '0.75rem',
  cursor: 'move',
  border:"1px solid red"
};

const boxSource = {
  beginDrag() {
    return {};
  },
};

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class BoxWithHandle extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  /**
   * 实例化的时候通过<BoxWithHandle />来完成
   * @return {[type]} [description]
   */
  render() {
    const { isDragging, connectDragSource, connectDragPreview } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    return connectDragPreview(
      <div style={{ ...style, opacity }}>
        {connectDragSource(
          <div style={handleStyle} />,
        )}
        Drag me by the handle
      </div>,
    );
  }
}
