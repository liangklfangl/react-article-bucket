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

