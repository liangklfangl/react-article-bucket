### 运行

```js
sudo npm install webpackcc -g
npm install 
npm run dev
```

### 说明
(1)我们通过context将Store放到context中，同时那些需要从context中获取数据的组件全部通过高阶组件包裹，所以不用对于每一个组件都声明contextTypes。而这一切全部在wire方法中完成了：

```js
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

```
(2)同时，我们通过contextTypes声明的属性必须和Store中完全一致，否则部分属性获取到的就是空值。

```js
 Inject.contextTypes = {
    data: React.PropTypes.object,
    get: React.PropTypes.func,
    register: React.PropTypes.func,
    handlers : React.PropTypes.array,
    onChange : React.PropTypes.func
  };
```
这对应于我们如下的Store签名:

```js
export default {
  handlers:[],
  data: {},
  //用于注册data发生变化后重新渲染的回调函数
  onChange(callback){
    this.handlers.push(callback);
  },
  get(key) {
    return this.data[key];
  },
  //往应用的data中注入新的数据并要求顶层组件重新渲染
  register(key, value) {
    this.data[key] = value;
    this.handlers.forEach((handler) =>{
      handler();
    });
  }
};
```
而且要注意，我们的Header组件不能是[React.PureComponent](https://github.com/liangklfangl/react-article-bucket/tree/master/react-context/Context-Problematic)

(3)高阶组件包裹函数必须将从顶层传下来的context中的函数进行bind操作，否则this不是我们最上层组件传递下面的context对象了。

```js
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
```

