#### React-Router实现无刷新路由跳转的两种方式
- 方式1:通过React-Router为我们提供的Link组件来完成路由跳转。如下面的例子:
```js
 <Menu
        mode={mode}
        className="menu"
        key="nav"
        style={{ backgroundColor: this.state.backgroundColor }}
      >
    <Menu.Item key="home">
      <Link to="/" style={{ color: this.state.color }}>
        主页
      </Link>
    </Menu.Item>

    <Menu.Item key="docs/react">
      <Link to="/docs/react/introduce" style={{ color: this.state.color }}>
        后台组件
      </Link>
    </Menu.Item>
    <Menu.Item key="docs/pattern">
      <Link to="/tv/silvermine" style={{ color: this.state.color }}>
        TV组件
      </Link>
    <\/Menu.Item>
</Menu>
```

- 方式2：通过使用React-Router提供的router属性来实现路由跳转
在我们需要实现跳转的组件中通过下面的代码来完成
```js
  static contextTypes = {
    router: PropTypes.object.isRequired
  }
  /**
   * 在DOM中我们可以使用Link标签来完成路由跳转，如果是要通过js手动完成路由跳转可以通过router.push来完成
   */
  handleSearch = (value) => {
    const {  router } = this.context;
    this.setState({
      inputValue: '',
    }, () => {
      if (value.indexOf("tv") == 0) {
        router.push({ pathname: `/detail/${value.slice(2)}/`});
      }else{
        router.push({ pathname: `/components/${value.toLowerCase()}/`});
     } 
    });
  }
```
之所以可以通过contextType来从context中获取router参数[你可以查看这里](https://github.com/ReactTraining/react-router/blob/v2.8.1/docs/API.md#contextrouter)。通过上面两种方式，我们不需要使用window.location.href这种方式来实现全局刷新，进而实现路由跳转了。这是单页面应用常用的两种跳转方式。当然，获取router你还可以[参考这里](./renderProps.md)

#### React-Router实现IndexRouter嵌套
假如配置如下:
```js
<Route path="autoReply" component={autoReplyMine}>
    <Route component={StatusAutoReply}>
      <IndexRoute component={PictureTextReply}/>
    </Route>
    <Route path="keyWordReply" component={KeywordReply} />
  </Route>
```
因为StatusAutoReply默认没有path属性，所以可以直接实例化它。然后PictureTextReply也可以同时实例化。其中StatusAutoReply写法如下:
```js
export default class SubscribeAutoReply extends React.Component {
  render() {
    return (
      <div style={{ paddingLeft: "30px" }}>
        SubscribeAutoReply{this.props.children}
      <\/div>
    );
  }
}
```




参考资料:

[Nested IndexRoute not working](https://github.com/ReactTraining/react-router/issues/1950)
