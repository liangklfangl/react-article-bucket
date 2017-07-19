import React from "react";
import ReactDOM from "react-dom";

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName ||
         WrappedComponent.name ||
         'Component'
}
export function IIHOCDEBUGGER(WrappedComponent) {
  return class II extends WrappedComponent {
    render() {
            console.log("WrappedComponent==",WrappedComponent.displayName);
            //WrappedComponent的displayName输出为undefined
            //可以通过getDisplayName来设置
         console.log("getDisplayName==",getDisplayName(WrappedComponent));
      return (
        <div>
          <h2>HOC Debugger Component</h2>
          <p>Props</p> <pre>{JSON.stringify(this.props, null, 2)}</pre>
          <p>State</p><pre>{JSON.stringify(this.state, null, 2)}</pre>
          {super.render()}
          {/*实例化我们的WrappedComponent组件*/}
        </div>
      )
    }
  }
}
@IIHOCDEBUGGER
class PropsDebug extends React.Component{
  state={
    name:"liangklfangl"
  }
  sayHello(){

  }
  render(){
    return (
         <div>PropsDebug</div>
      )
  }
}
PropsDebug.displayName ="PropsDebug";
ReactDOM.render(<PropsDebug school="DUT"/>,document.getElementById('react-content'));
