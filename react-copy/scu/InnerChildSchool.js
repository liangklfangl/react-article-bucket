import React from "react";
  const Immutable = require('immutable')
export default class InnerChildSchool extends React.Component{

 shouldComponentUpdate(nextProps = {}, nextState = {}) {
    if (!Immutable.is(this.props.information, nextProps.information)) {
        return true;
    }
    if (!Immutable.is(this.state, nextState)) {
        return true;
    }
    return false;
 }

 render(){
  console.log('InnerChildSchool重新渲染');
   return (
      <div>InnerChildSchool</div>
    )
 }
}
