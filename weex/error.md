#### 前言
下面是在weex中遇到的部分报错问题，特此记录下来，如果有用，拿走不谢。也欢迎start。

#### 1.weex版本不匹配导致的问题
报错信息如下:
<pre>
Users/qinliang.ql/Desktop/yk-message-center/node_modules/_webpack@1.15.0@webpack/lib/TemplatedPathPlugin.js:50
                        if(!allowEmpty) throw new Error("Path variable " + match + " not implemented in this context: " + input);
                                        ^

Error: Path variable [name] not implemented in this context: /Users/qinliang.ql/.weex_tmp/[name].weex.js
    at /Users/qinliang.ql/Desktop/yk-message-center/node_modules/_webpack@1.15.0@webpack/lib/TemplatedPathPlugin.js:50:26
</pre>
解决方法:重新安装weex-toolkit:
```shell
npm uninstall weex-toolkit -g
# 必须uninstall一下
npm install weex-toolkit -g
```
安装后的版本为:
<pre>
- weex-debugger : v1.0.0-rc.32
- weex-builder : v0.3.17
- weex-previewer : v1.4.8
</pre>

#### 2.运行weex compile的时候babel-core不存在
报错信息如下:
<pre>
file:///usr/local/lib/node_modules/weex-toolkit/node_modules/_babel-loader@7.1.4@babel-loader/lib/index.js

when use command weex compile case error /node_modules/weex-ui/index.js Module build failed: Error: Cannot find module 'babel-core'
</pre>
其实上面的报错信息很明显，说usr/local/lib/node_modules目录下的weex-toolkit的node_modules下不存在babel-core，有点绕(但是是全局安装的命令)，解决方案如下:
```shell
cd /usr/local/lib/node_modules/weex-toolkit
# 最新的weex脚手架weex-toolkit竟然会出现这个问题，有点失望。
# 应该是weex-toolkit把babel-core设置为devDependencies依赖了导致未安装
# https://github.com/weexteam/weex-toolkit/blob/master/package.json#L28
tnpm i babel-core -S
```
这样当你运行`weex preview ./index.vue`的时候就不会出现问题了。

#### 3.weex preview命令的时候提示端口被占用
报错信息如下:
<pre>
weex preview ./index.vue 
09:48:55 : Bundling source...
09:48:56 : weex JS bundle saved at /Users/qinliang.ql/.weex_tmp
09:48:57 : Wed Mar 14 2018 09:48:57 GMT+0800 (CST)WebSocket  is listening on port 8082
09:48:57 : Wed Mar 14 2018 09:48:57 GMT+0800 (CST)http  is listening on port 8081
09:48:57 : http://30.97.92.166:8081/?hot-reload_controller&page=index.js&loader=xhr&wsport=8082&type=vue
09:48:57 : Error: listen EADDRINUSE 0.0.0.0:8082
    at Object._errnoException (util.js:1022:11)
    at _exceptionWithHostPort (util.js:1044:20)
    at Server.setupListenHandle [as _listen2] (net.js:1351:14)
    at listenInCluster (net.js:1392:12)
    at doListen (net.js:1501:7)
    at _combinedTickCallback (internal/process/next_tick.js:141:11)
    at process._tickCallback (internal/process/next_tick.js:180:9)
09:48:57 : The server has been setted up.

</pre>

我马上执行了下面的命令:
```shell
lsof -i:8082
# 我发现8082根本就没有被占用，如果占用可以使用kill -9 (pid的值)
```
因为以前以尝试开发过cli命令，所以我自然想到指定--port，抱着试一试的心态:
```shell
weex preview ./index.vue --port 8088
```
此时发现一切正常。
