#### 1.React-Router组件挂载与卸载
假如我们有下面的路由配置：
```js
{
    path: "tv/:silvermine",
    component: SilverMine
},
//首页路由
{
    path: "detail/:component",
    component: SilverMine
}
//详情页路由
```
其中前者是首页路由，而后者是详情页路由。在首页会列举出所有的组件的概要信息(左侧sidebar)，然后通过点击概要信息的URL转到每一个组件的详情页。
   
首先进入到我们的主页的时候`tv/silvermine`，所以实例化SilverMine组件，但是当我们切换到detail的时候前面的SilverMine组件已经被卸载。我们挂载一个新的SilverMine组件，然后当你在不同的组件详情页面之间跳转的时候其实一直触发`componentWillReceiveProps`，所以我们就可以根据这个props.params中的component知道目前是处于哪个组件，并向服务端发送请求获取当前组件的详情。当我们从detail跳转到首页的时候，我们没有了nextProps.params.component而只有silvermine，此时我们获取到首页的信息即可。

