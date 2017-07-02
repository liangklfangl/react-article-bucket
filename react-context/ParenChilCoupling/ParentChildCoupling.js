import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
// https://www.npmjs.com/package/react-router-dom
// Context can also let you build an API where parents and children communicate
// By passing down some information from the Router component, each Link and 
// Route can communicate back to the containing Router.Before you build components
// with an API similar to this, consider if there are cleaner alternatives.
// For example, you can pass entire React component as props if you'd like to.
const BasicExample = () => (
  <Router>
    <div>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/topics">Topics</Link></li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/topics" component={Topics} />
    </div>
  </Router>
);