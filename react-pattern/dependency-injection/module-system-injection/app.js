import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.js';
import { register,reRender } from './di.js';
register('my-awesome-title', 'React in patterns');
//注册了一个属性值
class App extends React.Component {

 constructor(props){
  super(props);
  reRender(this.forceUpdate.bind(this));
  //每次有新的状态被更新，重新渲染整个组件树
 }

  render() {
    console.log('app被重新render');
    return <Header />;
  }
};

ReactDOM.render(<App />, document.querySelector('#react-content'));
