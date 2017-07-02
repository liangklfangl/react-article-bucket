## 1. Simple usage

```js
class MessageList extends React.Component {
//(2)Add getChildContext
 getChildContext() {
    return {color: "purple"};
  }
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} \/>
    );
    return <div>{children}<\/div>;
  }
}
//(1)Add MessageList.childContextTypes
MessageList.childContextTypes = {
  color: PropTypes.string
};
```
We need to focus on *childContextTypes* and *getChildContext*.

[Demo click here](./simpleFunc/readme.md)

## 2.Referencing Context in Lifecycle Methods
If contextTypes is defined within a component, the following lifecycle methods will receive an additional parameter, the context object:
<pre>
constructor(props, context)
componentWillReceiveProps(nextProps, nextContext)
shouldComponentUpdate(nextProps, nextState, nextContext)
componentWillUpdate(nextProps, nextState, nextContext)
componentDidUpdate(prevProps, prevState, prevContext)
</pre>

## 3.Referencing Context in Stateless Functional Components
Stateless functional components are also able to reference context if contextTypes is defined as a property of the function. The following code shows a Button component written as a stateless functional component.
```js
const PropTypes = require('prop-types');
//context is second parameter of stateless function constructor
const Button = ({children}, context) =>
  <button style={{background: context.color}}>
    {children}
  <\/button>;
Button.contextTypes = {color: PropTypes.string};
```

## 4.Updating Context
Don't do it.

React has an API to `update context`, but it is fundamentally broken and you *should not* use it.

The `getChildContext` function will be called when the state or props changes. In order to update data in the context, trigger a local state update with `this.setState`. This will trigger a new context and changes will be received by the children.

```js
const PropTypes = require('prop-types');
class MediaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type:'desktop'};
  }
  //When state or props change, it will invoke
  getChildContext() {
    return {type: this.state.type};
  }
  componentDidMount() {
    const checkMediaQuery = () => {
      const type = window.matchMedia("(min-width: 1025px)").matches ? 'desktop' : 'mobile';
      //if type detected is not equal to this.state.type, we will invoke
      //this.setState
      if (type !== this.state.type) {
        this.setState({type});
        //Means setState({type:type}) invoked, then getChildContext will be invoked again~ 
      }
    };
    window.addEventListener('resize', checkMediaQuery);
    checkMediaQuery();
  }
  render() {
    return this.props.children;
  }
}
MediaQuery.childContextTypes = {
  type: PropTypes.string
};
```
The problem is, if a context value provided by component changes, descendants that use that value won't update if an *intermediate parent returns false from shouldComponentUpdate*. This is totally out of control of the components using context, so there's basically no way to reliably update the context. This blog post has a good explanation of why this is a problem and how you might get around it.

### 5. Why is Context + ShouldComponentUpdate problematic?
Classic use cases for context are *theming, localization and routing*. See example of [this](./Context-Problematic/readme.md)





Reference:

[react context Api](https://facebook.github.io/react/docs/context.html)

[How to safely use React context](https://medium.com/@mweststrate/how-to-safely-use-react-context-b7e343eff076)
