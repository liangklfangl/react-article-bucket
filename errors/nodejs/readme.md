#### 前言
这部分主要讲解脚手架打包项目时候遇到的一些问题，拿走不谢。如果喜欢可以帮忙star，如果有问题记得issue。

#### 1.发现使用了expose-loader但是没有暴露到window
后面我得到了打包前的webpack配置进行了分析:
```js
rules": [{
            "test": "/Users/qinliang.ql/Desktop/silk/node_modules/_react@0.14.9@react/react.js",
            "use": [{
                "loader": "/Users/qinliang.ql/Desktop/silk/node_modules/_expose-loader@0.7.4@expose-loader/index.js",
                "options": "React"
            }]
        },
```
发现rules里面的版本是不对的:
```js
rules.push({
    test: require.resolve(fullPath[i]),
    use: [
      {
        loader: require.resolve("expose-loader"),
        options: specifier
      }
    ]
});
```
里面明显可以看到**test**规则里面是0.14.9,而我们真实的版本并不是这个，所以导致没有expose出去，因为根本就没有require这个版本的React。使用了`打包工具`的时候，可能需要重新设置node模块加载路径，可以采用下面的paths属性来重新设置模块加载路径:
```js
const ROOT = process.cwd();
const DEFAULT_WEBPACK_MODULES_PATH = path.join(ROOT, "./node_modules");
const TEST = /^\//.test(fullPath[i])
        ? require.resolve(fullPath[i])
        : require.resolve(fullPath[i], {
            paths: [DEFAULT_WEBPACK_MODULES_PATH]
          });
```
如果需要指定webpack加载路径，可以通过resolve.modules来完成
```js
resolve: {
      modules: [DEFAULT_WEBPACK_MODULES_PATH, "node_modules"]
    },
```
后面又踩到一个坑(花了特别长的时间才解决，因为我的[silk](https://github.com/shaozj/silk)命令在本机上都是好的，但是在其他机器上就是一直报错说找不到模块)，就是上面的require.resolve的paths参数是在node\@8.9.0+版本上才引入的。低版本根本不支持，所以当你指定从特定的路径paths加载模块的时候它其实还是从当前项目下加载，所以后面找到了[resolve](https://www.npmjs.com/package/resolve)模块，可以使用它的basedir参数。
```js
rules.push({
      test: require.resolve(
        // 绝对路径也要通过require.resolve包装，否则expose-loader不会暴露到window
        resolve.sync(fullPath[i], {
          basedir: DEFAULT_WEBPACK_MODULES_PATH
        })
      ),
      use: [
        {
          loader: require.resolve("expose-loader"),
          options: specifier
        }
      ]
});
```
上面这句代码就是最终代码，但是还是遇到问题的，就是如果你的test里面不用**[require.resolve](http://gitbook.cn/gitchat/column/59f57e2549cd43306135e255/topic/59f98d9868673133615f7dd8)包装一下expose-loader还是不会被暴露出去的**，虽然通过resolve.sync获取到的已经是绝对路径，这一点一定要注意!

而出现某些模块暴露出去，而某些没有暴露出去，最后排查的原因是一个是绝对路径忽略require.resolve的第二个paths参数没有任何问题，而如果是第三方类库，那么导致它加载模块的路径不对导致的，使用basedir修正模块加载路径即可:
```js
  const specifier = id0imports.specifiers[i];
      if (/^\//.test(fullPath[i])) {
        // 非npm包，相对路径直接expose出去并输出为一个单独文件到output目录
        entry[`${specifier}`] = fullPath[i];
        outputFiles.push(specifier);
        rules.push({
          // 在低版本情况下已经是绝对路径，require.resolve即使忽略第二个参数也无所谓
          test: require.resolve(fullPath[i], {
            basedir: DEFAULT_WEBPACK_MODULES_PATH
          }),
          use: [
            {
              loader: require.resolve("expose-loader"),
              options: specifier
            }
          ]
        });
      } else {
        //  此时是npm包，expose出去不需要添加到entry中
        rules.push({
          test: require.resolve(
            resolve.sync(fullPath[i], {
              basedir: DEFAULT_WEBPACK_MODULES_PATH
            })
          ),
          use: [
            {
              loader: require.resolve("expose-loader"),
              options: specifier
            }
          ]
        });
      }
```

#### 2.npm publish出现sill字样
解决方法是将https替换为http即可:
```js
npm set registry http://registry.npmjs.org/
```

#### 3.多版本包依赖查看
今天遇到一个问题:node_modules下安装了多个版本的babel-generator,然而我的程序必须依赖于6.21.0否则会出现下面的错误：
<pre>
can not react auxiliaryCommentBefore of null
</pre>
于是需要查看多安装的那个版本6.26.1是什么原因，导致我每次require的时候都require到它，进而程序出错，运行下面的命令:
```shell
tnpm ls babel-generator
```
最后输入的信息如下:

<pre>
ilki@3.0.13-4 /Users/qinliang.ql/Desktop/silk
├─┬ webpackcc@0.0.11 -> /Users/qinliang.ql/Desktop/silk/node_modules/_@ali_webpackcc@0.0.11@@ali/webpackcc
│ ├─┬ webpackcc@0.0.9 invalid
│ │ └── babel-generator@6.26.1  extraneous
│ ├─┬ babel-core@6.26.0
│ │ └── babel-generator@6.26.1 
│ └── babel-generator@6.21.0 
└── babel-generator@6.21.0  extraneous
</pre>

最后你会发现原来是在@ali/webpackcc\@0.0.11下循环安装了webpackcc\@0.0.9，去掉即可。其实在node_modules下出现多个版本的同名包是比较常见的，比如下面的依赖层级:

<pre>
silki@3.0.13-4 /Users/qinliang.ql/Desktop/silk
├─┬ webpackcc@0.0.12 -> /Users/qinliang.ql/Desktop/silk/node_modules/_@ali_webpackcc@0.0.12@@ali/webpackcc
│ ├─┬ babel-cli@6.26.0
│ │ ├─┬ babel-core@6.26.0 -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-core@6.26.0@babel-core
│ │ │ └── babel-generator@6.26.1  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.26.1@babel-generator deduped
│ │ └─┬ babel-register@6.26.0 -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-register@6.26.0@babel-register
│ │   └─┬ babel-core@6.26.0
│ │     └── babel-generator@6.26.1  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.26.1@babel-generator deduped
│ ├─┬ babel-core@6.26.0
│ │ └── babel-generator@6.26.1  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.26.1@babel-generator
│ ├── babel-generator@6.21.0 
│ ├─┬ babel-minify-webpack-plugin@0.2.0
│ │ └─┬ babel-core@6.26.0
│ │   └── babel-generator@6.26.1  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.26.1@babel-generator deduped
│ └─┬ babili-webpack-plugin@0.1.2
│   └─┬ babel-core@6.26.0 -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-core@6.26.0@babel-core
│     └── babel-generator@6.26.1  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.26.1@babel-generator deduped
└── babel-generator@6.21.0  -> /Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator extraneous
</pre>

虽然多个包比如babel-core也引入了babel-generator，但是他们都只会require自己安装的版本的包，而不会require到我的webpackcc引入的babel-generator版本，这一点一定要注意！如果你要将自己的包限定到特定的版本可以在package.json中指定:

```js
 "dependencies": {
        "babel-generator": "6.21.0"
        // 前面少了~,^,>,<等符号
    },
```

#### 4.传入babel-generator的不是AST
报错信息如下:
<pre>
/Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:279
      throw new ReferenceError("unknown node of type " + (0, _stringify2.default)(node.type) + " with constructor " + (0, _stringify2.default)(node && node.constructor.name));
      ^

ReferenceError: unknown node of type undefined with constructor "Object"
    at Generator.print (/Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:279:13)
    at Generator.generate (/Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:85:10)
    at Generator.generate (/Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator/lib/index.js:62:40)
    at exports.default (/Users/qinliang.ql/Desktop/silk/node_modules/_babel-generator@6.21.0@babel-generator/lib/index.js:20:14)
    at async.parallel (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/build.js:201:30)
    at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:3874:9
    at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:473:16
    at iteratorCallback (/Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:1050:13)
    at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:958:16
    at /Users/qinliang.ql/Desktop/silk/node_modules/_async@2.6.0@async/dist/async.js:3871:13
    at fs.readFile (/Users/qinliang.ql/Desktop/silk/src/generator/generators/readme/utils/build.js:188:13)
    at FSReqWrap.readFileAfterClose [as oncomplete] (fs.js:511:3)
</pre>
发现我程序导出的是:
```js
return {
    inputAst
  };
```
而我直接拿着对象去处理了，而不是AST:
```js
const ast = transformHOC(results[t]);
const sourceCode = generator(ast, null, results[t]).code;
```
修改为如下代码即可:
```js
const ast = transformHOC(results[t]).inputAst;
const sourceCode = generator(ast, null, results[t]).code;
```

#### 5.react-docgen处理antd报错
报错信息如下:
<pre>
Error: No suitable component definition found.
</pre>
去掉如下代码即可:
```js
SearchForm = Form.create()(SearchForm);
```
你可以查看这个[issue](https://github.com/reactjs/react-docgen/issues/107)。
