import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};

const dustbinTarget = {
  //(4)在我们的DropTarget接受到drop事件以后我们调用onDrop方法并传入我们的当前的DragSource对象
  //注意这里是获取到DragSource的状态的对象。而且获取到的就是我们在DragSource中的beginDrag中
  //放置的对象
  drop(props, monitor) {
    props.onDrop(monitor.getItem());
  },
};
 //(3)我们的DropTarget第一个参数是一个函数，而且这个函数返回的是我们的component的一个props属性
 //这里的accepts也是一个字符串 { accepts: [ItemTypes.FOOD], lastDroppedItem: null }
 // <Dustbin
 //      accepts={accepts}
 //      lastDroppedItem={lastDroppedItem}
 //      onDrop={item => this.handleDrop(index, item)}
 //      key={index}
 //    />,
@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
  };

  render() {
    const { accepts, isOver, canDrop, connectDropTarget, lastDroppedItem } = this.props;
    //lastDroppedItem来自于组件实例化时候的props
    const isActive = isOver && canDrop;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen';
    } else if (canDrop) {
      backgroundColor = 'darkkhaki';
    }
  //(4)我们的DropTarget要通过connectDropTarget包裹
    return connectDropTarget(
      <div style={{ ...style, backgroundColor }}>
        {/*实例化Dustbin的时候指定其可以接受的DragSource类型*/}
        {isActive ?
          'Release to drop' :
          `This dustbin accepts: ${accepts.join(', ')}`
        }
        {lastDroppedItem &&
          <p>Last dropped: {JSON.stringify(lastDroppedItem)}</p>
        }
      </div>,
    );
  }
}
