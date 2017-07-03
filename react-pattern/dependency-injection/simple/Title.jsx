import React from 'react';
import wire from './wire';

class Title extends React.Component{



  render(){

    const {title} = this.props;

    return (
         <h1>
         Title: {title}
         </h1>
       )
  }
}


//Title组件必须指定Title.proTypes
Title.propTypes = {
  title: React.PropTypes.string
};
//这是我们最深层次的组件实例
export default wire(Title, ['config'], function (config) {
  return { title: config.name };
});
