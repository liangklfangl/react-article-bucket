import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import ItemTypes from './ItemTypes';
import Box from './Box';

const boxSource = {
  //(4)在beginDrag中将我们的drop中需要的信息返回：{ top: 20, left: 80, title: 'Drag me around' }
  beginDrag(props) {
    const { id, title, left, top } = props;
    return { id, title, left, top };
  },
};

/**
 * (3)根据props获取到style属性，其中props为{ top: 20, left: 80, title: 'Drag me around' }
 * @param  {[type]} props top/left表示水平和垂直方向上移动的距离
 * @return {[type]}       [description]
 */
function getStyles(props) {
  const { left, top, isDragging } = props;
  const transform = `translate3d(${left}px, ${top}px, 0)`;
  return {
    position: 'absolute',
    transform,
    WebkitTransform: transform,
    // IE fallback: hide the real node using CSS when dragging
    // because IE will ignore our custom "empty image" drag preview.
    // (6)IE兼容：当我们拖动的时候我们使用css来隐藏我们真实的DOM节点，因为IE会忽略掉我们DragPreview中空的
    // image节点
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : '',
  };
}

@DragSource(ItemTypes.BOX, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging(),
}))
export default class DraggableBox extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    left: PropTypes.number.isRequired,
    top: PropTypes.number.isRequired,
  };
  //判断组件是否需要更新
  shouldComponentUpdate = shouldPureComponentUpdate;

  componentDidMount() {
    // Use empty image as a drag preview so browsers don't draw it
    // and we can draw whatever we want on the custom drag layer instead.
    // (1)使用一个空的image作为DragPreview,因此浏览器不会绘制DragPreview，因此我们可以在
    // 自定义的DragLayer中任意绘制DragPreview
    this.props.connectDragPreview(getEmptyImage(), {
      // IE fallback: specify that we'd rather screenshot the node
      // when it already knows it's being dragged so we can hide it with CSS.
      // IE兼容
      captureDraggingState: true,
    });
  }
  /**
   * <DraggableBox key={key} id={key} {...item} />
   * 其中item为:{ top: 20, left: 80, title: 'Drag me around' }
   * @return {[type]} [description]
   */
  render() {
    const { title, connectDragSource } = this.props;
    return connectDragSource(
      <div style={getStyles(this.props)}>
         {/*生成Box的title属性*/}
        <Box title={title} />
      </div>,
    );
  }
}
