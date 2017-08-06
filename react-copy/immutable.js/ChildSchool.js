 import React from "react";
  const Immutable = require('immutable')
export default class ChildSchool extends React.Component{
  /**
   * 判断组件是否需要更新,因为传入我们组件的props本身就是immutable对象，所以可以直接通过is来判断
   * Immutable.is 比较的是两个对象的 hashCode 或 valueOf（对于 JavaScript 对象）。由于 immutable 内部使用了 Trie 数据结构来存储，只要两个对象的 hashCode 相等，值就是一样的。这样的算法避免了深度遍历比较，性能非常好。
   * @param  {Object} nextProps [description]
   * @param  {Object} nextState [description]
   * @return {[type]}           [description]
   */
  shouldComponentUpdate(nextProps = {}, nextState = {}) {
    if (!Immutable.is(this.props.information.get("school"), nextProps.information.get('school'))) {
        return true;
    }
    if (!Immutable.is(this.state, nextState)) {
        return true;
    }
    return false;
 }

   render(){
      console.log('ChildSchool组件被重新渲染');
     return (
        <div>
          ChildSchool
        </div>
      )
   }
 }


