### 前言
本部分主要写一个模板reducer而已。

#### 1.安装依赖包
```js
npm install webpackcc -g
npm i 
npm run dev
```

#### 2.模板reducer之keducer
需要解决的问题有两个:

(1)多个state是隔离的，如何对多个state中的值进行批量操作？

(2)如果当前state依赖于上一次的state如何处理?
```js
// prefix类似于命名空间
export default function keducer(prefix, actionMutationMap = {}) {
  return (state = {}, action) => {
    return actionMutationMap[action.type]
      ? actionMutationMap[action.type](state, action.payload)
      : action.type.indexOf(`${prefix}.`) === 0
        ? { ...state, ...action.payload }
        : state
  }
}
```
这个函数接受第二个参数，如下方式:
```js
keducer('users', {
  //解决1:表示本次的state依赖于上一次的state的情况
  //解决2:多个state是隔离的
  //第一个参数为上一个状态的state
  //第二个参数是本次action.payload的值
  'auth.loginSuccess': (state, payload) => ({
    ...state, ...payload, ...{customStuff: true}
  })
})
```
有一点需要注意的:多个调用keducer得到的reducer是隔离的，即他们的state不是共享的(**依赖于闭包实现**)，但是可以通过前面的key来控制对多个state中的值进行同样的操作。同时，看可以通过传递一个回调函数，使得后面的state状态受到前一个state状态的控制!这就解决了上面说的两个问题。







参考资料:

[Keducer — Automate writing redux reducers with 5 lines of javascript](https://hackernoon.com/automate-writing-redux-reducers-with-5-lines-of-javascript-cecb79fb9a35)

[Fractal — A react app structure for infinite scale](https://hackernoon.com/fractal-a-react-app-structure-for-infinite-scale-4dab943092af)
