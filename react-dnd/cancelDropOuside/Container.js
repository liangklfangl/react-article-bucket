import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react/lib/update';
import { DropTarget, DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';
import ItemTypes from './ItemTypes';

const style = {
  width: 400,
  border:"1px solid red"
};

const cardTarget = {
  drop() {
    console.log('container处理的drop');
  },
};

//(1)我们将container同时设置为@DragDropContext，@DropTarget
@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))
export default class Container extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    this.findCard = this.findCard.bind(this);
    this.state = {
      cards: [{
        id: 1,
        text: 'Write a cool JS library',
      }, {
        id: 2,
        text: 'Make it generic enough',
      }, {
        id: 3,
        text: 'Write README',
      }, {
        id: 4,
        text: 'Create some examples',
      }, {
        id: 5,
        text: 'Spam in Twitter and IRC to promote it',
      }, {
        id: 6,
        text: '???',
      }, {
        id: 7,
        text: 'PROFIT',
      }],
    };
  }

 /**
  * 移动card
  * props.moveCard(draggedId, overIndex)
  * @param  {[type]} id     被拖动的元素的id值
  * @param  {[type]} atIndex DropTarget即hover的那个Card的id值
  * @return {[type]}         [description]
  */
  moveCard(id, atIndex) {
    const { card, index } = this.findCard(id);
    //找到被拖动的Card的属性，如：
    // {
    //   id: 4,
    //   text: 'Create some examples',
    // }
   //以及该card在this.state.cards中的下标值
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1],
          //首先删除我们的DragSource，同时在我们DragTarget前面插入我们的DragSource
          [atIndex, 0, card],
        ],
      },
    }));
  }

 /**
  * 查找card
  * @param  {[type]} id [description]
  * @return {[type]}    [description]
  */
  findCard(id) {
    const { cards } = this.state;
    const card = cards.filter(c => c.id === id)[0];
    return {
      card,
      index: cards.indexOf(card),
    };
  }

  render() {
    const { connectDropTarget } = this.props;
    const { cards } = this.state;
    return connectDropTarget(
      <div style={style}>
        {cards.map(card => (
          <Card
            key={card.id}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
            findCard={this.findCard}
          />
        ))}
      </div>,
    );
  }
}
