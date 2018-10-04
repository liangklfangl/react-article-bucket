import React, { Component } from "react";
import PropTypes from "prop-types";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import ItemTypes from "./ItemTypes";

const style = {
  border: "1px dashed gray",
  padding: "0 4px",
  lineHeight: "25px",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move"
};

/**
 * 来自于我们的DragSource，其中props表示我们的Card组件的props。
 * @type {Object}
 */
const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

/**
 * DragTarget设置我们的hover事件，第一个参数props表示DropTarget的属性,第二个参数表示DropTargetMonitor
 * 而第三个参数表示DropTarget的组件实例
 * @type {Object}
 */
const cardTarget = {
  hover(props, monitor, component) {
    //monitor.getItem()表示获取我们被拖拽的对象即DragSource对象的属性
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    // Don't replace items with themselves
    // 因为这是DropTarget的方法，所以props表示DropTarget的props，即hoverIndex表示dropTarget的index
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    // 得到我们的DropTarget的信息，即上下边际和屏幕的距离
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    // 得到DropTarget中心位置的在屏幕上的位置。得到我们的DropTarget的具体的高度的一半
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    // 得到我们的鼠标的移动距离
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    // 这是得到我们的DragSource的位置
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    //被拖动元素的垂直方向的距离减去DropTarget的顶部的距离就是我们的hoverClientY
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    // 如果被拖拽的对象的index小于DropTarget的index，即向下拖拽,同时我们的鼠标的距离减去DragTarget顶部的距离
    // 要大于DragTarget本身的高度的一半的情况下我们才会移动，否则直接return
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    // 执行换位操作
    props.moveCard(dragIndex, hoverIndex);
    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
    //重新设置DragSource为hoverIndex
  }
};

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))

/**
 * 我们将Card组件设置为@DropTarget和@DragSource，同时我们的DragSouce和DropTarget的type
 * 都是同样的类型
 */
export default class Card extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    text: PropTypes.string.isRequired,
    moveCard: PropTypes.func.isRequired
  };

  render() {
    const {
      text,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return connectDragSource(
      connectDropTarget(<div style={{ ...style, opacity }}>{text}</div>)
    );
  }
}
