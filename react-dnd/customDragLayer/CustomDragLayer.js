import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragLayer } from 'react-dnd';
import ItemTypes from './ItemTypes';
import BoxDragPreview from './BoxDragPreview';
import snapToGrid from './snapToGrid';

//(4)我们的@DragLayer成了整个屏幕的宽度和高度了
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  border:"1px solid red",
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};

/**
 * 获取currentOffset和initialOffset
 * @param  {[type]} props [description]
 * @return {[type]}       [description]
 */
function getItemStyles(props) {
  //只要在拖动中，那么我们的currentOffset是持续变化的，这一点很容易理解
  const { initialOffset, currentOffset } = props;
  if (!initialOffset || !currentOffset) {
    //如果initialOffset和currentOffset任何一个为null(比如拖动结束后两者都是空，因为它获取的是当前被拖动的元素的坐标值)，那么我们将itemStyle的display设置为'none'
    return {
      display: 'none',
    };
  }
  let { x, y } = currentOffset;
  //当前DragSource相对于屏幕的x,y的位置
  if (props.snapToGrid) {
    x -= initialOffset.x;
    y -= initialOffset.y;
    //表示x,y方向元素的`移动量`
    [x, y] = snapToGrid(x, y);
    x += initialOffset.x;
    y += initialOffset.y;
    //此时表示元素在x,y方向的`新的位置`
  }
  //移动到一个全新的位置，这里的位置是最终在页面中显示的位置
  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    border:"1px solid blue",
    WebkitTransform: transform,
  };
}

//(3)通过@DragLayer对我们的自定义的DragLayer进行装饰
@DragLayer(monitor => ({
  item: monitor.getItem(),
  itemType: monitor.getItemType(),
  initialOffset: monitor.getInitialSourceClientOffset(),
  currentOffset: monitor.getSourceClientOffset(),
  isDragging: monitor.isDragging(),
}))
//(1)实例化的时候我们是这样处理的<CustomDragLayer snapToGrid={snapToGridWhileDragging} />
export default class CustomDragLayer extends Component {
  static propTypes = {
    item: PropTypes.object,
    itemType: PropTypes.string,
    //intialOffset即初始的x,y的位置
    initialOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    //currentOffset表示当前的DragSource所处的位置
    currentOffset: PropTypes.shape({
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    }),
    isDragging: PropTypes.bool.isRequired,
    snapToGrid: PropTypes.bool.isRequired,
  };

  renderItem(type, item) {
    switch (type) {
      case ItemTypes.BOX:
      //实例化一个BoxDragPreview对象
        return (<BoxDragPreview title={item.title} />);
      default:
        return null;
    }
  }

  render() {
    const { item, itemType, isDragging } = this.props;
    //item表示我们被拖拽的对象，itemType表示被拖拽对象的类型，isDragging表示是否在拖动
    if (!isDragging) {
      return null;
    }
    return (
      <div style={layerStyles}>
        <div style={getItemStyles(this.props)}>
          {/*这里的一层div是必须的，它能够保证元素平滑移动，而且是相对于当前位置的，否则会出现跳动的结果*/}
          {this.renderItem(itemType, item)}
        </div>
      </div>
    );
  }
}
