import {generateRandomKey} from "./util";
import Texst from "./index";
import React from "react";
import ReactDOM from "react-dom";
class Test extends React.Component{
  render(){
    return <div>
        <Texst key={generateRandomKey()}/>
    </div>
  }
}

for(let i=0;i<5;i++){
   ReactDOM.render(<Test id={i}/>,document.getElementById('react-content'));
}
