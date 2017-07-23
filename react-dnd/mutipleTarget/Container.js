import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend, { NativeTypes } from 'react-dnd-html5-backend';
import Dustbin from './Dustbin';
import Box from './Box';
import ItemTypes from './ItemTypes';

@DragDropContext(HTML5Backend)
//(1)应用顶层组件要通过@DragDropContext包裹
export default class Container extends Component {
  constructor(props) {
    super(props);
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
   * 每次有drop事件被触发的时候回更新lastDroppedItem为最新的DragSource对象，同时会更新我们的
   * droppedBoxNames表示那些DragSource已经被放置，而且是通过setState来完成的，所以会导致下面的
   * Dustbin组件和Box组件都会更新，其中Dustbin中显示lastDroppedItem的属性，而Box中通过isDropped
   * 来更新UI状态
   * @param  {[type]}  boxName [description]
   * @return {Boolean}         [description]
   */
  isDropped(boxName) {
    return this.state.droppedBoxNames.indexOf(boxName) > -1;
  }

  render() {
    const { boxes, dustbins } = this.state;
    return (
      <div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {dustbins.map(({ accepts, lastDroppedItem }, index) =>
             //我们的Dustbin接受accepts数组，lastDroppedItem元素，onDrop回调函数当有元素被drop的时候调用
            <Dustbin
              accepts={accepts}
              lastDroppedItem={lastDroppedItem}
              onDrop={item => this.handleDrop(index, item)}
              key={index}
            />,
            //在我们的Dustbin的drop事件中我们的处理方式如下:
            // props.onDrop(monitor.getItem());
            // 即将我们的DropTarget对象传入给上层组件container
          )}
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          {boxes.map(({ name, type }, index) =>
         //我们的Box接受name,type,isDrop回调函数
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
 /**
  * this.handleDrop(index, item)
  * @param  {[type]} index 表示这个Dustbin的具体的下标
  * @param  {[type]} item  表示这个Dustbin的对象本身
  * @return {[type]}       [description]
  */
  handleDrop(index, item) {
    const { name } = item;
    //这个item是dragSource对象，其值是beginDrag方法的返回值
    this.setState(update(this.state, {
      dustbins: {
        [index]: {
          //修改Dustbin中的lastDroppedItem，那么我们的Dustbin的UI会得到更新
          lastDroppedItem: {
            $set: item,
          },
        },
      },
      //同时在我们的droppedBoxNames中放置我们DragSource对象的name信息
      droppedBoxNames: name ? {
        $push: [name],
      } : {},
    }));
  }
}
