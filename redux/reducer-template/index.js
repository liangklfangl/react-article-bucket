import React from 'react'
import { render } from 'react-dom'
import { createStore ,compose} from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import reducer from './reducers'

/**
 * 创建store
 */
const store = createStore(
  reducer,
  compose(window.devToolsExtension ? window.devToolsExtension() : f => f)
)
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
