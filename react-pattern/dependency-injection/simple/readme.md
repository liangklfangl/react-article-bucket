### React的context实现依赖注入解决组件树过深的问题

首先：我们来介绍一个高阶函数，该函数对我们的原始组件进行装饰，并提供了访问应用context中的相应声明：

```js
 Inject.contextTypes = {
    data: React.PropTypes.object,
    get: React.PropTypes.func,
    register: React.PropTypes.func
  };
```
其实这相当于指明了应用的store签名，之所以以HOC的方式来指明是因为这样的话，每一个组件都可以通过该方法来访问context中的内容，而不用在每一个组件中都声明contextTypes。下面是函数的签名：

```js
//wire.js
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
```
到了这里我们先来看一下我们的context中的数据结构：

```js
//dependencies.js
export default {
  data: {},
  get(key) {
    return this.data[key];
  },
  register(key, value) {
    this.data[key] = value;
  }
};
```
也就是说我们所有的context中的数据是一个对象，但是该对象有get方法和register方法来向context中注册数据。

接下来我们看看组件中如何使用上面这个函数：

```js
export default {
  name: 'React in patterns'
};
```
上面是我们应用的配置信息。

```js
//App.js
import React from 'react';
import ReactDOM from 'react-dom';
import Header from './Header.jsx';
//Header对象
import CONFIG from './config';
import dependencies from './dependencies';
//这样我们的context中已经注册了config对象了
dependencies.register('config', CONFIG);
//CONFIG对象是如下签名：
//{
//   name: 'React in patterns'
// };
class App extends React.Component {
  getChildContext() {
    return dependencies;
  }
  render() {
    return <Header />;
  }
};
//这是我们放入到context中的dependencies对象
App.childContextTypes = {
  data: React.PropTypes.object,
  get: React.PropTypes.func,
  register: React.PropTypes.func
};
ReactDOM.render(<App />, document.querySelector('#container'));
```
也就是说，我们在最上层的组件的context中注册了我们应用所需要的配置信息，然后逐层向下传递。我们看看Header.js的内容

```js
import React from 'react';
import Title from './Title.jsx';
//Header组件里面继续使用Title组件
export default function Header() {
  return (
    <header>
      <Title />
    <\/header>
  );
}
```
我们继续来看看Title.js的内容：

```js
import React from 'react';
import wire from './wire';
function Title(props) {
  return <h1>{ props.title }<\/h1>;
}
//Title组件必须指定Title.proTypes
Title.propTypes = {
  title: React.PropTypes.string
};
//这是我们最深层次的组件实例
export default wire(Title, ['config'], function (config) {
  return { title: config.name };
});
```

到了这里，你应该更多的关注于wire方法。在wire方法里面，我们通过HOC的方式来实现了contextTypes。因此，*经过包装*的Title组件是可以获取到context中的所有信息的。其首先获取到config属性，该属性在App组件中通过register方法进行了注册，获取到config以后我们会将config对象传入到mapper中，从而返回了我们Component需要的props属性，即 {title: config.name}。这样的话，我们的Componet就可以根据这些props属性进行UI渲染了。

这样做的好处：

(1)高阶组件中声明了contextTypes，只要经过wire方法包装的组件都是可以获取到context中的值的。这样可以避免contextTypes需要在每一个组件中都声明一次

(2)使用了context，当组件树嵌套过深的情况下可以防止中间层组件需要处理那些它不需要关心的属性。

(3)如果需要子组件修改context从而最顶层组件重新渲染可以继续[查看这里](./index.md),他会为我们的Store注册事件，从而监听Store的变化，每次Store变化后都要求最顶层组件重新渲染，一个简单的方法就是forceUpdate

(4)React官网本身不建议使用context，如果你想要不使用context而实现同样的功能，可以仔细阅读这里的[模块系统](https://github.com/liangklfang/react-in-patterns/tree/master/patterns/dependency-injection#dependency-injection-powered-by-an-ioc-container)。demo代码可以[点击这里](../module-system-injection/readme.md)

