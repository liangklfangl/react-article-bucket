var React = require('react');
const ReactDOM = require('react-dom');
var { Map, List } = require('immutable');

class Simple extends React.Component{

 state = {
      data: Map(
         { count: 0,
          items: List()
         })
    }

  /**
   * setState第一个值为上一次的state的值，每次将data.count+1
   * @return {[type]} [description]
   */
  handleCountClick = () =>{
    this.setState(({data}) => ({
      data: data.update('count', v => v + 1)
    }));
  }

 /**
  * 每次push一个count值到我们的this.state.items
  * @return {[type]} [description]
  */
  handleAddItemClick = ()=>{
    this.setState(({data}) => ({
      data: data.update('items', list => list.push(data.get('count')))
    }));
  }

  render() {

    var data = this.state.data;
     // for(const key in this.state.data){
     //   console.log('key===',key);
     // }
     //此时的key就是我们的Map对象具有的所有的方法

    return (
      <div>
        <button onClick={this.handleCountClick}>Add to count</button>
        <button onClick={this.handleAddItemClick}>Save count</button>
        <div>
          Count: {data.get('count')}
        </div>
        Saved counts:
        <ul>
          {/*每次push一个元素到集合中，然后从集合中即data.get('items')中获取到值
             这是我们常见的从immutable.js中获取数据的方法
            */}
          {data.get('items').map((item,index) =>
            <li key={index}>Saved: {item}</li>
          )}
        </ul>
      </div>
    );
  }


}
ReactDOM.render(<Simple />, document.getElementById('react-content'));
