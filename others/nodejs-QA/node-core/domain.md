#### 前言
这个章节是对Node的domain模块的翻译。

#### Domain模块
这个Domain模块提供了一种方式去把不同的IO操作为一个组来处理。如果组内任何一个Event Emitter或者回调函数抛出了一个`error`事件，或者直接抛出了一个错误，这时候domain对象将会收到信息，这种方式相对于`process.on('uncaughtException')`处理函数来说不会丢失错误信息的上下文，或者因为抛出一个错误码而导致进程立即退出。

#### Warning:不要忽略错误信息
Domain错误处理函数不会因为抛出一个错误码而导致进程直接退出。响应抛出错误的最安全的方式就是退出进程。当然，在一般的web服务器上，可能会存在很多打开的连接，所以因为一个进程抛出错误而关闭所有其他的进程显然不是合理的。所以，好的方法就是直接给导致错误的请求发送一个错误的响应，而同时让其他的请求能够正常结束，此时worker进程也不再接受新的请求。

这种情况下，Domain模块一般都是和cluster模块一起使用。因为当worker进程遇到一个错误的时候，主进程能够fork一个新的worker进程。因为Nodejs程序一般都会在多个机器上运行，终止代理或者服务注册表能够记录失败然后做出相应的处理。比如下面的代码就**不是**一个好的处理错误的方式:
```js
// XXX WARNING!  BAD IDEA!
const d = require('domain').create();
d.on('error', (er) => {
  // The error won't crash the process, but what it does is worse!
  // Though we've prevented abrupt process restarting, we are leaking
  // resources like crazy if this ever happens.
  // This is no better than process.on('uncaughtException')!
  console.log(`error, but oh well ${er.message}`);
});
d.run(() => {
  require('http').createServer((req, res) => {
    handleRequest(req, res);
  }).listen(PORT);
});
```
通过使用domain模块,同时将程序分成不同的worker进程，这样对于错误处理能够更加的合理和安全。
```js
// Much better!
const cluster = require('cluster');
const PORT = +process.env.PORT || 1337;
if (cluster.isMaster) {
  // A more realistic scenario would have more than 2 workers,
  // and perhaps not put the master and worker in the same file.
  //
  // It is also possible to get a bit fancier about logging, and
  // implement whatever custom logic is needed to prevent DoS
  // attacks and other bad behavior.
  //
  // See the options in the cluster documentation.
  //
  // The important thing is that the master does very little,
  // increasing our resilience to unexpected errors.

  cluster.fork();
  cluster.fork();
  cluster.on('disconnect', (worker) => {
    console.error('disconnect!');
    cluster.fork();
  });

} else {
  // the worker
  //
  // This is where we put our bugs!
  const domain = require('domain');
  // See the cluster documentation for more details about using
  // worker processes to serve requests.  How it works, caveats, etc.
  const server = require('http').createServer((req, res) => {
    const d = domain.create();
    d.on('error', (er) => {
      console.error(`error ${er.stack}`);
      // Note: We're in dangerous territory!
      // By definition, something unexpected occurred,
      // which we probably didn't want.
      // Anything can happen now!  Be very careful!
      try {
        // make sure we close down within 30 seconds
        const killtimer = setTimeout(() => {
          process.exit(1);
        }, 30000);
        // But don't keep the process open just for that!
        //timer.unref() which allows the creation of a timer that is active but if it is the only item left in the event loop, it won't keep the program running. If the timer is already unrefd calling unref again will have no effect.
        //https://nodejs.org/dist/latest-v5.x/docs/api/timers.html#timers_unref
        killtimer.unref();
        // stop taking new requests.
        server.close();
        // Let the master know we're dead.  This will trigger a
        // 'disconnect' in the cluster master, and then it will fork
        // a new worker.
        cluster.worker.disconnect();
        // try to send an error to the request that triggered the problem
        res.statusCode = 500;
        res.setHeader('content-type', 'text/plain');
        res.end('Oops, there was a problem!\n');
      } catch (er2) {
        // oh well, not much we can do at this point.
        console.error(`Error sending 500! ${er2.stack}`);
      }
    });
    // Because req and res were created before this domain existed,
    // we need to explicitly add them.
    // See the explanation of implicit vs explicit binding below.
    d.add(req);
    d.add(res);
    // Now run the handler function in the domain.
    d.run(() => {
      handleRequest(req, res);
    });
  });
  server.listen(PORT);
}
// This part is not important.  Just an example routing thing.
// Put fancy application logic here.
function handleRequest(req, res) {
  switch (req.url) {
    case '/error':
      // We do some async stuff, and then...
      setTimeout(() => {
        // Whoops!
        flerb.bark();
      }, timeout);
      break;
    default:
      res.end('ok');
  }
}
```

#### Error对象的额外属性
如果Domain接受到一个错误，此时错误对象还有如下的属性:
<pre>
1.error.domain 第一个处理错误信息的domain
2.error.domainEmitter 抛出`error`事件和错误对象的EventEmitter
3.error.domainBound 绑定到domain对象的回调函数，该回调函数的第一个参数是错误对象
4.error.domainThrown 一个表示是否抛出了错误的布尔值，或者是否给回调函数传入的错误对象
</pre>

#### 隐式绑定
如果一个Domain在使用中，那么所有的**新的**EventEmitter对象(Stream对象,request,response)在被创建的时候将会被隐式的绑定到这个活动态的domain上。同时,所有传递到Event Loop的回调函数(例如fs.open或者具有回调函数的方法)将会被自动绑定到活动态的domain上，如果这个回调函数抛出了错误，那么domain对象将会捕捉到。

为了防止过渡的内存消耗。Domain对象本身并不会隐式的被作为活动态的domain的子级被添加。如果它们被添加，那么将会阻止request或者response对象呗垃圾处理器回收掉。

如果要将一个Domain对象作为父级Domain对象的子级被添加，那么必须显式的指定它。

#### 显式绑定
有时候，某一个Event Emitter抛出的事件不应该被某个特定的domain抓获。或者某一个EventEmitter在特定的domain中被创建，但是需要绑定到一个新的domain。比如:下面的HTTP服务器在一个特定的domain中，但是我们希望使用一个独立的domain处理特定的请求:
```js
// create a top-level domain for the server
const domain = require('domain');
const http = require('http');
const serverDomain = domain.create();
serverDomain.run(() => {
  // server is created in the scope of serverDomain
  // server对象在serverDomain域创建
  http.createServer((req, res) => {
    // req and res are also created in the scope of serverDomain
    // however, we'd prefer to have a separate domain for each request.
    // create it first thing, and add req and res to it.
    const reqd = domain.create();
    reqd.add(req);
    reqd.add(res);
    reqd.on('error', (er) => {
      console.error('Error', er, req.url);
      try {
        res.writeHead(500);
        res.end('Error occurred, sorry.');
      } catch (er2) {
        console.error('Error sending 500', er2, req.url);
      }
    });
  }).listen(1337);
});
```

#### 下面是Domain提供的方法
- domain.create()
   
   Domain这个类包装了在一个活动态的Domain对象上处理错误,uncaught exceptions的功能

- domain.members
  
  一个被显示添加到特定Domain的定时器或者EventEmitter的数组

- domain.add(emitter)

  被添加的对象必须是定时器或者EventEmitter。该方法显式的为特定的domain添加一个Emitter。如果任何一个Emitter的回调函数抛出了一个错误，或者抛出了一个`error`事件，那么这些错误都会被domain的`error`事件处理，这和隐式绑定一样。

  这个方法也可以用于setInterval()和setTimeout()返回的定时器句柄。如果它们的回调函数抛出了错误，也会被domain对象的`error`句柄捕获。注意:**如果Timer或者EventEmitter已经绑定到特定的domain，那么它将会被移除，然后被添加一个新的**。

- domain.bind(callback)
  
  这个方法返回的函数将会对提供的callback函数进行一次包裹。如果返回的函数被调用并抛出错误都会被该domain捕获。

```js
const d = domain.create();
function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.bind((er, data) => {
    // if this throws, it will also be passed to the domain
    return cb(er, data ? JSON.parse(data) : null);
  }));
}
d.on('error', (er) => {
  // an error occurred somewhere.
  // if we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

- domain.enter()
  
  enter方法常常被run,bind,intercept方法调用去**设置活动态的domain**。它会设置**domain.active和process.domain**，同时隐式的将domain推入到domain模块管理的栈中。调用enter方法将会和以前特定domain中异步调用链和I/O操作区分开来。

  调用enter只会改变当前活动态的domain,而不会改变domain本身。enter和exit可以在一个domain中被调用任意次。

- domain.exit()
  
  exit方法将会退出当前domain，**同时将它从domain栈中推出**。任何时候调用该方法将会被切换到一个新的异步回调链，调用之前请确保当前domain存在。调用exit方法将会和以前domain的异步调用链和I/O区分开。

  如果当前执行上下文有多个嵌套的domain，exit方法将会**退出当前domain嵌套的任何domain**。调用exit方法只会改变当前活动态的domain，而不会改变domain本身。而enter和exit方法可以在当个domain上调用多次。

- domain.intercept(callback)
  
  这个方法和domain.bind(callback)类似。除了会捕获错误以外，它也会**拦截将错误对象传递给函数的第一个参数**。以前的if (err) return callback(err)模式将会被单个错误处理函数替换掉。

```js
const d = domain.create();
function readSomeFile(filename, cb) {
  fs.readFile(filename, 'utf8', d.intercept((data) => {
    // note, the first argument is never passed to the
    // callback since it is assumed to be the 'Error' argument
    // and thus intercepted by the domain.

    // if this throws, it will also be passed to the domain
    // so the error-handling logic can be moved to the 'error'
    // event on the domain instead of being repeated throughout
    // the program.
    return cb(null, JSON.parse(data));
  }));
}

d.on('error', (er) => {
  // an error occurred somewhere.
  // if we throw it now, it will crash the program
  // with the normal line number and stack message.
});
```

- domain.remove(emitter)
  
  其作用和domain.add相反，移除的EventEmitter的错误将不会被当前domain捕获。

- domain.run(fn[, ...args])
  
  在domain上下文中调用函数，它会自动绑定所有当前上下文中的EventEmitter/定时器/请求等。可选的args将会被传递给函数。
```js
const domain = require('domain');
const fs = require('fs');
const d = domain.create();
d.on('error', (er) => {
  console.error('Caught error!', er);
});
d.run(() => {
  process.nextTick(() => {
    setTimeout(() => { // simulating some various async stuff
      fs.open('non-existent file', 'r', (er, fd) => {
        if (er) throw er;
        // proceed...
      });
    }, 100);
  });
});
```
在这个例子中，d.on('error')将会被触发，而不会导致进程退出。

#### Domains and Promises
在Node 8.0.0中,Promise的处理函数将会在domain中被执行(domain in which the call to `.then` or `.catch` itself was made:):
```js
const d1 = domain.create();
const d2 = domain.create();
let p;
d1.run(() => {
  p = Promise.resolve(42);
});
d2.run(() => {
  p.then((v) => {
    // running in d2
  });
});
```
回调函数也能在特定的domain中被执行，但是需要你调用`domain.bind(callback)`方法:
```js
const d1 = domain.create();
const d2 = domain.create();
let p;
d1.run(() => {
  p = Promise.resolve(42);
});
d2.run(() => {
  p.then(p.domain.bind((v) => {
    // running in d1
  }));
});
```
