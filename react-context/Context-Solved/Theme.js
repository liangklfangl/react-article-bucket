export default class Theme {
  // this.theme = new Theme(this.props.color)
  constructor(color) {
    this.color = color
    this.subscriptions = []
  }
 /*
  *每次setColor的时候将我们的subscription中的所有的函数都调用一遍
  */
  setColor(color) {
    this.color = color
    this.subscriptions.forEach(f => f())
  }
  /**
   * 调用subscribe方法来push一个函数用于执行
   */
  subscribe(f) {
    this.subscriptions.push(f)
  }
}
