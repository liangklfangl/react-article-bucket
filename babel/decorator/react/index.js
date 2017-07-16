import ErrorComponent from "./ErrorComponent.js";
import React from "react";
/**
 *我们这个decorator接受一个组件，即抛出错误后的组件作为一个参数，然后返回一个函数，该函数
 *接受我们的自己的组件作为一个参数
 */
const safeDecorator = ErrorComponent => (Component) => {
  const originRender = Component.prototype.render;
  Component.prototype.render = function (...params) {
    let res = null;
    try {
      res = originRender.apply(this, params);
    } catch (e) {
      console.error(e);
      if (typeof ErrorComponent === 'function') {
        //new一个实例，然后调用render方法
        res = new ErrorComponent().render.apply(this, params);
      } else {
        res = null;
      }
    }
  //render方法默认返回的是调用originalRender的返回值，如果在抛出错误的时候就直接调用ErrorComponent的render
  //方法。如果抛出错误的时候的组件不是function，那么返回空的值
    return res;
  };
  //这里必须返回Component，即已经被装饰过的Component
  return Component;
};


@safeDecorator(ErrorComponent)
export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    throw new Error('err');
    return (
      <div>
        Hello, world
      </div>
    );
  }

}
