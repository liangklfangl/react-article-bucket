import React from 'react';
import ReactDOM from 'react-dom';
const Store = require('./dependencies');
const Switcher = require('./Switcher');
class App extends React.Component {
  constructor(props) {
    super(props);
    Store.register('open',false);
    //默认我们的Switch是关闭的
    Store.onChange(this.forceUpdate.bind(this));
    //Store.data的值发生变化以后我们要执行的回调函数
  }
  render() {
    return (
      <div>
        <Switcher
          value={ Store.get('open') }
          changeStatus={ Store.register.bind(Store) } />
      </div>
    );
  }
};

ReactDOM.render(<App />, document.querySelector('#react-content'));
