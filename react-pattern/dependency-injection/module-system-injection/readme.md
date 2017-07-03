### 模块中的全局变量Store
```js
import React from 'react';
//其中下面的dependencies对象扮演的就是我们的Store对象
var dependencies = {};
//注册一个key
export function register(key, dependency) {
  dependencies[key] = dependency;
  return dependency;
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
      this._resolvedDependencies = mapper(...deps.map(fetch));
      //获取到的相应属性会通过我们的mapper方法继续处理
    }
    render() {
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
```
此时采用ES6的模式来引入我们的这个模块，那么只会导入该模块的全局变量以及相应的方法:

```js
//app.js
import { register } from './di.jsx';
//此时我们的app.js会获取到上面的模块的dependencies全局变量以及register方法，但是不是立即执行代码，这和commonjs是不一样的
register('my-awesome-title', 'React in patterns');
```
此时app.js就已经引入了我们的dependencies全局变量了，对于那些想要从该dependencies获取数据的组件来说，只要简单的通过上面的wire方法处理就可以了。如下面的Title组件：

```js
//Header.js
import React from 'react';
import { wire } from './di.js';
var Title = function (props) {
  return <h1>{ props.title }<\/h1>;
};
Title.propTypes = {
  title: React.PropTypes.string
};
export default wire(Title, ['my-awesome-title'], title => ({ title }));
//对象解构以后传入到第三个函数中
```
经过这里的wire方法处理，我们的Header组件就可以获取到dependencies中的全局变量进行显示了。

### 修改Store的值而重新渲染
在我们的app.js中注册了一个事件处理函数，用于检测当我们的store发生变化以后重新渲染顶层组件。

```js
onstructor(props){
  super(props);
  reRender(this.forceUpdate.bind(this));
  //每次有新的状态被更新，重新渲染整个组件树
 }
```
这样，当我们的组件调用register方法修改了Store的状态的时候我们的组件树都会重新渲染了。
