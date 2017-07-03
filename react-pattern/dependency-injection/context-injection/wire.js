import React from 'react';

export default function wire(Component, dependencies, mapper) {
  class Inject extends React.Component {
    render() {
      var resolved = dependencies.map(this.context.get.bind(this.context));
      //这里得到的是dependencies指定的一个数组
      var props = mapper(...resolved);
      //这里仅仅是组件自己需要处理的属性，我们也需要将register方法传递过去，从而可以修改这个属性
      const register = this.context.register.bind(this.context);
      return React.createElement(Component, {props,register});
    }
  }
  //通过wire方法包装的函数可以获取到应用的Store对象
  //注意：这里的contextTypes声明必须和上面的dependencies中一致，否则其他的属性会获取不到
  Inject.contextTypes = {
    data: React.PropTypes.object,
    get: React.PropTypes.func,
    register: React.PropTypes.func,
    handlers : React.PropTypes.array,
    onChange : React.PropTypes.func
  };
  return Inject;
};
