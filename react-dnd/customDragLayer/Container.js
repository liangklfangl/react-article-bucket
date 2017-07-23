import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import { DropTarget } from 'react-dnd';
import shouldPureComponentUpdate from './shouldPureComponentUpdate';
import ItemTypes from './ItemTypes';
import DraggableBox from './DraggableBox';
import snapToGrid from './snapToGrid';

const styles = {
  width: 300,
  height: 300,
  border: '1px solid red',
  position: 'relative',
};

/**
 * @DropTarget的处理逻辑
 * @type {Object}
 */
const boxTarget = {
  drop(props, monitor, component) {
    const delta = monitor.getDifferenceFromInitialOffset();
    //获取当前位置和初始被拖动的时候的位置的偏移量
    const item = monitor.getItem();
    //获取被拖动的元素
    let left = Math.round(item.left + delta.x);
    let top = Math.round(item.top + delta.y);
    //获取DragSource应该处于的位置
    if (props.snapToGrid) {
      [left, top] = snapToGrid(left, top);
    }
    //移动特定的Box
    component.moveBox(item.id, left, top);
  },
};

@DropTarget(ItemTypes.BOX, boxTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
//(2)这里是我们的@DropTarget对象
export default class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    snapToGrid: PropTypes.bool.isRequired,
  }
  shouldComponentUpdate = shouldPureComponentUpdate;
  constructor(props) {
    super(props);
    //state维护一个boxes集合
    this.state = {
      boxes: {
        a: { top: 20, left: 80, title: 'Drag me around' },
        b: { top: 180, left: 20, title: 'Drag me too' },
      },
    };
  }

  /**
   * 将指定id的Box移动到指定的left/top值处,这里的$merge会出现top.left替换成为移动
   * https://github.com/liangklfang/immutability-helper
   * @param  {[type]} id   [description]
   * @param  {[type]} left [description]
   * @param  {[type]} top  [description]
   * @return {[type]}      [description]
   */
  moveBox(id, left, top) {
    this.setState(update(this.state, {
      boxes: {
        [id]: {
          $merge: { left, top },
        },
      },
    }));
  }
  /**
   * item:{ top: 20, left: 80, title: 'Drag me around' }
   * key:当前box的下标
   */
  renderBox(item, key) {
    return (
      <DraggableBox key={key} id={key} {...item} />
    );
  }
  render() {
    const { connectDropTarget } = this.props;
    const { boxes } = this.state;
    return connectDropTarget(
      <div style={styles}>
        {Object
          .keys(boxes)
          .map(key => this.renderBox(boxes[key], key))
        }
      </div>,
    );
  }
}
