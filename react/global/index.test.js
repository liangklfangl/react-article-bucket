import {generateRandomKey} from "./util";
import Texst from "./index";
import React from "react";
import ReactDOM from "react-dom";
class Test extends React.Component{
  state={
    key:0
  }
  unload=()=>{
    this.setState({
      key:++this.state.key
    });
  }
  render(){
    return <div>
        <Texst key={this.state.key}/>
        <button onClick={this.unload}>卸载Test</button>
    </div>
  }
}

ReactDOM.render(<Test/>,document.getElementById('react-content'));
