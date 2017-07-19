import React from "react";
import ReactDOM from "react-dom";
function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      //(1)本身是通过继承WrappedComponent，所以当然可以通过this获取到WrappedComponent上的所有的
      //方法
      console.log('this===',this);
      return super.render()
    }
  }
}

@iiHOC
class Simple extends React.Component{
  state={
    name:"liangklfangl"
  }
  sayHello(){

  }
  render(){
    return (
        <div>Simple</div>
      )
  }
}

ReactDOM.render(<Simple/>,document.getElementById('react-content'));
