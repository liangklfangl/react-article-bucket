import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header';
import CONFIG from './config';
import Store from './dependencies';

Store.register('config', CONFIG);
//注入了config表示我们的配置信息
Store.register('creator','liangklfangl');
//这个配置用于演示当我们的Store发生了变化以后我们要求最顶层组件重新渲染
/**
 * 注意：这里使用context的情况下，我们的App组件虽然要求forceUpdate了，但是其子组件即Header组件的属性props
   没有发生变化，因此不会重新渲染。所以，这种情况就是context存在的问题了。
 */
class App extends React.Component {

  constructor(props){
    super(props);
    Store.onChange(this.forceUpdate.bind(this));
  }
  //将我们关心的Store状态放在context中，如果需要Store的地方直接指定
  //contextType来获取到Store对象，从而实现依赖注入
  getChildContext() {
    return Store;
  }
  render() {
    return <Header />;
  }
};

App.childContextTypes = {
  data: React.PropTypes.object,
  get: React.PropTypes.func,
  register: React.PropTypes.func,
  onChange: React.PropTypes.func,
  handlers :React.PropTypes.array
};

ReactDOM.render(<App />, document.querySelector('#react-content'));
