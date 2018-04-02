// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;
    // queue for late tasks, used by unhandled rejection tracking
    var laterQueue = [];
    function flush() {
        var task, domain;
        while (head.next) {
            head = head.next;
            task = head.task;
            head.task = void 0;
            domain = head.domain;
            if (domain) {
                head.domain = void 0;
                domain.enter();
                // 设置活动态的domain
            }
            // head.task和head.domain都会被重置为空
            runSingle(task, domain);
            // 拿着task和head.domain执行runSingle方法
        }
        while (laterQueue.length) {
            task = laterQueue.pop();
            runSingle(task);
        }
        flushing = false;
    }
    // runs a single function in the async queue
    // 在异步队列里面执行单个函数
    function runSingle(task, domain) {
        try {
            task();
            // 直接执行某一个task
        } catch (e) {
            if (isNodeJS) {
                // In node, uncaught exceptions are considered fatal errors.
                // Re-throw them synchronously to interrupt flushing!
                // 在Node中，uncaught exceptions是致命错误，同步抛出这个错误，防止继续调用flush方法
                // Ensure continuation if the uncaught exception is suppressed
                // listening "uncaughtException" events (as domains does).
                // Continue in next event to avoid tick recursion.
                if (domain) {
                    domain.exit();
                }
                setTimeout(flush, 0);
                if (domain) {
                    domain.enter();
                }
                throw e;
            } else {
                // In browsers, uncaught exceptions are not fatal.
                // Re-throw them asynchronously to avoid slow-downs.
                // 在浏览器中，uncaught exceptions不是致命的，可以异步抛出这个错误
                setTimeout(function () {
                    throw e;
                }, 0);
            }
        }

        if (domain) {
            domain.exit();
        }
    }

    nextTick = function (task) {
        // tail重新设置它的next值
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };
         // 如果不处于flushing状态，调用requestTick，其实就是最新的方式调用flush方法
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process === "object" &&
        process.toString() === "[object process]" && process.nextTick) {
        // 保证Q是真实的运行在Node环境中的，而且是存在process.nextTick方法的，下面是查找非真实的Node环境:
        //(1)Mocha的测试:process全局变量是不存在nextTick的
        //(2)Browserify测试:通过setTimeout的方式实现了一个process.nextTick,此时setImmediate要早于setTimeout
        //   同时Browserify的`process.toString()`是`[object Object]`而真实的Node环境中输出的是`[object process]`
        // * Browserify - exposes a `process.nexTick` function that uses
        isNodeJS = true;
        // 是在Nodejs执行环境中
        requestTick = function () {
            process.nextTick(flush);
        };
    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        // 表示运行在浏览器端
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // 测试结果是在在当前页面postMessage的函数最快执行(比iframe等都快)
        // http://www.nonblocking.io/2011/06/windownexttick.html
        // https://jsperf.com/postmessage
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently(间歇性的) cannot create
        // working message ports the first time a page loads.
        // 监听onmessage并初次调用flush方法
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            // Opera要求我们首次调用postMessage方法并提供一个参数，不管我们是否使用它
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            // setTimeout(0)期间channel.port1.onmessage可能已经触发，此时requestTick已经被重置为空
            //  channel.port1.onmessage = flush调用flush方法
            requestPortTick();
        };
    } else {
        // old browsers
        // 老版本的浏览器直接调用setTimeout(0)执行代码
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }
    // runs a task after all other tasks have been run
    // this is useful for unhandled rejection tracking that needs to happen
    // after all `then`d tasks have been run.
    // 当所有的task已经执行完毕后再执行该task，其常用于追踪unhandled rejection，这些unhandled rejection
    // 当所有的then指定的microtask执行完毕以后调用
    nextTick.runAfter = function (task) {
        laterQueue.push(task);
        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };
    return nextTick;
})();





Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            Q.nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            Q.nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};


  Q.nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });


Q.nextTick(function () {
                progressListener(progress);
            });
