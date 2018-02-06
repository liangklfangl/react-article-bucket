import React from "react";
import ReactDOM from "react-dom";
import Child from "./Child";
import Sibling from "./Sibling";
let localeData = {
  name:'liangklfangl',
  home:'zhejang hangzhuo'
}
export default class Texst extends React.Component{
  render(){
    console.log('localeData=====>',localeData);
    return <div>Texst组件{localeData.home}<Sibling/><Child/></div>
  }
 }
