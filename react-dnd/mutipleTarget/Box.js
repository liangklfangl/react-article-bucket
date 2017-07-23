import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};

//(5)Box组件被实例化的时候传入下面的内容
//<Box
  // name={name}
  // type={type}
  // isDropped={this.isDropped(name)}
 // boxes: [
 //        { name: 'Bottle', type: ItemTypes.GLASS },
 //        { name: 'Banana', type: ItemTypes.FOOD },
 //        { name: 'Magazine', type: ItemTypes.PAPER },
 //      ]
const boxSource = {
//(5)beginDrag中放置的是我们的name的props
  beginDrag(props) {
    return {
      name: props.name,
    };
  },
};

//(6)第一个参数是一个函数，表示通过这个函数来判断DragSource的类型
@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired,
  };

  render() {
    const { name, isDropped, isDragging, connectDragSource } = this.props;
    //获取到isDroped的props属性，该属性的值是在container中调用后返回的结果
    const opacity = isDragging ? 0.4 : 1;
    return connectDragSource(
      <div style={{ ...style, opacity }}>
        {isDropped ?
          <s>{name}</s> :
          name
        }
      </div>,
    );
  }
}
