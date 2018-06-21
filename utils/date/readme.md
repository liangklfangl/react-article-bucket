#### 1.前言
这部分主要是时间相关的工具函数，依赖于moment.js。欢迎star

#### 2.API如下

- getDateByDay
  
  传入的为星期，得到的是具体的日期。传入的值为:1....7

- counter
  
  倒计时。小时，分钟，秒。传入开始时间，结束时间

```js
const  openWalfareTime = "2018-04-13 14:00:00";
const counterDown = counter(
      moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
      data.openWalfareTime
    );
    const { hours, minutes, seconds } = counterDown;
```

- getCurrent
 
  获取当前时间，如果小于10在前面补上0，比如09

- isBetweenTime/isBefore/isAfter

  在两个时间之间。格式为YYYY-MM-DD HH:mm:ss。

- getTimeStamp
  
  获取时间，传入的参数如果为2表示今日，否则表示本周时间。

- moment2TimeStamp
  
  接受两个参数，第一个为moment类型/时间字符串。第二个参数为是否为毫秒级别，如果是需要乘以1000即可。

- moment2Str
  
  将moment类型转化为string字符串

- getMomentByString

  根据特定的时间格式+特定时间，获取到moment对象
