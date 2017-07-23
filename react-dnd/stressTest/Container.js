import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import shuffle from 'lodash/shuffle';
import Dustbin from './Dustbin';
import Box from './Box';
import ItemTypes from './ItemTypes';

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    //维护dustbin和boxes属性
    this.state = {
      dustbins: [
        { accepts: [ItemTypes.GLASS], lastDroppedItem: null },
        { accepts: [ItemTypes.FOOD], lastDroppedItem: null },
        { accepts: [ItemTypes.PAPER, ItemTypes.GLASS, NativeTypes.URL], lastDroppedItem: null },
        { accepts: [ItemTypes.PAPER, NativeTypes.FILE], lastDroppedItem: null },
      ],
      boxes: [
        { name: 'Bottle', type: ItemTypes.GLASS },
        { name: 'Banana', type: ItemTypes.FOOD },
        { name: 'Magazine', type: ItemTypes.PAPER },
      ],
      droppedBoxNames: [],
    };
  }

  /**
   * 挂载了我们的组件以后执行动态变化
   * @return {[type]} [description]
   */
  componentDidMount() {
    this.interval = setInterval(() => this.tickTock(), 1000);
  }
  /**
   * 每隔1000ms随机打乱boxes和dustbins里面元素的位置
   * @return {[type]} [description]
   */
  tickTock() {
    this.setState({
      boxes: shuffle(this.state.boxes),
      dustbins: shuffle(this.state.dustbins),
    });
  }
  /**
   * 卸载该组件后我们不再随机变动元素位置
   * @return {[type]} [description]
   */
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  isDropped(boxName) {
    return this.state.droppedBoxNames.indexOf(boxName) > -1;
  }

  render() {
    const { boxes, dustbins } = this.state;
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {dustbins.map(({ accepts, lastDroppedItem }, index) =>
            <Dustbin
              accepts={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={item => this.handleDrop(index, item)}
              key={index}
            />,
          )}
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {boxes.map(({ name, type }, index) =>
            <Box
              name={name}
              type={type}
              isDropped={this.isDropped(name)}
              key={index}
            />,
          )}
        </div>
      </div>
    );
  }
// const dustbinTarget = {
//   drop(props, monitor) {
//     props.onDrop(monitor.getItem());
//   },
// };
// 其中index表示我们当前的Dustbin的位置
// 其中item表示我们的DragSource对象
  handleDrop(index, item) {
    const { name } = item;
    this.setState(update(this.state, {
      dustbins: {
        [index]: {
          lastDroppedItem: {
            $set: item,
          },
        },
      },
      droppedBoxNames: name ? {
        $push: [name],
      } : {},
    }));
  }
}
