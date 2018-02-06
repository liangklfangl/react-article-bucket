import React from "react";
import ReactDOM from "react-dom";
export default class Child extends React.Component{
  render(){
     console.log('Child中localeData=====>',localeData);
    return <div>Child组件</div>
  }
 }
