#### 主要内容
在本章节，主要是一些渲染引擎相关内容。我主要会围绕如何使用chrome来提升页面性能来展开，教你如何使用chrome控制台高级特性。如果你有任何问题欢迎issue,同时也欢迎star！

#### chrome的网络请求面板
![](./images/net.png)

- Queueing
  排队阶段表示:有更高**优先级**的请求需要发送;该域名下已经有**6**条TCP连接了，这适用于http/1.0和http/1.1;浏览器在为硬盘缓存**分配空间**。
- Stalled
  可能的原因与排队中一致
- DNS Lookup
  浏览器在解析请求的IP地址
- Initial Connection / Connect
  通过TCP三次握手和服务端建立联系。可以通过下面的代码预先建立和特定主机的TCP连接
```html
  <link href='https://cdn.keycdn.com' rel='preconnect' crossorigin>
```
- Proxy negotiation
  浏览器在和代理服务器进行协商
- Request sent
  请求已经发送出去了
- ServiceWorker Preparation
  浏览器在启动service worker
- Request to ServiceWorker
  请求已经发送到service worker
- Waiting (TTFB)
  浏览器在等待响应的第一个比特。100ms以下表示很好,200-500ms是标准;500ms – 1s表示很慢;1s+建议排查下，可以考虑使用缓存。
- Content Download
  浏览器在接受服务端的响应数据
- Receiving Push
  浏览器通过HTTP/2服务器推接受服务端数据
- Reading Push
  浏览器在读取上一步接受到的服务器推送的数据
- Data Transferred / Bytes In / Page Size
  你的网站的整体资源大小，当然是越精简越好。  

#### Chrome的performance
- Recalculate Style
  与DOM解析不同，该时间线不显示单独的“Parse CSS”条目，而是在这一个事件下**一同捕获解析和 CSSOM树构建，以及计算的样式的递归计算**。  
