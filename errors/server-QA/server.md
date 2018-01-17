#### 1.Uncaught SyntaxError: Unexpected token < in JSON at position 2
解决方案:服务端环境没有授权，导致接口调用不通!

#### 2.moment设置为12h而不是24h
解答:
<pre>
H, HH       24 hour time
h, or hh    12 hour time (use in conjunction with a or A) 
</pre>

#### 3.接口出现Method Not Allowd
##### 3.1 基础知识
Content-Type 主要设置你发送给服务器的格式，发送给服务器的默认格式是**application/x-www-form-urlencoded**，这种格式的特点就是，name/value成为一组，每组之间用&联接，而 name与value则是使用=连接。如:wwwh.baidu.com/q?key=fdsa&lang=zh这是get , 而post 请求则是使用请求体，参数不在url中，在请求体中的参数表现形式也是: key=fdsa&lang=zh的形式。这种方式传递服务端基本数据格式是没有问题的，如下:
```js
{
    a: 1,
    b: 2,
    c: 3
}
```
但是在一些复杂的情况下就有问题了,比如下面的格式:
```js
{
  data: {
    a: [{
      x: 2
    }]
  }
}
```
这个复杂对象， application/x-www-form-urlencoded这种形式是没有办法将复杂的JSON 组织成键值对形式，所以经常出现如**302/50x/Method Not Allowd**等错误 （其实你可以[参考这里](https://stackoverflow.com/questions/6243051/how-to-pass-an-array-within-a-query-string)来绕过这种情况）。你传进去可以发送请求，但是服务端收到数据为空， 因为ajax没有办法知道怎样处理这个数据。因此，对于这种数据格式可以通过指定**application/json**这种内容格式。当然你也可以通过下面方式来在query中传入数组:
```js
?list_a=1&list_a=2&list_a=3&list_b[]=1&list_b[]=2&list_b[]=3&list_c=1,2,3
// php格式
```

##### 3.2 目前出现的原因

- 1.没有代理
 比如superAgent有些情况就不走代理。于是就会出现上面的Method Not Allowd错误。当然，在传入的参数不正确的情况下也可能出现这种错误(一般情况下是**302**)。最后遇到的一种情况是与传入的JSON的key有关系。
```js
cons submitData = {
  "sex":'male',
  "businessAddressDTO.longitude": submitData.longitude,
  "businessAddressDTO.latitude": submitData.latitude
  // 因为提交的这个对象businessAddressDTO.longitude存在，前端需要保证json的有效key
  // 进而服务端可以有效解析
};
ajax({
    url: "/update",
    type: "POST",
    // 这里contentType不是'application/json'，所以没有直接stringify
    data: submitData
})
```
- contentType
 是否设置了contentType对返回结果也有很大影响，比如下面的代码就设置了contentType的值。
```js
ajax({
  url: "/xiaoer/api/recommend/search",
  data: {
    pageNo: 1,
    type: 3
  },
  type: "get",
  contentType: "application/json"
  // 只能是type我2
})
```

- 传入的参数含有数组
  传入的参数含有数组的情况下有些框架不能正确处理(看请求发送出去的数据)，特别是`Post`请求的情况下。所以选择合适的ajax框架也很重要。
```js
ajax({
  url: "/xiaoer/api/recommend/save",
  type: "post",
  // post请求
  contentType: "application/json",
  // contentType
  data: JSON.stringify({
    id: "1122",
    startTime: "1514937600000",
    endTime: "1515283200000",
    nodes: [{ oriId: "1513756224278", reason: "dddd" }]
  })
  // 数据已经stringify，服务端需要parse。对于复杂类型要采用"application/json"
  // 前面第一个post例子没有stringify，所以服务端需要保证key为businessAddressDTO.longitude
  // 这种格式
})
```

- 端口号相关
  特别在走代理的情况下，有可能对代理本身的端口做了限制。也会出现method Not Allowed的情况!




参考资料:

[moment.js 24h format](https://stackoverflow.com/questions/12970284/moment-js-24h-format)

[$.ajax 中的contentType](https://www.cnblogs.com/htoooth/p/7242217.html)

[How to pass an array within a query string?](https://stackoverflow.com/questions/6243051/how-to-pass-an-array-within-a-query-string)
