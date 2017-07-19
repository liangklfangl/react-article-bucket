import React from "react";
import ReactDOM from "react-dom";
function ppHOC(WrappedComponent) {
  //该PP组件接受到lastname="liangklfangl"的this.props
  return class PP extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        name: ''
      }
      this.onNameChange = this.onNameChange.bind(this)
    }
    onNameChange(event) {
      //(3)input触发onChange事件导致高阶组件重新渲染，此时state与input的值也会同步
      console.log('input触发onChange事件导致高阶组件重新渲染，此时state与input的值也会同步',event.target.value);
      this.setState({
        name: event.target.value
      })
    }
    render() {
      // console.log('this.props===',this.props);
      // {
      //   "lastname": "liangklfangl"
      // }
      const newProps = {
        name: {
          value: this.state.name,
          onChange: this.onNameChange
        }
      }
      //(2)此时高阶组件自己维护的value,onChange的state会被传入到我们的WrappedComponent
      //而WrappedComponent在实例化的时候将它传递给我们的input,此时我们的input变成了受控的input
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}

@ppHOC
class Example extends React.Component {
  render() {
    return <input name="name" {...this.props.name}/>
  }
}
//(1)此时实例化的Example组件是已经经过ppHOC包裹了
ReactDOM.render(<Example lastname="liangklfangl"/>,document.getElementById('react-content'));
