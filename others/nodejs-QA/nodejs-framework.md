#### 前言
这部分主要关注Nodejs中框架层面的东西。欢迎star,issue。

#### 1.koa中的ctx
ctx是context的缩写,中文一般叫成上下文，这个在所有语言里都有的名词，可以理解为**上(request)下(response)沟通的环境**。所以koa中把他们两都封装进了ctx对象，koa官方文档里的解释是为了调用方便:
<pre>
ctx.req=ctx.request;
ctx.res=ctx.response
</pre>

类似linux系统中的软连接？最终执行还是request和response对象。body是http协议中的响应体，header是指响应头:
<pre>
 ctx.body = ctx.res.body = ctx.response.body   
</pre>








参考资料:

[关于koa2 的ctx.body是什么？](https://segmentfault.com/q/1010000008379638?_ea=1631200)

[koa中的ctx官方文档](https://github.com/koajs/koa/blob/master/docs/api/context.md)
