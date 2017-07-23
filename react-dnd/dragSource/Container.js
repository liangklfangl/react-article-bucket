import React, { Component } from 'react';
import update from 'react/lib/update';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Card from './Card';

const style = {
  width: 400,
};

@DragDropContext(HTML5Backend)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.moveCard = this.moveCard.bind(this);
    //生成多个卡片对象
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
        text: 'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
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
   * [moveCard description]
   * @param  {[type]} dragIndex  表示被拖拽的元素的下标
   * @param  {[type]} hoverIndex 表示hover的元素的下标
   * @return {[type]}            [description]
   */
  moveCard(dragIndex, hoverIndex) {
    const { cards } = this.state;
    const dragCard = cards[dragIndex];
    //被拖拽的card
    //其中update方法来自于'react/lib/update'
    //我们的react的update方法可以参考这里:https://facebook.github.io/react/docs/update.html
    //这里的$splice相当于执行了两个方法
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [dragIndex, 1],
          //删除我们的dragIndex,即拖动的Drag元素。指定下标即可
          [hoverIndex, 0, dragCard],
          //在我们的hoverIndex后插入我们的dragCard
        ],
      },
    }));
  }

  render() {
    const { cards } = this.state;
    //获取所有的card对象
    //  {/*我们将id和index都传入我们的Card组件作为props*/}

    return (
      <div style={style}>
        {cards.map((card, i) => (
          <Card
            key={card.id}
            index={i}
            id={card.id}
            text={card.text}
            moveCard={this.moveCard}
          />
        ))}
      </div>
    );
  }
}
