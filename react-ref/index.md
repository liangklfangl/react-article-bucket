### 1.为DOM元素添加Ref
react支持一个ref属性，该属性可以添加到任何的组件上。该ref属性接收一个回调函数，这个回调函数在组件挂载或者卸载的时候被调用。当ref用于一个HTML元素的时候，ref指定的回调函数在调用的时候会接收一个参数，该参数就是指定的DOM元素。如下面的例子使用ref回调函数来保存对DOM节点的引用：
```js
class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }
  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.textInput.focus();
  }
  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />
          //此时input参数就是表示该DOM本身
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    );
  }
}
```
当组件挂载的时候React会给ref回调函数传入当前的DOM，在组件卸载的时候会传入null。使用ref回调函数给我们的class添加属性是访问组件DOM的常用方法，就像上面的实例一样。当然你也可以使用下面更加简短的写法:
```js
ref={input=>this.textInput=input}
```

### 2.为组件Component添加Ref
当ref属性用于一个class指定的自定义组件的时候,ref回调函数会接收到一个挂载的组件实例作为参数。比如，下面的例子展示了当CustomTextInput被挂载后马上模拟被点击：
```js
class AutoFocusTextInput extends React.Component {
  componentDidMount() {
    //调用CustomTextInput实例的focus方法
    this.textInput.focus();
  }
  render() {
    return (
      <CustomTextInput
        ref={(input) => { this.textInput = input; }} />
     //该ref回调函数会接收到一个挂载的组件实例作为参数
    );
  }
}
```
当然，下面的CustomTextInput必须使用class来声明:
```js
  class CustomTextInput extends React.Component {
  constructor(props) {
    super(props);
    this.focus = this.focus.bind(this);
  }
  focus() {
    // Explicitly focus the text input using the raw DOM API
    this.textInput.focus();
  }
  render() {
    // Use the `ref` callback to store a reference to the text input DOM
    // element in an instance field (for example, this.textInput).
    return (
      <div>
        <input
          type="text"
          ref={(input) => { this.textInput = input; }} />
        <input
          type="button"
          value="Focus the text input"
          onClick={this.focus}
        />
      </div>
    );
  }
}
```
注意，上面的ref回调函数接收到的是一个CustomTextInput的实例，在componentDidMount中调用的是CustomTextInput实例的focus方法，但是该focus方法必须在CustomTextInput这个class中存在才行。下面的声明将会报错,因为CustomTextInput本身就没有focus方法:
```js
class CustomTextInput extends React.Component {
  render(){
    return (
      <input placeholder="自定义组件实例"/>
    )
  }
}
```
报错信息如下:

<pre>
    Uncaught TypeError: this.textInput.focus is not a function
    at AutoFocusTextInput.componentDidMount (<anonymous>:24:22)
</pre>

### 3.Ref与函数式声明组件
你不能在函数式声明组件中使用ref，因为他们*不存在实例*，如下面的例子就是错误的:
```js
function MyFunctionalComponent() {
  return <input />;
}
class Parent extends React.Component {
  render() {
    // This will *not* work!
    return (
      <MyFunctionalComponent
        ref={(input) => { this.textInput = input; }} />
    );
  }
}
```
如果你想要使用ref那么你必须转化为class声明。当然，在函数组件内部你依然可以使用ref属性指向DOM元素或者class组件:
```js
function CustomTextInput(props) {
  // textInput must be declared here so the ref callback can refer to it
  let textInput = null;
  function handleClick() {
    textInput.focus();
  }
  return (
    <div>
      <input
        type="text"
        ref={(input) => { textInput = input; }} />
      <input
        type="button"
        value="Focus the text input"
        onClick={handleClick}
      />
    </div>
  );  
}
```

### 4.为父组件暴露一个DOM的ref属性
在一些情况下，你可能想要从父级组件中访问子级组件的DOM节点。当然这是不推荐的，因为它破坏了组件的结构。但是，它在触发子级组件DOM的焦点，获取子级组件大小和子级组件位置的时候非常有用。

你可以为子级组件添加一个ref属性，当然这不是理想选择，因为此时你获取到的是一个子级组件实例而不是一个DOM节点。而且，这对于函数式组件是没有作用的(见上面的例子)。

在这种情况下，我们推荐在子级组件中暴露一个特殊的属性。这个子级组件会接收一个函数作为prop属性，而且该函数的名称是任意的(例如inputRef)，同时将这个函数赋予到DOM节点作为ref属性。这样，父级组件会将它的ref回调传递给子级组件的DOM。这种方式对于class声明的组件和函数式声明的组件都是适用的:
```js
function CustomTextInput(props) {
  return (
    <div>
     //子级组件接收到父级组件传递过来的inputRef函数
     //当子级组件实例化的时候会将该input传入到该函数中，此时父级组件会
     //接收到子级组件的DOM结构(input元素)
      <input ref={props.inputRef} />
    </div>
  );
}
class Parent extends React.Component {
  render() {
    return (
      <CustomTextInput
      //为子级组件传入一个inputRef函数
        inputRef={el => this.inputElement = el}
      \/>
    );
  }
}
```
在上面的例子中，Parent将他的ref回调函数通过inputRef这个属性传递给CustomTextInput，而CustomTextInput将这个函数作为input元素的ref属性。最后，Parent组件中的this.inputElement将得到子级组件的input对应的DOM元素。注意：inputRef并没有特殊的含义，但是在子级组件中必须作为ref属性的值。

这种形式的又一个优点在于：可以跨越多个组件层级。设想一种情况：Parent组件不需要DOM节点的引用，但是父级组件的父级组件(Grandparent)需要，这样的话我们可以给Grandparent指定一个inputRef属性，从而传递给Parent，最后通过Parent组件传递给CustomTextInput：
```js
 return (
    <div>
      <input ref={props.inputRef} />
    </div>
  );
}
function Parent(props) {
  return (
    <div>
      My input: <CustomTextInput inputRef={props.inputRef} />
    </div>
  );
}
class Grandparent extends React.Component {
  render() {
    return (
      <Parent
        inputRef={el => this.inputElement = el}
      \/>
    );
  }
}
```
这样的话，我们的GrandParent中的this.inputElement也会被设置为CustomTextInput中的input对应的DOM节点。当然，这种方式必须要你对子级组件具有完全控制，如果没有，那么你可以使用findDOMNode(),但是我们并不鼓励这么做。

### 5.ref遗留的问题
以前的ref属性获取到的是字符串，而DOM节点通过this.refs.textInput来获取。这是因为string类型的ref有一定的问题，在以后的react版本中将会被移除。如果你现在依然在使用this.refs.textInput来访问refs，那么建议您使用回调函数来替代!

### 6.ref存在的问题以及ref常用情况
#### 6.1 Ref存在的问题
如果ref回调函数以inline函数的方式来指定，那么在组件更新的时候ref回调会被调用2次。第一次回调的时候传入的参数是null,而第二次的时候才真正的传入DOM节点。这是因为，每次渲染的时候都会产生一个新的函数实例(每次都会产生一个新的函数，而不是单例模式或者设置到原型链中的函数),而React需要清除前一个ref，然后才设置一个新的ref。通过在class中指定ref回调函数可以有效的避免这种情况。但是，在大多数情况下这并不会有什么影响。

#### 6.2 Ref常用情况

第一：管理焦点，文本选择，媒体播放(媒体回放)

第二：触发动画

第三：集成第三方的DOM库







参考资料：

[Refs and the DOM](https://facebook.github.io/react/docs/refs-and-the-dom.html)

[Integrating with Other Libraries](https://facebook.github.io/react/docs/integrating-with-other-libraries.html)
