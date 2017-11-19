### 1.通过Promise.all或者Generator减少setState的次数
如下面的例子:

```js
 const URL = "http://localhost:8080";
 const request = require("superagent");
 const promise1 = request
      .get(URL1)
      .query({})
      .then(res => {
        const readme = JSON.parse(res.text);
        this.readme = readme;
        //(1)请求回来不会马上去渲染，而是等着所有需要的数据如detail得到以后才会处理
      });
    const promises = [promise1];
    //(2)根据URL来获取到应该展示的组件,如果URL有detail部分我们才会根据URL的component获取组件的详细信息
    if (this.props.params.component) {
      const promise2 = request
        .get(
          URL +
            this.props.params.component.replace(/\//, "%2F")
        )
        .query({})
        .then(res => {
          this.detail = res.text;
        });
      promises.push(promise2);
    }
    Promise.all(promises).then(() => {
      //(3)获取到所有组件的数据以及应该显示的某一条组件的详细信息以后才会渲染
      this.setState({
        readme: this.readme,
        detail: this.detail ? this.detail : this.readme[0].readme
      });
    });
```
我们采用下面的Generator函数简化代码:
```js
   function* gen() {
      let readme ;
       try{
       readme =  yield request.get(staticUrl).query({});
      }catch(e){
       //(1)一旦 Generator 执行过程中抛出错误，且没有被内部捕获，就不会再执行下去了
      }
      let detail = readme[0].readme;
      if (this.props.params.component) {
        const detailUrl =
          "http://localhost:7001/detail/" +
          that.props.params.component.replace(/\//, "%2F");
        //得到所有的readme内容
        detail = yield request.get(detailUrl).query({});
      }
      this.setState({
        readme: readme,
        detail: detail
      });
    }
    const g = gen.bind(this)();
    g.next().value.then(function(data) {
      const ge = g.next(JSON.parse(data.text));
      //(2)data是第一个ajax请求得到的数据，继续调用g.next(JSON.parse(data.text))将数据传入到变量readme中并开始执行第二个
      //yield的值
      if (ge.value) {
        ge.value.then(function(data) {
            //(3)第二次ajax得到数据
          g.next(data.text);
        });
      }
    });
```
关于Generator函数中this的绑定你可以参考这里的[内容](http://es6.ruanyifeng.com/#docs/generator)，其主要是通过call方法来完成的。可以绑定到object中，也可以绑定到Generator函数的prototype上，同时有一点一定要注意：我们调用Generator函数返回的是Generator函数的一个实例。

### 2.Generator函数的几种用法与yield调用几种方式

- yield\* inner()：这里表示的是yield\*表达式，用来在一个 Generator函数里面执行另一个 Generator函数。调用 generator function 会返回一个 generator object，这个对象本身也是一种 iterable object，所以，我们可以使用 yield\* generator_function() 这种写法。相当于用inner的内容来替换该位置(即其中的yield)，不会消耗一次next()调用，inner内的代码会被执行
```js
function* outer() {
    console.log('outer: pre yield');
    yield* inner();
    console.log('outer: after yield');
}
function* inner() {
    yield 'inner';
}
var gen = outer();
gen.next();
```
- yield\* inner：报错。因为inner是一个generator function，而yield*后面应该是一个iterable object
```js
function* outer() {
    console.log('outer: pre yield');
    yield* inner;
    console.log('outer: after yield');
}
function* inner() {
    yield 'inner';
}
var gen = outer();
gen.next();
```
- yield inner()：我们知道此时直接调用inner()方法得到的是一个Generator指针，但是此时我们并不是yield\*表达式，所以下面代码中，foo和bar都是 Generator 函数，在bar里面调用foo，是不会有效果的。因此可以采用上面的yield\*表达式。
```js
function* foo() {
  yield 'a';
  yield 'b';
}
function* bar() {
  yield 'x';
  foo();
  yield 'y';
}
for (let v of bar()){
  console.log(v);
}
// "x"
// "y"
```
yield的结果是一个generator指针，消耗一次outer的next()调用(即需要调用next方法来执行)，且inner内的代码不会被执行。所谓inner内的代码不会执行，你可以看看下面的例子:
```js
function* outer() {
    console.log('outer: before yield');
    yield inner();
    console.log('outer: after yield');
}

function* inner() {
    console.log('inner invoked');
}
var gen = outer();
gen.next();
//此时你会发现输出如下：
//'outer: before yield'
//{value: inner, done: false}
//即上面的两行输出yield得到的结果为一个Generator指针
```

- yield inner：yield的结果是一个generator function，消耗一次outer的next()调用(即需要调用outer的next方法从而才会执行这个yield语句)，且inner内的代码不会被执行。
```js
function* outer() {
    console.log('outer: before yield');
    yield inner;
    console.log('outer: after yield');
}

function* inner() {
    console.log('inner invoked');
}
var gen = outer();
gen.next();
```
此时输出的结果如下:

![](./static/generator.png)

### 3.不要写出下面的代码
```js
  hasChanceLottery() {
    let hasChance = false,
      error = false;
    IO.getLotteryCount({}).then(
      function(data) {
        hasChance = true;
      },
      function() {
        error = true;
      }
    );
    return {
      error: error,
      hasChance: hasChance
    };
  },
  if(hasChance()){
    //blalala
  }
```
样的代码是有大问题的，因为后面的return会*马上执行*，而此时promise还没有执行完毕，因为它是异常的。所以返回的hasChance和error永远是false

### 4.在for循环里面写promise
```js
   entryKeys.forEach((key,index)=>{
    outputFilename = self.generateOutputFilename(key);
    compilationPromise = childCompiler.compileTemplate(entry[key],compiler.context, outputFilename, compilation)
    .catch(function (err) {
      compilation.errors.push(prettyError(err, compiler.context).toString());
      return {
        content: self.options.showErrors ? prettyError(err, compiler.context).toJsonHtml() : 'ERROR',
        outputName: outputFilename
      };
    })
    .then(function (compilationResult) {
      isCompilationCached = compilationResult.hash && self.childCompilerHash === compilationResult.hash;
     .outputName;
       //注意点1:将结果放到数组中
      self.options.childCompilationOutputNames.push(self.childCompilationOutputName);
      //注意点2:将结果放到数组中
      self.options.demoContents.push(compilationResult.content);
      callback();
      return compilationResult.content;
    });
   })
```
也就是说，在for循环里面写promise一般会把结果放到数组中，然后迭代数组即可获取到每一次for循环得到的完整的内容。这是因为在`任务队列`中，先进入的异步操作往往是先执行的。你可以[查看这里](../others/nodejs-QA/browser-QA.md)


参考资料:

[Generator 函数的语法](http://es6.ruanyifeng.com/#docs/generator)

[yield 和 yield*的区别](https://segmentfault.com/a/1190000003982531)
