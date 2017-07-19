function iiHOC(WrappedComponent) {
  return class Enhancer extends WrappedComponent {
    render() {
      //(1)该组件只有在传入了loggedIn这个属性的时候才会完全渲染WrappedComponent，否则不会渲染
      //强制要求用户登录时候可用
      if (this.props.loggedIn) {
        return super.render()
      } else {
        return null
      }
    }
  }
}
