#### 1.Redux导致的组件多余的渲染问题
请仔细阅读[React 组件间通讯](http://taobaofed.org/blog/2016/11/17/react-components-communication/)的文章的最后一个例子，最后的输出结果为:

![](https://img.alicdn.com/tfs/TB1tsBQNVXXXXaGaXXXXXXXXXXX-1190-216.png)

这是因为在最后一个定时器中是如下的代码:
```js
   setTimeout(() => {
      store.dispatch({
        type: 'child_2_1',
        data: 'bye'
      })
    }, 2000);
```
此时你必须了解redux的观察者模式，当你dispatch一个事件的时候，我们的Child_2与Child_2_1中subscribe的事件都会被执行，所以首先是Child_2_1直接进行了一次更新，然后接着由于Child_2的更新有发生了一次更新，所以Child_2_1总共在后面的dispatch中输出了两次，即渲染了两次。对于redux的观察者模式不了解的可以[查看redux原理分析](https://github.com/liangklfangl/redux-createstore)。同时，该文章给出了react兄弟组件通信的方法:即采用观察者模式或者redux(实际上也是观察者模式)来解决

#### 2.React开发中那些设计模式
(1)使用this.props.children来处理组件的低耦合。此时，父组件可以访问和读取子组件。而我们以前直接将Navigator组件写入到Header组件的方式一方面使得测试不容易(当然，在测试中可以使用[shallow-rendering](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering)的方式来解决)，另一方面我们的Header和Navigator将会强耦合，对于一些不需要Navigator的Header组件来说就无法实现复用

(2)高阶组件可以很容易的实现逻辑的复用，对于一些重复的逻辑可以考虑使用[高阶组件](https://github.com/liangklfangl/high-order-reducer)来完成

(3)我们写的大部分的模块和组件都会存在依赖关系，特别是当树形的组件树存在的时候，父子关系的依赖就会出现了。因此，项目成功的一个关键就是如何去管理这些依赖关系。此时你应该要考虑到一个广为人知的设计模式，也就是
我们所说的:依赖注入。我们给出下面的例子：

```js
// Title.jsx
export default function Title(props) {
  return <h1>{ props.title }<\/h1>;
}
// Header.jsx
import Title from './Title.jsx';
export default function Header() {
  return (
    <header>
      <Title />
    <\/header>
  );
}
// App.jsx
import Header from './Header.jsx';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { title: 'React in patterns' };
  }
  render() {
    return <Header />;
  }
};
```
此时，假如你有一个需求，即你需要将“React in patterns”这个字符串传递给我们的Title组件。最直接的方法就是将属性从最顶层的App组件逐步传递到我们的Title组件。然而，当我们的属性很多或者组件嵌套的非常深的时候，那么很多中间的组件就需要处理那些他们根本不感兴趣的属性。此时，你可以考虑我们这里说的高阶组件的方法:

```js
// enhance.jsx
var title = 'React in patterns';
var enhanceComponent = (Component) =>
  class Enhance extends React.Component {
    render() {
      return (
        <Component
          {...this.state}
          {...this.props}
          title={ title }
        \/>
      )
    }
  };
// Header.jsx
import enhance from './enhance.jsx';
import Title from './Title.jsx';
var EnhancedTitle = enhance(Title);
//此时经过我们的enchance方法的处理，我们的Title组件会接受到一个title属性
export default function Header() {
  return (
    <header>
      <EnhancedTitle />
    <\/header>
  );
}
```

注意:此时我们的title属性并没有从Header组件传递过去，而是直接在我们的Title组件中通过高阶组件的形式进行了注入了。我们的title属性对于高阶组件本身来说是透明的，他根本不知道我们要给最终的Title组件传递title属性。这很好，但是这只是解决了一半的问题，我们虽然不需要将title属性通过组件树的形式传递下去了，但是我们的数据该如何到达enchance.jsx呢?
React引入了context的概念，每一个组件都可以访问我们的context属性。他就像是一个事件系统，但是他是为了数据而设计的。

```js
// a place where we'll define the context
var context = { title: 'React in patterns' };
class App extends React.Component {
  getChildContext() {
    return context;
  }
  ...
};
App.childContextTypes = {
  title: React.PropTypes.string
};

// a place where we need data
class Inject extends React.Component {
  render() {
    var title = this.context.title;
    ...
  }
}
Inject.contextTypes = {
  title: React.PropTypes.string
};
```

注意：我们需要完整的指定context对象的签名，即使用childContextType和getChildContext。如果任意一项没有指定，那么我们的context对象就是空对象。但是这似乎不太合理，我们可能需要在context中指定任意类型的数据。最佳实践告诉我们，context不应该仅仅是一个纯对象，而同时应该提供一个接口用于保存和获取数据，例如：

```js
// dependencies.js
export default {
  data: {},
  get(key) {
    return this.data[key];
  },
  register(key, value) {
    this.data[key] = value;
  }
}
```
因此，回到上面的例子，我们的App组件最终会是下面的形式:

```js
import dependencies from './dependencies';
dependencies.register('title', 'React in patterns');
class App extends React.Component {
  getChildContext() {
    return dependencies;
  }
  render() {
    return <Header />;
  }
};
App.childContextTypes = {
  data: React.PropTypes.object,
  get: React.PropTypes.func,
  register: React.PropTypes.func
};
```
而我们的Title组件通过context来获取到数据:

```js
// Title.jsx
export default class Title extends React.Component {
  render() {
    return <h1>{ this.context.get('title') }<\/h1>
  }
}
Title.contextTypes = {
  data: React.PropTypes.object,
  get: React.PropTypes.func,
  register: React.PropTypes.func
};
```
当然，我们并不想在任何需要使用context地方都声明一下contextTypes，而这个细节我们可以包裹到我们的高阶组件中。同样的，我们可以声明一个工具函数而来帮助我们操作context，而不是使用this.context.get('title')这种方式来获取我们需要的值，此时我们直接告诉高阶组件我们需要哪些数据，然后让他通过prop的形式传递给我们最终的组件，如下：

```js
// Title.jsx
import wire from './wire';

function Title(props) {
  return <h1>{ props.title }<\/h1>;
}

export default wire(Title, ['title'], function resolve(title) {
  return { title };
});
```

这个wire方法第一个参数是我们的React组件，第二个参数是所有已经注册的依赖的数组，第三个参数可以叫做mapper，是一个函数。这个函数会接受到我们保存在context中的值，然后返回给我们的是一个对象，这个对象中保存的是我们组件，如Title组件真实的prop属性。在这个例子中，我们只是传递了一个title的字符串，但是在一个大型的应用中很可能就是一个数据仓库，配置信息或者其他类型的信息。因此，我们要做到，传递给组件的prop属性是这个组件真实需要的，而不要使用无用的数据来污染组件。

下面是wire函数的签名：

```js
export default function wire(Component, dependencies, mapper) {
  class Inject extends React.Component {
    render() {
      var resolved = dependencies.map(this.context.get.bind(this.context));
      var props = mapper(...resolved);

      return React.createElement(Component, props);
    }
  }
  Inject.contextTypes = {
    data: React.PropTypes.object,
    get: React.PropTypes.func,
    register: React.PropTypes.func
  };
  return Inject;
};
```
Inject是一个高阶组件，他会访问context属性，然后获取哪些dependencies指定的属性。而我们的mapper方法会获取context数据，然后将它转化为组件的props.

(4)单向数据交流

单向数据流是React中一个很重要的概念。他的主流思想是：组件本身不修改他们接受到的props属性，他们仅仅是监听数据的变化，或者提供一个新的数据(用于更新数据)，但是他们不会直接更新store中的数据。而store中数据的更新是来自于另外一个机制，另外一个地方，而组件本身只会通过这个更新的数据来重新渲染而已。

下面给出Switcher的例子：

```js
class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flag: false };
    this._onButtonClick = e => this.setState({ flag: !this.state.flag });
  }
  render() {
    return (
      <button onClick={ this._onButtonClick }>
        { this.state.flag ? 'lights on' : 'lights off' }
      <\/button>
    );
  }
};

// ... and we render it
class App extends React.Component {
  render() {
    return <Switcher />;
  }
};
```
在这个例子中，我们的组件本身是有数据的。Switcher是唯一一个地方知道我们flag属性的值的。下面我们展示一个store的例子，此时不仅Switcher我们的store本身也是知道flag的：

```js
var Store = {
  _flag: false,
  set: function(value) {
    this._flag = value;
  },
  get: function() {
    return this._flag;
  }
};

class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { flag: false };
    this._onButtonClick = e => {
      this.setState({ flag: !this.state.flag }, () => {
        this.props.onChange(this.state.flag);
      });
    }
  }
  render() {
    return (
      <button onClick={ this._onButtonClick }>
        { this.state.flag ? 'lights on' : 'lights off' }
      <\/button>
    );
  }
};

class App extends React.Component {
  render() {
    return <Switcher onChange={ Store.set.bind(Store) } \/>;
  }
};
```
这个例子的的数据交流就是双向的，我们点击按钮的时候，React组件的状态发生变化导致重新渲染，这是可以理解的。但是点击按钮的时候，我们也会更新store的内容，因此我们就需要一种机制保证store和组件本身维护状态的一致(组件本身的状态通过state来维护，比如其他地方ajax请求导致store也变化了，那么我们就需要同步这种变化，如广播)。此时我们的数据流状态如下:

<pre>
    User's input
     |
  Switcher <-------> Store
                      ^ |
                      | |
                      | |
                      | v
    Service communicating
    with our backend
</pre>

而我们的单向数据流就解决了这个问题。他去除了多状态，而只是维护store这一种状态。为了实现这种效果，我们需要修改我们的store对象，使得我们可以订阅store的改变：

```js
var Store = {
  _handlers: [],
  _flag: '',
  onChange: function(handler) {
    this._handlers.push(handler);
  },
  set: function(value) {
    this._flag = value;
    this._handlers.forEach(handler => handler())
  },
  get: function() {
    return this._flag;
  }
};
```
此时，我们需要对我们的App组件进行处理，每次store发生变化的时候都重新渲染我们的组件：

```js
class App extends React.Component {
  constructor(props) {
    super(props);
    Store.onChange(this.forceUpdate.bind(this));
  }
  render() {
    return (
      <div>
        <Switcher
          value={ Store.get() }
          onChange={ Store.set.bind(Store) } />
      </div>
    );
  }
};
```
注意：此处我们使用了forceUpdate，但是我们不推荐这样做，具体的使用你可以参考[高阶组件重新渲染](https://github.com/krasimir/react-in-patterns/tree/master/patterns/higher-order-components)

此时我们的Switcher组件变得非常简单，我们不需要维持内部的状态了:

```js
class Switcher extends React.Component {
  constructor(props) {
    super(props);
    this._onButtonClick = e => {
      this.props.onChange(!this.props.value);
    }
  }
  render() {
    return (
      <button onClick={ this._onButtonClick }>
        { this.props.value ? 'lights on' : 'lights off' }
      <\/button>
    );
  }
}
```
我们这种方式的好处在于：我们的组件本身只是store状态的一种反映。我们只是将React组件作为views层，而且我们只需要在一个地方来管理我们的状态。此时我们的数据流是如下的形式：

<pre>
Service communicating
with our backend
    ^
    |
    v
  Store <-----
    |        |
    v        |
Switcher ---->
    ^
    |
    |
User input
</pre>
正如你能看到的，我们的数据流是单向的，我们不需要同步系统的两个部分，即UI和store。单向数据流不仅仅用于React,他是一种有用的模式，该模式会使得你的应用本身变得非常易于维护。





参考资料:

[React 组件间通讯](http://taobaofed.org/blog/2016/11/17/react-components-communication/)

[React.js in patterns](http://krasimirtsonev.com/blog/article/react-js-in-design-patterns)

[react in patterns](https://github.com/krasimir/react-in-patterns/tree/master/patterns/higher-order-components)
