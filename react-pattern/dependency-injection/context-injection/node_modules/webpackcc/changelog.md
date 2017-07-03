### changelog

(1)2.0.13

  在开发环境下我们不再将css/less/sass等文件单独抽取出来，而是使用style-loader加载，因此可以原生支持HMR。但是在生产环境中，我们会单独抽取出来作为common.css

(2)2.0.14

如果你需要支持css module，那么命名css文件的时候请加上后缀为"module.css"，less,sass等文件也是一样的道理！此时在页面中你就可以直接*require*我们的文件了

(3)2.0.15支持采用--config来修改默认配置

```js
wcf --config ./webpack.config.js --devServer --dev
```

我们默认采用webpack-merge来合并配置。启动后修改test/code.md，你会发现页面会自动刷新！在wcf的根目录下添加了webpack.config.js，你会发现此时我们可以处理markdown文件了。(注意：如果你没有添加该webpack.config.js那么运行的时候会报错)

(4)2.0.18对配置的多个loader/plugin进行去重，防止用户配置了多余的loader/plugin（根据Constructor来判断）。同时对于其他的配置项进行覆盖。注意：

例如我们的devServer默认配置是:

```js
 devServer:{
      publicPath:'/',
      open :true,//默认开启浏览器
      port:8080,
      contentBase:false,
      hot:false
    }
```

如果用户配置如下:

```js
devServer:{
  port:8888
}
```

此时后面的配置会完全覆盖前面的默认配置，此时得到的配置为:
```js
 devServer:{
      publicPath:'/',
      open :true,//默认开启浏览器
      port:8080,
      contentBase:false,
      hot:false
    }
```
(5)2.0.21支持直接调用webpackcc/lib/build的build方法来获取webpack通用配置(请添加`onlyCf:true`),此时不再启动默认打包，只是获取webpack打包配置而已。如果你是在测试模式下，请传入karma:true，此时会移除commonchunkplugin[commonchunkplugin](https://github.com/webpack-contrib/karma-webpack/issues/24)，而且此时不再打包，只是获取webpack打包配置而已。

```js
const build = require('webpackcc/lib/build');
const path = require('path');
const util = require('util');
const program = {
   cwd : process.cwd(),
   dev : true,
   karma:true,
   //表示是测试模式，此时不再添加commonchunkplugin，而且不再打包，只是获取打包配置
   config : path.join(__dirname,"./cfg/test.js")
}
const webpackConfig = build(program,function(){});
```

注意：配置karma和onlyCf是两种获取通用配置的方法，而且此时不会打包。前者是获取karma打包的配置，而后者只是简单获取打包配置而已！

(6)2.0.25支持在打包之前允许用户最终修改webpack配置，其主要用途在于删除某一个插件。用法如下:
```js
//去除commonchunkplugin
const program = {
    onlyCf : true,
    cwd : process.cwd(),
    dev : true,
    //不启动压缩
    hook:function(webpackConfig){
         const commonchunkpluginIndex = webpackConfig.plugins.findIndex(plugin => {
           return plugin.constructor.name == "CommonsChunkPlugin"
         });
         webpackConfig.plugins.splice(commonchunkpluginIndex, 1);
         return webpackConfig;
    }
  };
//该hook会在打包之前执行，用于最后对webpack的配置进行修改
```

