import React from 'react';
/**
 * [wire description]
 * @param  {[type]} Component    我们的组件Component的class
 * @param  {[type]} dependencies 在context中那些属性是要被作为props传递到我们的最终的组件中的
 * @param  {[type]} mapper       对我们要传入到组件的属性进行进一步的处理
 * @return {[type]}              [description]
 * 该方法的调用方式如下:
 * wire(Title, ['config'], function (config) {
  return { title: config.name };
 });
 */
export default function wire(Component, dependencies, mapper) {
  class Inject extends React.Component {
    render() {
      var resolved = dependencies.map(this.context.get.bind(this.context));
      //这是我们的context中的自己关心的那一部分内容
      var props = mapper(...resolved);
       //将我们自己关心的那一部分数据放入到我们的mapper函数中继续处理成为我们Component最终的props
      return React.createElement(Component, props);
    }
  }
  //这是我们的dependencies的内部签名，但是是通过高阶组件的方式来定义的，所以通过wire方法处理的组件都是可以获取
  //到我们最外层的App组件中在context中声明的对象的
  Inject.contextTypes = {
    data: React.PropTypes.object,
    get: React.PropTypes.func,
    register: React.PropTypes.func
  };
  return Inject;
};
