<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Vue 测试实例 - 菜鸟教程(runoob.com)</title>
<script src="https://cdn.bootcss.com/vue/2.4.2/vue.min.js"></script>
</head>
<body>
<div id="app">
  <p>{{ message }}</p>
  <parent gender="男" age="26"/>
</div>

<script>
Vue.component('grand-child',{
   props: [],
   template:'<div>This is grand-child component!</div>'
});
Vue.component('child',{
   props: ["gender"],
  //可以获取到父组件通过v-bind="$attrs"绑定的值
   mounted:function(){
    console.log('组件挂载可以获取gender的值为',this.gender);
  console.log('组件挂载可以获取this.$attrs的值为',this.$attrs);
  console.log('组件挂载可以获取this.$props["gender"]的值为',this.$props['gender']);
   },
   template:'<div>This is child component!<grand-child/></div>'
});
//child组件里面使用了grand-child组件
Vue.component('parent',{
   props: [],
   //parent组件使用的时候没有通过props设置应该传递的prop,但是可以通过$attrs获取
   template:'<div>This is parent component!<br/><child v-bind="$attrs"/></div>'
});
//在实例化Vue之前要注册其他组件，从而在template里面可以使用其他组件
new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
</script>
</body>
</html>
