#### 1.简介
Sockjs模块和Nodejs的http.createServer模块一样创建了一个Server实例。
```js
const sockjs_server = sockjs.createServer(options);
```
其接受的参数如下:

##### 1.1 sockjs_url
那些不支持跨域的情况会使用iframe这种方式，从sockjs服务器拿到的页面会被放到一个不可见的iframe里面，然后使用外部的域名。在这个iframe中执行的代码不用关系跨域的问题，因为它是运行在sockjs的服务器里面。这个iframe也需要加载sockjs的客户端代码，你可以使用这个选项指定url，但是如果你不清楚可以使用最新的sockjs客户端版本，这也是默认的行为。在服务器端为了安全你一定要指定这个url,因为我们不能在sockjs域名运行任何外部的js代码。

##### 1.2 prefix 
服务器的url前缀。所有以这个前缀开头的http请求将会被sockjs处理。其他请求会被直接放过。

#### 2.sockjs实例样式
```js
'use strict';
const http = require('http');
const express = require('express');
const sockjs = require('sockjs');
const sockjs_opts = {
  prefix: '/echo'
};
const sockjs_echo = sockjs.createServer(sockjs_opts);
sockjs_echo.on('connection', conn => {
  console.log('服务器connection');
  conn.on('data', msg => conn.write(msg));
});
const app = express();
app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));
const server = http.createServer(app);
// echo开头的请求交给sockjs服务器处理
sockjs_echo.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0', () => {
  console.log(' [*] Listening on 0.0.0.0:9999');
});
```
上面是服务端代码，明确的告诉我们所有以/echo开头的请求全部交给sockjs服务器处理。假如请求/会直接发送index.html给客户端(详细代码为[](./template/sockjs.html)),其关键js代码如下:
```js
    var sockjs_url = '/echo';
    var sockjs = new SockJS(sockjs_url);
    // echo开头的请求
    $('#first input').focus();
    var div  = $('#first div');
    var inp  = $('#first input');
    var form = $('#first form');
    var print = function(m, p) {
        p = (p === undefined) ? '' : JSON.stringify(p);
        div.append($("<code>").text(m + ' ' + p));
        div.append($("<br>"));
        div.scrollTop(div.scrollTop()+10000);
    };
    sockjs.onopen    = function()  {print('[*] open', sockjs.protocol);};
    sockjs.onmessage = function(e) {print('[.] message', e.data);};
    sockjs.onclose   = function()  {print('[*] close');};
    form.submit(function() {
        print('[ ] sending', inp.val());
        sockjs.send(inp.val());
        inp.val('');
        return false;
    });
```
此时所有的请求会直接被sockjs服务器拦截。connection也会被调用。

![](./images/sockjs.png)

#### 3.sockjs之webpack-dev-server
如果去看webpack-dev-server源码你会发现客户端的sockjs_url和服务端的prefix是一致的。
```js
// 调用server.listen的时候注册了sockjs
Server.prototype.listen = function() {
const returnValue = this.listeningApp.listen.apply(this.listeningApp, arguments);
    const sockServer = sockjs.createServer({
        sockjs_url: "/__webpack_dev_server__/sockjs.bundle.js",
        log: function(severity, line) {
            if(severity === "error") {
                console.log(line);
            }
        }
    });
    sockServer.on("connection", function(conn) {
        if(!conn) return;
        this.sockets.push(conn);
        // 1.放在一个集合中
        conn.on("close", function() {
            const connIndex = this.sockets.indexOf(conn);
            if(connIndex >= 0) {
                this.sockets.splice(connIndex, 1);
            }
        }.bind(this));
        if(this.clientLogLevel)
            this.sockWrite([conn], "log-level", this.clientLogLevel);
        if(this.clientOverlay)
            this.sockWrite([conn], "overlay", this.clientOverlay);
        if(this.hot) this.sockWrite([conn], "hot");

        if(!this._stats) return;
        this._sendStats([conn], this._stats.toJson(clientStats), true);
    }.bind(this));
    // 2.服务端注册的sockjs-node表示这种请求全部通过sockjs处理
    sockServer.installHandlers(this.listeningApp, {
        prefix: "/sockjs-node"
    });
}
```
下面是客户端代码:
```js
var SockJS = require("sockjs-client");
var retries = 0;
var sock = null;
function socket(url="sockjs-node", handlers) {
    sock = new SockJS(url);
    sock.onopen = function() {
        retries = 0;
    }
    sock.onclose = function() {
        if(retries === 0)
            handlers.close();
        sock = null;
        if(retries <= 10) {
            var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
            retries += 1;
            setTimeout(function() {
                socket(url, handlers);
            }, retryInMs);
        }
    };
    sock.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        if(handlers[msg.type])
            handlers[msg.type](msg.data);
    };
}
module.exports = socket;
```
这样客户端就可以接受到服务端关于打包的即时信息了,即服务端即时将消息推送到客户端去。而且在sockjs的**connection事件中保存了所有已打开的客户端句柄**，后续除非有新的客户端连接不然是不会触发connection的，是利用该句柄来完成的消息推。那么客户端socket是怎么建立的呢，请看下面的代码:
```js
  // 客户端会加载这个sockjs.bundle.js
  app.get('/__webpack_dev_server__/sockjs.bundle.js', (req, res) => {
    res.setHeader('Content-Type', 'application/javascript');
    fs.createReadStream(
      path.join(__dirname, '..', 'client', 'sockjs.bundle.js')
    ).pipe(res);
  });
  const socket = sockjs.createServer({
      sockjs_url: '/__webpack_dev_server__/sockjs.bundle.js',
      // sockjs_url通过服务端指定，避免加载外部不安全脚本，给客户端用的sockjs脚本
      log: (severity, line) => {
        if (severity === 'error') {
          this.log.error(line);
        } else {
          this.log.debug(line);
        }
      }
    });
```
详细可以[点击这里](https://github.com/liangklfangl)查看。
