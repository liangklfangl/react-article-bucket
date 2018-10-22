import React, { Component } from 'react';

window.data = [];

// js执行到这个位置的时候就请求，只会执行一次
getCards.then(data => {
  window.data = data;
  Base.YoukuEvent.fire('cardsReceived', data);
});

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 赋值
      data: window.data
    };
    if (window.data.length === 0) {
      // 若还没请求，则添加监听来等待数据
      Base.YoukuEvent.on('cardsReceived', data => {
        this.setState({
          data
        });
      });
    }
  }
  render() {
    return <div />;
  }
}

export default Cards;
