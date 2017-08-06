 import React from "react";
 import ReactDOM from "react-dom";
 var _ = require('lodash');
 const Immutable = require('immutable');
 const styles =  require("./index.scss");


/**
 * Header类，用于在页面的顶部
 */
class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      showModal: false
    }
  }

  render() {
    return (
      <div className='header'>
        <div className='header-content header-content__left'>
        </div>
        <div className='header-content header-content__middle'>
          Flash Cards
        </div>
        <div className='header-content header-content__right'>
        </div>
      </div>
    )
  }
}

/**
 * Card类ard，实例化方式
 *  <Card
        frontContent={card.get('word')}
        backContent={card.get('description')}
        showNextCard={this.boundShowNextCard}
        showPrevCard = {this.boundShowPrevCard}
        cardNumber={this.state.cardNumber}
      />
 */
class Card extends React.Component {

  constructor() {
    super();
    //默认不显示答案，必须点击的时候才显示
    this.state = {
      showAnswer: false
    }
  }

  render() {
    const content = this.state.showAnswer ? this.props.backContent : this.props.frontContent;
    const iconClass = this.state.showAnswer ? 'reply' : 'share';
    const cardClass = this.state.showAnswer ? 'back' : '';
    const contentClass = this.state.showAnswer ? 'back' : 'front';
    const actionClass = this.state.showAnswer ? 'active' : '';
    //如果是显示答案的时候我们显示"backContent",同时iconClass为'reply'
    return (
      <div
        className={`card ${cardClass}`}
        onClick={() => this.setState({showAnswer: !this.state.showAnswer})}
      >
      {/*点击卡片切换是否显示答案*/}
      <span className='card__counter'>{this.props.cardNumber + 1}</span>
      {/*显示当前是第几个卡片*/}
      <div
          className='card__flip-card'
          onClick={ () => {
            this.setState({showAnswer: !this.state.showAnswer});
          }}
        >
          <span className={`fa fa-${iconClass}`}/>
        </div>
      {/*点击分享按钮的时候也会显示内容*/}
        <div className={`card__content--${contentClass}`}>
          {content}
        </div>
       {/*根据this.state.showAnswer来显示不同的内容*/}
        <div className={`card__actions ${actionClass}`}>
       {/*显示下一张上一张，同时默认是不显示答案的*/}
          <div
            className='card__prev-button'
            onClick={() => {
              this.props.showPrevCard();
              this.setState({showAnswer: false});
            }}
          >
            Prev
          </div>
        {/*显示下一张上一张，同时默认是不显示答案的*/}
          <div
            className='card__next-button'
            onClick={() => {
              this.props.showNextCard();
              this.setState({showAnswer: false});
            }}
          >
            Next
          </div>
        </div>
      </div>
    );
  }
}

/**
 * CardContainer类
 */
class CardContainer extends React.Component {
  constructor() {
    super();
    //其中CardContainer表示存放了那些Card对象，可以通过this.state.cards来访问
    this.state = {
      cards: Immutable.fromJS([{
        word: 'Jazz',
        description: 'A type of music of black American origin characterized by improvisation, syncopation, and usually a regular or forceful rhythm, emerging at the beginning of the 20th century.',
      }, {
        word: 'Reggae',
        description: 'Music like Bob Marley, man.',
      }, {
        word: 'Folk',
        description: 'Music like Bob Dylan, man.',
      }
    ]),
      cardNumber: 0
      //当前显示的卡片的下标
    };
    this.boundCallback = this.hideCreateCard.bind(this);
    this.boundCreateCard = this.setCard.bind(this);
    this.boundShowPrevCard = this.showPrevCard.bind(this);
    this.boundShowNextCard = this.showNextCard.bind(this);
  }

  hideCreateCard() {
    this.setState({showModal: false});
  }

  /**
   * 显示下一张卡片，只要将cardNumber+1即可
   * @return {[type]} [description]
   */
  showNextCard() {
    if ((this.state.cardNumber + 1) !== this.state.cards.size) {
      this.setState({cardNumber: this.state.cardNumber += 1});
    }
  }

 /**
   * 显示上一张卡片，只要将cardNumber-1即可
   * @return {[type]} [description]
   */
  showPrevCard() {
    if (this.state.cardNumber !== 0) {
      this.setState({cardNumber: this.state.cardNumber -= 1});
    }
  }

 /**
  * 直接往我们的数组中push一个卡片，同时要求组件重新渲染
  * @param {[type]} card [description]
  */
  setCard(card) {
    const newCards = this.state.cards.push(card);
    this.setState({cards: newCards});
  }

  /**
   * 根据卡片的数量来显示特定的dots数量
   * @return {[type]} [description]
   */
  generateDots() {
    const times = this.state.cards.size;
    let arr = [];
    //Invokes the iteratee n times, returning an array of the results of each invocation. The iteratee is invoked with one argument; (index).
    _.times(times).forEach((num) => {
      const dotClass = num  === this.state.cardNumber ? 'active' : '';
   //如果当前的num和this.state.cardNumber是一样的，那么我们添加一个dotClass为active
   //当你点击某一个dot的时候设置当前的卡片为点击的卡片
      arr.push(
        <span
          className={`card-container__dot fa fa-circle ${dotClass}`}
          onClick={() => this.setState({cardNumber: num})}
        />
      )
    });
    return arr;
  }

 /**
  * 根据this.state.cards产生我们需要的卡片
  * @return {[type]} [description]
  */
  generateCards() {
    const cards = this.state.cards;
    //显示所有的Card集合，得到我们的Card数组
    const cardsList = cards.map((card) => {
        return (
          <Card
            frontContent={card.get('word')}
            backContent={card.get('description')}
            showNextCard={this.boundShowNextCard}
            showPrevCard = {this.boundShowPrevCard}
            cardNumber={this.state.cardNumber}
          />
          );
      })
    //显示某一个特定的卡片,这里返回的是一个React的Card实例对象
     return(cardsList.toJS()[this.state.cardNumber]);
  }
  render() {
    return (
      <div>
        <span
            className='card-container__icon  fa fa-plus'
            onClick={() => {
              this.setState({showModal: !this.state.showModal});
            }}
          />
         {/*点击是否显示遮罩层，遮罩层有特定的布局*/}
        {/*每次重新渲染的时候都会显示某一张特定的卡片*/}
        {this.generateCards()}
        <div className='card-container__dots-wrapper'>
          {this.generateDots()}
        </div>
      </div>
   );
  }
}

/**
 * Main这个类
 */
class Main extends React.Component {
  render() {
    return (
      <div className='wrapper'>
        <Header />
        <div className='content-wrapper'>
          <CardContainer />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Main />, document.getElementById('react-content'));



