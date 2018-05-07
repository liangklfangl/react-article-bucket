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
Vue.component('child',{
   props: ["age"],
   beforeUpdate:function(){
    console.log('子组件beforeUpdate被调用');
   },
   updated:function(){
    console.log('子组件updated被调用');
   },
   mounted:function(){
     console.log('子组件被挂载');
   },
   template:'<div>我是儿子,我父亲的年龄为<span style="color:red;font-weight:bold">{{age}}</span>!</div>'
});

Vue.component('parent',{
   props: [],
   mounted:function(){
     console.log('父组件被挂载');
   },
   beforeUpdate:function(){
    console.log('父组件beforeUpdate被调用');
   },
   updated:function(){
    console.log('父组件updated被调用');
   },
   methods:{
   //修改父组件的年龄
     growOlder:function(){
     this.age = this.age+1;
   }
   },
   data:function(){
     return {
     age:48
   }
   },
   template:`<div>我是父亲,我的年龄为<span style="color:red;font-weight:bold">{{age}}</span><br/><button @click="growOlder">又变老一岁</button><br/><child :age="age"/></div>`
});

new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!'
  }
})
</script>
</body>
</html>
