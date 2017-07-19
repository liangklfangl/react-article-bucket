import React from "react";
import ReactDOM from "react-dom";
function refsHOC(WrappedComponent) {
  return class RefsHOC extends React.Component {
  //我们的WrappedComponent被挂载后具有ref，其ref是一个函数，挂载的时候就会传入挂载的这个实例对象，即wrappedComponentInstance
    proc(wrappedComponentInstance) {
      console.log('wrappedComponentInstance====',wrappedComponentInstance);
      //可以获取到挂载的组件的context,state,props,refs,updater等等
      wrappedComponentInstance.method()
    }
    render() {
      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})
      //(2)通过这里为我们的WrappedComponent添加ref属性，其值为一个函数，这个函数会接受到一个参数，其参数就是
      //被包裹的WrappedComponent的实例化对象
      return <WrappedComponent {...props}/>
    }
  }
}
@refsHOC
class Main extends React.Component{
   state={
     age:26
   }
   method(){
     console.log('WrappedComponent的method方法被调用');
   }
   render(){
     return (
       <div ref="name">
           Main
      </div>)
   }
}
//(1)此时的Main是经过高阶组件装饰后的组件
ReactDOM.render(<Main name="liangklfangl"/>,document.getElementById('react-content'));
