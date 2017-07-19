function currentLoggedInUser(){
  return "liangklfangl";
}
function ppHOC(WrappedComponent) {
  return class PP extends React.Component {
    render() {
      //当前登录的用户可以在 WrappedComponent 中通过 this.props.user 访问到
      //访问当前user的逻辑在高阶组件内部就完成了
      const newProps = {
        user:currentLoggedInUser()
      }
      return <WrappedComponent {...this.props} {...newProps}/>
    }
  }
}
