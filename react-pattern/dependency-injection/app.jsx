import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
//Header对象
import CONFIG from './config';
import dependencies from './dependencies';
//这样我们的context中已经注册了config对象了
dependencies.register('config', CONFIG);
//CONFIG对象是如下签名：
//{
//   name: 'React in patterns'
// };
class App extends React.Component {
  getChildContext() {
    return dependencies;
  }
  render() {
    return <Header />;
  }
};
//这是我们放入到context中的dependencies对象
App.childContextTypes = {
  data: React.PropTypes.object,
  get: React.PropTypes.func,
  register: React.PropTypes.func
};

ReactDOM.render(<App />, document.querySelector('#container'));
