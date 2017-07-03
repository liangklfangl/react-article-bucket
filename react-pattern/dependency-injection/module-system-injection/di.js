import React from 'react';
var dependencies = {};
dependencies.updatesCallback =[];
//注册一个key
export function register(key, dependency) {
  dependencies[key] = dependency;
   dependencies.updatesCallback.forEach(callback => callback())
  return dependency;
}

export function reRender(callback){
  dependencies.updatesCallback.push(callback);
}

//获取key对应的value
export function fetch(key) {
  if (dependencies[key]) return dependencies[key];
  throw new Error(`"${ key } is not registered as dependency.`);
}
export function wire(Component, deps, mapper) {
  return class Injector extends React.Component {
    constructor(props) {
      super(props);
      //得到我们组件依赖的模块信息
    }
    render() {
      this._resolvedDependencies = mapper(...deps.map(fetch));
      return (
        <Component
          {...this.state}
          {...this.props}
          {...this._resolvedDependencies}
        />
      );
    }
  };
}
