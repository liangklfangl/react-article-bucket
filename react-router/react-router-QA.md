#### 1.react-router报错basename报错
报错信息:
<pre>
BrowserProtocol.js:87 Uncaught DOMException: Failed to execute 'pushState' on 'History': A history state object with URL 'http://category/Burgers' cannot be created in a document with origin 'http://localhost:8080' and URL 'http://localhost:8080/'.
    at http://localhost:8080/index.js:8016:27
    at updateLocation (http://localhost:8080/index.js:8011:3)
    at pushLocation (http://localhost:8080/index.js:8015:10)
    at http://localhost:8080/index.js:8161:15
    at http://localhost:8080/index.js:8134:9
    at next (http://localhost:8080/index.js:18102:7)
    at loopAsync (http://localhost:8080/index.js:18106:3)
    at confirmTransitionTo (http://localhost:8080/index.js:8124:31)
    at transitionTo (http://localhost:8080/index.js:8144:5)
    at Object.push (http://localhost:8080/index.js:8175:12)
</pre>
解决方法:
```js
import useBasename from 'history/lib/useBasename'
import { browserHistory, Router, Route, Link } from 'react-router';
//这里展示的是如何设置react-router的basename
function withExampleBasename(history, dirname) {
  return useBasename(() => history)({ basename: `/${dirname}` })
}
<Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <Route path="category/:category" components={{ content: Category, sidebar: CategorySidebar }}>
        <Route path=":item" component={Item} />
      </Route>
    </Route>
  </Router>
```
修改为如下的内容:
```js
import useBasename from 'history/lib/useBasename'
import { browserHistory, Router, Route, Link } from 'react-router';
function withExampleBasename(history, dirname) {
//也就是在basename前面加上域名+端口号，好像在本地的chrome安全机制导致的
  return useBasename(() => history)({ basename: `http://localhost:8080${dirname}` })
}
<Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      <Route path="category/:category" components={{ content: Category, sidebar: CategorySidebar }}>
        <Route path=":item" component={Item} />
      </Route>
    </Route>
  </Router>
```
同时对于浏览器访问路径也有限制，比如上面basename是`http://localhost:8080`，那么你访问的时候必须是localhost:8080，而不能通过自己的ip访问，这一点一定要注意，否则还是报同样的错误。
