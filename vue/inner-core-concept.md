#### 前言
本部分我们主要添加一些在Vue学习中应该深入考虑的地方。

#### 1.Vue的响应式原理
知乎的[深入浅出Vue基于“依赖收集”的响应式原理](https://zhuanlan.zhihu.com/p/29318017)给出了非常深刻的回答，下面只是在回答上面加上自己的一点理解，建议[去原文阅读](https://zhuanlan.zhihu.com/p/29318017)。
```js
/**
 * 1.依赖收集器的target:用来存放监听器里面的onComputedUpdate()方法的。即当对象的属性变化后需要依赖某个回调函数来计算出
 * 计算属性(computed)，这个回调函数就是依赖收集器。之所以叫依赖收集器是因为该方法里面往往都是对对象本身数据的依赖从而得到
 * 计算属性的值
 */
const Dep = {
  target: null
}

/**
 * 2.为对象设置get,set方法，同时当你调用该对象的get方法以后，我需要把相应的回调传入到一个数组中，因为所有的计算属性都是会
 * 依赖于对象本身的值的，这也是上面依赖收集器的来源。而当你对对象本身的值进行修改以后，其需要通知所有的计算属性去更新自身的值。
 * 这是典型的观察者模式。
 */
function defineReactive (obj, key, val) {
  const deps = []
  Object.defineProperty(obj, key, {
    get () {
        // 这里假设只有watcher会读取它的属性，从而将回调放到watcher的回调列表里面
      console.log(`我的${key}属性被读取了！`)
      if (Dep.target && deps.indexOf(Dep.target) === -1) {
        deps.push(Dep.target)
      }
      return val
    },
    set (newVal) {
      console.log(`我的${key}属性被修改了！`)
      val = newVal
      deps.forEach((dep) => {
        dep()
      })
    }
  })
}

/**
 * 3.把一个对象的每一项都转化成可观测对象
 */
function observable (obj) {
  const keys = Object.keys(obj)
  for (let i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i], obj[keys[i]])
  }
  return obj
}

/**
 * 4.当计算属性的值被更新时调用
 * @param { Any } val 计算属性的值
 */
function onComputedUpdate (val) {
  console.log(`我的类型是：${val}`)
}

/**
 * 5.观测者:观察特定的计算属性的值的变化，如果它变化后需要执行特定的回调callback，即cb函数。计算cb函数得到计算属性的值
 * 同时把这个新的值传递给onComputedUpdate，即输出计算属性更新后的值
 */
function watcher (obj, key, cb) {
  const onDepUpdated = () => {
    const val = cb()
    onComputedUpdate(val)
  }

/**
 * 6.当你获取对象观察属性的时候会进一步调用watcher函数的回调函数得到新的值进而通知给onComputedUpdate
 */
  Object.defineProperty(obj, key, {
    get () {
      Dep.target = onDepUpdated;
      // 立即调用watch回调函数进而将Dep.target更新到defineReactive，因为回调函数会读取Object上的值，从而调用其get方法
      const val = cb()
      Dep.target = null
      return val
    },
    set () {
      console.error('计算属性无法被赋值！')
    }
  })
}
```
其实上面的代码解决了以下几个问题:
<pre>
1.当对象的属性值变化以后需要根据更新后的值得到新的计算属性的值
2.可能有多个计算属性的值依赖于对象的同一个值，所以当你获取对象的某个值的时候需要以数组形式保存所有计算属性的回调函数
</pre>


#### 2.为什么Vue使用MutationObserver做批量处理？
根据[HTML Standard](https://www.zhihu.com/question/55364497/answer/144215284)，在**每个task运行完以后，UI都会重渲染**，那么在microtask 中就完成数据更新，当前task结束就可以得到最新的UI了。反之如果新建一个task来做数据更新，那么**渲染就会进行两次**（当然，浏览器实现有不少不一致的地方）。总之，我的理解就是使用MutationObserver来做UI更新是为了使得用户界面能够尽快更新，因为它本身就是一个microtask而不是Task。更多内容你可以[查看](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/browser-QA.md)我的这个文章。


参考资料:

[深入浅出Vue基于“依赖收集”的响应式原理](https://zhuanlan.zhihu.com/p/29318017)

[Vue 源码解析：深入响应式原理（上）](https://www.imooc.com/article/14466)
