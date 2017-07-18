### 1.运行

cd到我们这个目录下，执行下面的命令:

```js
npm install webpackcc -g
npm run dev
```

### 2.解决的问题
该例子展示了动态添加子组件的时候如何为`子组件添加ref值`，进而能够调用子组件的方法。其主要代码如下:

```js
import React, { Component } from 'react';
import PropTypes from "prop-types";
export default class StepZilla extends Component {
   constructor(props){
    super(props);
     this._next= this._next.bind(this);
     this.state={
         compState : 0
     }
   }
      _next() {
            // move to next step (if current step needs to be validated then do that first!)
            if (typeof this.refs.activeComponent.isValidated == 'undefined' ||
                this.refs.activeComponent.isValidated()) {
                    const next = this.state.compState+1;
                    this.setState({compState:next});
            }
      }
    render() {
        //问题：动态添加的组件如何通过ref调用组件本身的方法
         const compToRender = React.cloneElement(this.props.steps[this.state.compState].component, {
                ref: 'activeComponent'
            }
        );
        return (
          <div>
             <button onClick={this._next}>点击我切换到下一个组件</button>
             {compToRender}
          </div>
        )
    }
}
```
纵观上面的代码，主要就是通过下面的cloneElement并且为这个组件动态添加ref来完成的。从而可以调用克隆组件的实例方法:

```js
const compToRender = React.cloneElement(this.props.steps[this.state.compState].component, {
                ref: 'activeComponent'
      }
 );
```

同时对于某一个组件如果返回false,那么我们并不会实例化以后的组件，这就是[react-stepzilla](https://github.com/newbreedofgeek/react-stepzilla)做的事情。

参考资料:


[Adding a 'ref' to dynamically inserted child component in react](http://www.frontendjunkie.com/2016/05/adding-ref-to-dynamically-inserted.html)

[react ref](https://github.com/liangklfangl/react-article-bucket/blob/master/react-ref/index.md)

[react-stepzilla](https://github.com/newbreedofgeek/react-stepzilla)
