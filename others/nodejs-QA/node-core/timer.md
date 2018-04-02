#### 前言
关于Nodejs中的timer核心模块的学习

#### timer的unref方法
```js
var timer1 = setTimeout(function(){
  console.log(new Date, 1);
}, 1000);
// setTimeout=>uv_timer_start(timer1)  active_handles = 1

var timer2 = setInterval(function(){
  console.log(new Date, 2);
}, 1000);
// setInterval=>uv_timer_start(timer2) active_handles = 2

// 1: ative_handles > 0 => loop()
// timer1 timeout => uv_timer_stop(timer1) active_handles = 1  => callback()
// timer2 timeout => uv_timer_stop(timer2) active_handles = 0  => callback() => uv_timer_start(timer2) active_handles = 1
// 2: active_handles > 0 =>  loop()
// timer2 timeout => uv_timer_stop(timer2) active_handles = 0  => callback() => uv_timer_start(timer2) active_handles = 1
// goto 2
```
上面的例子会打印"1,2,2....",下面是第二种情况:
```js
var timer1 = setTimeout(function(){
  console.log(new Date, 1);
}, 1000);
// setTimeout=>uv_timer_start(timer1)  active_handles = 1

var timer2 = setInterval(function(){
  console.log(new Date, 2);
}, 1000);
// setInterval=>uv_timer_start(timer2) active_handles = 2

timer2.unref();
// uv_unref(timer2) active_handles = 1

// ative_handles > 0 => loop()
// timer1 timeout => uv_timer_stop(timer1) active_handles = 0  => callback()
// timer2 timeout => uv_timer_stop(timer2) active_handles = 0  => callback() => uv_timer_start(timer2) active_handles = 0
// active_handles == 0 =>  exit_process
```
打印结果为"1,2"。下面是情况3:
```js
var timer1 = setInterval(function(){
  console.log(new Date, 1);
}, 1000);
// setInterval=>uv_timer_start(timer1)  active_handles = 1

var timer2 = setInterval(function(){
  console.log(new Date, 2);
}, 1000);
// setInterval=>uv_timer_start(timer2) active_handles = 2

// 1: ative_handles > 0 => loop()
// timer1 timeout => uv_timer_stop(timer1) active_handles = 1  => callback() => uv_timer_start(timer1) active_handles = 2
// timer2 timeout => uv_timer_stop(timer2) active_handles = 1  => callback() => uv_timer_start(timer2) active_handles = 2
// goto 1
```
上面的例子会**循环打印**"1,2"。下面是情况4:
```js
var timer1 = setInterval(function(){
  console.log(new Date, 1);
}, 1000);
// setInterval=>uv_timer_start(timer1)  active_handles = 1

var timer2 = setInterval(function(){
  console.log(new Date, 2);
}, 1000);
// setInterval=>uv_timer_start(timer2) active_handles = 2

timer2.unref()
// uv_unref(timer2) active_handles = 1

// 1: ative_handles > 0 => loop()
// timer1 timeout => uv_timer_stop(timer1) active_handles = 0  => callback() => uv_timer_start(timer1) active_handles = 1
// timer2 timeout => uv_timer_stop(timer2) active_handles = 1  => callback() => uv_timer_start(timer2) active_handles = 1
// goto 1
```
上面的例子也会**循环打印**"1,2"。下面是情况5:
```js
var timer1 = setInterval(function(){
  console.log(new Date, 1);
}, 1000);
// setInterval=>uv_timer_start(timer1)  active_handles = 1

timer1.unref()
// uv_unref(timer1) active_handles = 0

var timer2 = setInterval(function(){
  console.log(new Date, 2);
}, 1000);
// setInterval=>uv_timer_start(timer2) active_handles = 1

timer2.unref()
// uv_unref(timer2) active_handles = 0

// ative_handles == 0 => exit process
```
上面这种情况**不会打印任何内容**，直接退出程序。




参考资料:

[timer的unref函数](https://cnodejs.org/topic/570924d294b38dcb3c09a7a0)
