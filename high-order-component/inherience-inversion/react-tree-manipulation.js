import React from "react";
import ReactDOM from "react-dom";

function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      const elementsTree = super.render()
      console.log('elementsTree---',elementsTree);
      //(2)此时调用父级组件的render方法得到React组件树，每一个rendersTree都有props,type,ref,key,$$typeof等属性
      let newProps = {};
      //如果render方法中返回的是一个<input/>字符串
      if (elementsTree && elementsTree.type === 'input') {
        newProps = {value: 'may the force be with you'}
      }
      const props = Object.assign({}, elementsTree.props, newProps)
      //(3)通过React.cloneElement来对调用super.render返回的组件树进行clone并附加新的属性
      const newElementsTree = React.cloneElement(elementsTree, props, elementsTree.props.children)
      return newElementsTree
    }
  }
}
@iiHOC
class TreeManipulation extends React.Component{
  state={
    name:"liangklfangl"
  }
  sayHello(){

  }
  render(){
    return (
         <div>TreeManipulation</div>
      )
  }
}
//(1)TreeManipulation此时是已经经过HOC处理后的结果了
ReactDOM.render(<TreeManipulation/>,document.getElementById('react-content'));
