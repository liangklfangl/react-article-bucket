#### 1.How to run
```js
npm install webpackcc -g
npm run dev
```

#### 2.知识点总结
##### 2.1 components的获取是在父组件中完成的
假如我们有如下的路由配置:
```js
<Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      {/*App组件必须有默认的Category和CategorySidebar组件用于实例化*/}
      <Route path="category/:category" components={{ content: Category, sidebar: CategorySidebar }}>
        <Route path=":item" component={Item} />
      </Route>
    </Route>
  </Router>
```
此时我们的App组件可以通过this.props.content,this.props.sidebar获取到自己要实例化的子组件。但是App必须有默认的content和sidebar组件：
```js
const App = ({ content, sidebar }) => (
  <div>
    <div className="Sidebar">
      {sidebar || <IndexSidebar />}
      //默认的sidebar
    </div>
    <div className="Content">
      {content || <Index />}
      //默认的index
    </div>
  </div>
)
```
我们在子组件中配置的compnents属性其实是在父组件中获取到的，这就相当于下面这种方式:
```js
<App main={<Users />} sidebar={<UsersSidebar />} \/>
```
即，父组件为了在自己的组件内部获取到Users和UsersSidebar组件，所以有两种方法:一种方式就是直接在自己的组件中通过main,sidebar属性配置;还有一种方式就是这里采用的方式，即配置在子组件的components属性中。不管采用哪一种方式，`都是将我们的组件传递到父组件中`，所以父组件中可以通过props获取。

##### 2.2 每一级组件中获取到的属性
```js
 "location": {
    "pathname": "category/Tacos/Carne Asada",
    "search": "",
    "hash": "",
    "action": "PUSH",
    "key": "mi5l9e",
    "query": {},
    "basename": "http://localhost:8080/"
  },
  //表示两个参数的值
  "params": {
    "category": "Tacos",
    "item": "Carne Asada"
  },
  //表示path
  "route": {
    "path": ":item"
  },
```
特别注意params部分，包括了某一个实例化路径中所有的参数的值。比如路径"http://localhost:8080/category/Tacos/Pollo"就包括了category和item两部分，但是route只包含`最里层`的组件的参数。

#### 3.异步components实例化
```js
<Route path="courses/:courseId" getComponents={(nextState, cb) => {
  // do asynchronous stuff to find the components
  // 通过查找可以获取到我们应该实例化的所有组件
  cb(null, {sidebar: CourseSidebar, content: Course})
}} />
```
你可以参考这里的[getComponent](../../webpack/optimize.md)




参考资料:

[react-router docs](https://github.com/liangklfang/react-router/blob/master/docs/API.md#getcomponentsnextstate-callback)
