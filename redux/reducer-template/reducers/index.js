import { combineReducers } from 'redux'
import keduer from '../kReducer/keduer'
/**
 * 创建reducer
 */
const rootReducer = combineReducers({
  auth: keduer('auth'),
  //第一个页面监听auth
  edit: keduer('edit')
  //第二个新的页面监听edit
})
export default rootReducer
