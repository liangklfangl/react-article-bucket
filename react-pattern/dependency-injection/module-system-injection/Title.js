import React from 'react';
import { wire,register } from './di.js';

// var Title = function (props) {
//   return <h1>{ props.title }</h1>;
// };
class Title extends React.Component{

  updateTitle = ()=>{
    const newTitle = this.refs.title.value;
    register('my-awesome-title',newTitle);
  }

  render(){
   console.log('Title被重新渲染了',this.props.title);
    return (
       <div>
         <h1>{ this.props.title }</h1>
         <input ref="title" placeholder="Please enter new title"/>
         <button value="点击切换title" onClick={this.updateTitle}/>
       </div>
      )
  }
}

Title.propTypes = {
  title: React.PropTypes.string
};
export default wire(Title, ['my-awesome-title'], title => ({ title }));
//对象解构以后传入到第三个函数中
