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

#### 2.Vue-Router如何获取到上一次的路由?
其实一开始我也是陷入了死胡同了，我想知道上一次的路由，然后判断**它是否在白名单中**，如果在白名单中我从localStorage中获取数据，如果不在白名单中我就执行采用默认的数据来渲染页面。这样就可以满足**用户点击后退按键的时候能够保存上一次的组件状态**。
```js
/**
     * 1.mounted的执行时机早于beforeRouteEnter
     * 2.这里面无法获取this实例
     */
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // if (from.path && from.path.indexOf('landingPageCreate') != -1) {
            //     const msgStatusSelect = localStorage.getItem('msgStatusSelect');
            //     const msgTypeSelect = localStorage.getItem('msgTypeSelect');
            //     msgStatusSelect2localStorage = msgStatusSelect;
            //     msgTypeSelect2localStorage = msgTypeSelect;
            // }
        })
    },
```
因为受限于上面两个条件:**第一点**:在beforeRouteEnter里面没法获取到this，那也意味着我不能通过this设置组件的值，即无法通过它完成UI的更新(虽然此时我明确的知道页面来源)。**第二点**:mounted的执行时机早于beforeRouteEnter,这也意味着组件已经更新了，然后你才去获取值，所以，即使你通过vm.xxx=xxx这种方式赋值，在mounted里面也是无法获取到的，因为beforeRouteEnter在后面执行的，即还没有赋值，所以当然无法读取!

所以我的判断是beforeRouteEnter一般只是用于路由跳转redirect等，而无法通过这个方法修改组件数据。最后我抛弃了白名单的策略，**采用的策略如下**:
<pre>
1.每次文本框的值修改后都写到localStorage,同时调用this.$router.replace方法
2.浏览器后退的时候可以从localStorage里面获取数据，然后做一次重新搜索，在created或者mounted里面都可以
</pre>

```js
watch:{
  // 监听两个变量的变化并调用this.$router.replace更新到URL
    'msgTypeSelect': function(curVal, oldVal) {
      const href = window.location.href;
      const hash = window.location.hash;
      const idx = href.indexOf('?');
      let query = href.substring(idx + 1);
      if (idx != -1) {
          query = query.split('&').reduce((prev, cur) => {
              const [key, value] = cur.split('=');
              prev[`${key}`] = value;
              return prev
          }, {});
          // 已经有查询字符串
          this.$router.replace({
              path: '/pushlist',
              query: {
                  ...query,
                  msgTypeSelect: curVal,

              }
          });
      } else {
          this.$router.replace({
              path: '/pushlist',
              query: {
                  msgTypeSelect: curVal
              }
          });
      }
  },
  'msgStatusSelect': function(cur, old) {
      const href = window.location.href;
      const hash = window.location.hash;
      const idx = href.indexOf('?');
      let query = href.substring(idx + 1);
      if (idx != -1) {
          query = query.split('&').reduce((prev, cur) => {
              const [key, value] = cur.split('=');
              prev[`${key}`] = value;
              return prev
          }, {});
          this.$router.replace({
              path: '/pushlist',
              query: {
                  ...query,
                  msgStatusSelect: cur

              }
          });
      } else {
          this.$router.replace({
              path: '/pushlist',
              query: {
                  msgStatusSelect: cur
              }
          });
      }
  },
},
data(){
  return {
     msgStatusSelect: this.getQueryString('msgStatusSelect', true) || "-1",
     msgTypeSelect: this.getQueryString('msgTypeSelect', true) || "-1",
     // 默认从URL上获取，更新this.data的值
     // 初始情况URL为空，所以搜索出全部的结果(-1表示全部)
  }
},
created(){
  // 初次进入或者后退的时候走一次接口，如果能从URL中拿到数据就表示后退，否则-1表示直接进入
  const href = window.location.href;
  const hash = window.location.hash;
  const idx = href.indexOf('?');
  let query = href.substring(idx + 1);
  if (idx != -1) {
      query = query.split('&').reduce((prev, cur) => {
          const [key, value] = cur.split('=');
          prev[`${key}`] = value;
          return prev
      }, {});
      // 已经有查询字符串
      this.$router.replace({
          path: '/pushlist',
          query: {
              ...query,
              gmtCreateBegin: `${date} 00:00:00`,
              gmtCreateEnd: `${date} 23:59:59`,
              msgTypeSelect: this.getQueryString('msgTypeSelect', true) || "-1",
              msgStatusSelect: this.getQueryString('msgStatusSelect', true) || "-1"
          }
      });
  } else {
      this.$router.replace({
          path: '/pushlist',
          query: {
              gmtCreateBegin: `${date} 00:00:00`,
              gmtCreateEnd: `${date} 23:59:59`,
              msgTypeSelect: this.getQueryString('msgTypeSelect', true) || "-1",
              msgStatusSelect: this.getQueryString('msgStatusSelect', true) || "-1"
          }
      });
},
methods:{
 getQueryString: function(name, isSpa) {
          name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
          var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
              results = regex.exec(isSpa ? location.hash : window.location.search.substr(1));
          return results == null ? "" : decodeURIComponent(results[1]);
      }
 }
}
```
这样不需要使用localStorage就可以直接完成页面后退的功能了，而不用判断上一次的路由来源。只要操作的时候修改URL，然后从URL中读取参数并查询，没有参数的话直接传入**-1表示直接进入而不是浏览器后退**。当然上面的重复代码应该提取到公共的函数，此处不再赘述。关于replace的用法你可以[参考这个文档](https://router.vuejs.org/zh-cn/essentials/navigation.html)。
