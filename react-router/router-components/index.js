import React from 'react'
import { render } from 'react-dom'
import { browserHistory, Router, Route, Link } from 'react-router';
import data from './data'
import './app.css'
import useBasename from 'history/lib/useBasename';
function withExampleBasename(history, dirname) {
  return useBasename(() => history)({ basename: `http://localhost:8080${dirname}` })
}

const Category = ({ children, params }) => {
  const category = data.lookupCategory(params.category)
  return (
    <div>
      <h1>{category.name}</h1>
      {children || (
        <p>{category.description}</p>
      )}
    </div>
  )
}

/**
 * 类别的sidebar
 */
const CategorySidebar = ({ params }) => {
  const category = data.lookupCategory(params.category)
  return (
    <div>
      <Link to="/">◀︎ Back</Link>
      <h2>{category.name} Items</h2>
      <ul>
        {category.items.map((item, index) => (
          <li key={index}>
            <Link to={`/category/${category.name}/${item.name}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * 具体的item,具体接受到的props参考当前文件夹的props.js
 *
 */
const Item = ({ params: { category, item } }) => {
  const menuItem = data.lookupItem(category, item)
  return (
    <div>
      <h1>{menuItem.name}</h1>
      <p>${menuItem.price}</p>
    </div>
  )
}

/**
 * 默认的子Index组件
 */
const Index = () => (
  <div>
    <h1>Sidebar</h1>
    <p>
      Routes can have multiple components, so that all portions of your UI
      can participate in the routing.
    </p>
  </div>
)

/**
 * 默认的子Sidebar组件
 */
const IndexSidebar = () => (
  <div>
    <h2>Categories</h2>
    <ul>
      {data.getAll().map((category, index) => (
        <li key={index}>
          <Link to={`/category/${category.name}`}>{category.name}</Link>
        </li>
      ))}
    </ul>
  </div>
)

/**
 * 当你访问的路由是/的时候就会实例化这个组件，这个组件会接受到content和sidebar分别
 * 表示要实例化的子组件。
 * 假如我们的App组件的实例化子组件是可插拔的,这时候我们可能采用下面这种方式:
 * <App main={<Users />} sidebar={<UsersSidebar />} />
 */
const App = ({ content, sidebar }) => (
  <div>
    <div className="Sidebar">
      {sidebar || <IndexSidebar />}
    </div>
    <div className="Content">
      {content || <Index />}
    </div>
  </div>
)

render((
  <Router history={withExampleBasename(browserHistory, __dirname)}>
    <Route path="/" component={App}>
      {/*App组件必须有默认的Category和CategorySidebar组件用于实例化*/}
      <Route path="category/:category" components={{ content: Category, sidebar: CategorySidebar }}>
        <Route path=":item" component={Item} />
      </Route>
    </Route>
  </Router>
), document.getElementById('app'))
