 import React from "react";
 const Immutable = require('immutable')
export default class ChildHome extends React.Component{
 /**
  * 判断组件是否需要更新
  * 因为传入的是immutable对象，所以可以直接通过is来得到组件是否需要重新渲染
  * @param  {Object} nextProps [description]
  * @param  {Object} nextState [description]
  * @return {[type]}           [description]
  */
  shouldComponentUpdate(nextProps = {}, nextState = {}){
    //(1)这里只有当我们的information属性的值发生变化以后才会重新渲染
     if (!Immutable.is(this.props.information, nextProps.information)) {
        return true;
      }
      if (!Immutable.is(this.state, nextState)) {
        return true;
      }
    return false;
 }

   render(){
      console.log('ChildHome组件被重新渲染');
     return (
        <div>
          ChildHome
          {this.props.children}
        </div>
      )
   }
 }
