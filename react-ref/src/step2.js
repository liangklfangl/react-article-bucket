import React from "react";
export default class Step2 extends React.Component{
  isValidated=()=>{
     console.log('我的Step2的表单值');
     //因为我这里return false了，所以不会渲染到下一个组件
     return false;
  }
  render(){
    return (<div>

      Step2
      </div>)
  }
}
