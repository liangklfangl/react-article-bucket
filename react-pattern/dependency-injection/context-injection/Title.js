import React from 'react';
import wire from './wire';


class Title extends React.Component{

  updateTitle =()=>{
     const creator = this.refs.creator.value;
     this.props.register('creator',creator);
  }

  render(){
     const { creator ,config} = this.props.props;

    return (
      <div>
        <h1>配置的Name信息:{config.name}</h1>
        <h1>配置的Creator信息:{ creator }</h1>
        <input ref="creator" placeholder="请输入新的creator"/>
        <br/>
        <button onClick={this.updateTitle}/>
     </div>
      )
  }
}

Title.propTypes = {
  title: React.PropTypes.string
};

//经过wire方法处理后导出的这个组件可以获取到Store.register注册的那些组件需要自己处理的属性
export default wire(Title, ['creator','config'], function (creator,config) {
  return { creator: creator, config :config };
});
