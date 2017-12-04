### 1.不要重复注册saga
重复注册sage会出现重复调用某一个函数或者发送某一个网络请求的问题。
```js
const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: "tfpage", reducer });
//我们这个tfPage对应的reducer被注册到key为"tfpage"中
//const withSaga = injectSaga({ key: "tfpage", saga });
//inject一个saga
export default compose(withReducer, withConnect)(HomePage);
```
所以建议将sage拆分，这样可以有效的避免重复注册sage的问题(某一个页面注册自己的saga而不干预其他页面的sage，即不注册别的页面的saga):
```js
export function* editTaskSage() {
  yield takeLatest(EDIT_TASK_DETAIL, storeTargetDetailById);
}
/**
 * 任务相关的saga
 */
export function* taskListSaga() {
  yield takeLatest(ADD_TASK_DATA, saveTask);
}
```

### 2.injectReducer的key不对
<pre>
selectors.js:11 Uncaught TypeError: Cannot read property 'get' of undefined
    at selectors.js:11
    at index.js:76
    at index.js:36
    at index.js:90
    at index.js:36
    at index.js:86
    at Function.mapToProps (index.js:36)
    at mapToPropsProxy (wrapMapToProps.js:43)
    at Function.detectFactoryAndVerify (wrapMapToProps.js:52)
    at mapToPropsProxy (wrapMapToProps.js:43)
</pre>
如果某一个页面注入了下面的代码:
```js
import injectReducer from "./injectReducer";
const withReducer = injectReducer({ key: "tfpage", reducer });
```
如果这个key不存在就会直接报错。
