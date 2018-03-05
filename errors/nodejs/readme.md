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
里面明显可以看到**test**规则里面是0.14.9,而我们真实的版本并不是这个，所以导致没有expose出去，因为根本就没有require这个版本的React。我们使用了`打包工具`的时候，可能需要重新设置node模块加载路径，可以采用下面的paths属性来重新设置模块加载路径:
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
