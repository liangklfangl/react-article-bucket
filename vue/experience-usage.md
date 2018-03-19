#### 前言
在这部分，我主要会写一些在vue使用中遇到的问题以及常见的解决方法。

#### 1.Vue-Router中多次渲染顶层组件
下面是Vue-Router中的router-view的简单用法。下面是webpack入口文件中内容:
```js
new Vue({
  router,
  render: h => h(Layout)
  // data: function() {
  //   return { name: "qingtian" };
  // }
  // components: { Main },
  // 必须指定template或者render方法，但是如果指定了会导致Main组件被重复渲染
  // 下面的/的path又会重新渲染一次Main组件，所以Layout组件就只要指定router-view即可
  // template: "<Main/>"
}).$mount("#app");
```
注意:在使用的时候不要添加components，比如上面的注释部分，其实会立马渲染一个Main组件，导致和router里面的指定的path为"/"为Main组件重复渲染。其实在Layout组件中，我们只需要如下内容即可:
```js
<template>
    <div>
        <router-view></router-view>
    </div>
</template>
<style>
</style>
```
而下面是我们具体的router即前端路由部分:
```js
export default new Router({
  routes: [
    {
      path: "/",
      // 1.默认路由的ref，React-Router里面的IndexRouter或者采用空的子路由
      name:'default',
      // chunkName
      component: Main,
      children: [
        {
          path: "",
          name: "default",
          component: resolve => require(["@/components/$ref.vue"], resolve)
        },
        {
          path: "ref",
          name: "ref",
          component: resolve => require(["@/components/$ref.vue"], resolve)
        },
        {
          path: "slot",
          name: "slot",
          component: resolve =>
            require(["@/components/slotPlusSlotScope.vue"], resolve)
        }
      ]
    }
  ]
});
```
这里当你访问的path为"/"的时候，其实上面app下的router-view将会被Main以及$ref.vue的组件替换掉。这一点一定要注意。因为他是router-view最本质的东西。
