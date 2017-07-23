import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import Colors from './Colors';

const style = {
  border: '1px dashed gray',
  padding: '0.5rem',
  margin: '0.5rem',
};

/**
 * 是否可以Drag
 * @type {Object}
 */
const ColorSource = {
  canDrag(props) {
    return !props.forbidDrag;
  },

  beginDrag() {
    return {};
  },
};

//(2)第一个参数为color，通过color来判断该DragSource的类型
@DragSource(props => props.color, ColorSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
//(1)SourceBox被实例化的时候采用的是下面的方法
//  <SourceBox color={Colors.BLUE} />
class SourceBox extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    color: PropTypes.string.isRequired,
    forbidDrag: PropTypes.bool.isRequired,
    onToggleForbidDrag: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  render() {
    const { color, children, isDragging, connectDragSource, forbidDrag, onToggleForbidDrag } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    let backgroundColor;
    //设置背景颜色
    switch (color) {
      case Colors.YELLOW:
        backgroundColor = 'lightgoldenrodyellow';
        break;
      case Colors.BLUE:
        backgroundColor = 'lightblue';
        break;
      default:
        break;
    }

    return connectDragSource(
      <div
        style={{
          ...style,
          backgroundColor,
          opacity,
          cursor: forbidDrag ? 'default' : 'move',
        }}
      >
       {/*通过onToggleForbidDrag*/}
        <input
          type="checkbox"
          checked={forbidDrag}
          onChange={onToggleForbidDrag}
        />
        <small>Forbid drag</small>
         {/*SourceBox可能存在嵌套*/}
        {children}
      </div>,
    );
  }
}

/**
 * 这才是导出的class
 * (1)如果该SourceBox的this.state.forbidDrag设置为true，那么cursor就是default，同时checkbox的
 *    状态就是checked.
 * (2)其实是通过canDrag方法来设置某一个元素是否可以被拖拽
 *    canDrag(props) {
        return !props.forbidDrag;
      }
 */
export default class StatefulSourceBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forbidDrag: false,
    };
  }

  render() {
    return (
      <SourceBox
        {...this.props}
        forbidDrag={this.state.forbidDrag}
        onToggleForbidDrag={() => this.handleToggleForbidDrag()}
      />
    );
  }

  handleToggleForbidDrag() {
    this.setState({
      forbidDrag: !this.state.forbidDrag,
    });
  }
}
