### 说明

首先必须说明一下，该工具是基于webpack2的，所以很多配置都是需要遵守webpack2规范的。如果需要安装，直接运行下面的命令就可以了。而且，我们的入口文件都是在package.json中进行配置，当执行wcf命令会自动调用下面的三种模式中的一种完成打包。

```js
npm install -g webpackcc//必须注意，我们局部安装的优先级要高于全局安装的
```

入口文件的配置：

```js
 "entry": {
    "index": "./test/index.js"
  }
```

### 1.该工具的三种打包模式

#### 1.1 webpack-dev-server模式(Best Performance)

这种模式你只要在wcf后添加devServer参数，表明我们的文件应该使用webpack-dev-server来完成打包，此时所有的生成文件都会在内存中，而不会写入磁盘，效率比下面两种模式高，也是最推荐的一种打包模式(该模式绕过了写本地磁盘这一步，所以文件如果改变直接从内存中读取的速度要比其他方式高得多)。同时该模式会自动在output.path路径下通过html-webpack-plugin产生一个html(内存中不可见,同时需要加上--dev表明是开发模式),并自动加载我们的所有chunk.

```js
 wcf --devServer --dev
 //此时打开localhost:8080就会看到我们使用test/index.html作为template的页面，如果你需要修改template请使用下面的htmlTemplate参数
```

#### 1.2 webpack本身的watch模式(OK performance)

这种模式使用webpack自己的watch方法来完成，监听package.json中entry配置的文件的变化。你需要添加--watch --dev。如下:

```js
wcf --watch --dev
```

该模式除了会监听entry文件的变化,而且当我们自定义的webpack.config.js(通过--config传入)文件内容变化的时候会自动退出编译，要求用户重启编译过程!

#### 1.3 webpack普通模式

此时不会监听文件的变化，只是完成webpack的一次编译然后退出！

```js
wcf --dev
```


### 2.生产模式 vs 开发模式

### 2.1 开发模式

你需要通过添加`--dev`来开启开发模式。

如果模块本身是支持HMR的，那么我们就会采用不刷新的方式来更新页面，否则采用传统的livereload的方式。但是该模式会添加很多非用户指定的代码，如实现HMR的功能的客户端代码，所以不建议在生产模式使用。而且此时生成的css是内联的，是为了实现HMR的(style-loader完美支持HMR)!

### 2.2 生产模式

此时你不需要指定`--dev`参数，去掉即可。该模式除了下面说的Plugin和开发环境不同以外，而且不再具有HMR的功能。所以打包生产的bundle较小！而且当你每次修改文件的时候需要手动刷新页面。此时会单独生成一个css文件(集成ExtractTextPlugin),而不是在开发模式模式下将css全部内联到html中!


### 2.该工具的配置参数

注意，该工具的所有的配置都是基于webpack的，各个参数的意义和webpack是一致的。

#### 2.1 cli参数

--version

表示我们的版本号

-w/--watch

表示是否启动webpack的watch模式，参数值可以是一个数字，默认是200ms。

-h/--hash

表示文件名是否应该包含hash值，注意这里如果传入这个参数那么文件名都会包含chunkhash而不是hash。

--dll <dllWebpackConfigFile>

此时你需要输入一个webpack.dll.js,通过这个文件我们产生一个json文件用于DllReferencePlugin

-m/--manifest <manifest.json>

此时你需要传入一个json文件给DllReferencePlugin，此时我们会自动添加DllReferencePlugin。需要了解上面两个选项可以阅读[webpackDll](https://github.com/liangklfangl/webpackDll)

--publicPath <publicPath>

表示我们webpack的publicPath参数

--devtool <devtool>

用于指定sourceMap格式，默认是"cheap-source-map"

--stj <filename>

是否在output.path路径下产生stats.json文件，该文件可以[参见这里](https://github.com/liangklfangl/commonchunkplugin-source-code)用于分析本次打包过程

--dev

是否是开发模式，如果是我们会添加很多开发模式下才会用到的Plugin

--devServer

因为该工具集成了webpack-dev-server的打包模式，可以使用这个参数开启上面所说的webpack-dev-server模式。

--config <customConfigFile>

让使用者自己指定配置文件，配置文件内容会通过[webpack-merge](https://github.com/survivejs/webpack-merge)进行合并。

#### 2.2 webpack默认参数

<cod>entry:</cod>

我们通过在package.json中配置entry字段来表示入口文件，比如：

```json
 "entry": {
    "index": "./test/index.js"
  }
```

这样就表示我们会将test目录下的index.js作为入口文件来打包，你也可以配置多个入口文件，其都会打包到output.path对应的目录下。当然，你也可以通过上面shell配置的config文件来更新或者覆盖入口文件。覆盖模式采用的就是上面说的webpack-merge。


<code>output.path:</code>

我们默认的打包输出路径是process.cwd()/dest，你可以通过我们的--config参数来覆盖。


<code>loaders:</code>

使用url-loader来加载png|jpg|jpeg|gif图片，小于10kb的文件将使用DataUrl方式内联：

```js
{
  test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
  use: {
     loader:require.resolve('url-loader'),
     //If the file is greater than the limit (in bytes) the file-loader is used and all query parameters are passed to it.
     //smaller than 10kb will use dataURL
     options:{
      limit : 10000
     }
  }
 }
```

json文件采用json-loader加载:

```js
{ 
   test: /\.json$/, 
   loader:require.resolve('json-loader')
}
```

html文件采用html-loader来加载：

```js
{ 
    test: /\.html?$/, 
    use:{
      loader: require.resolve('html-loader'),
      options:{
      }
    }
  }
```

sass文件采用如下三个loader顺次加载：

```js
{
    test: /\.scss$/,
    loaders: ["style-loader", "css-loader", "sass-loader"]
}
```

当然，你可以通过[getWebpackDefaultConfig.js](https://github.com/liangklfangl/wcf/blob/master/src/getWebpackDefaultConfig.js)来查看更多的loader信息。其中内置了很多的功能，包括css module,压缩css,集成autoPrefixer,precss，直接import我们的css文件等等。

注意：上面任何内置的参数都是可以通过config(shell配置)文件来替换的！


### 3.内置plugins

为了保证开发环境的效率，在使用wcf的时候建议传入--dev表明是在开发环境中，这时候wcf会安装一些仅仅在开发环境使用的包。

开发环境独有的plugin：

```js
HotModuleReplacementPlugin
//支持HMR
HtmlWebpackPlugin
//在output目录下产生一个index.html(生产环境下也会添加该plugin，只是不再支持HMR，并要求用户手动刷新页面)
```

生产环境独有的plugin：

```js
UglifyJsPlugin//压缩JS
ImageminPlugin //压缩图片
ExtractTextPlugin//单独将css抽取出来，并要求用户手动刷新页面
```

共有的包：

```js
CommonsChunkPlugin
//抽取公共的模块到common.js中
MinChunkSizePlugin
//减少chunk个数
LoaderOptionsPlugin
//兼容性要求
StatsPlugin
//shell参数传入--stj
DllPluginDync
//shell传入manifest
```


### 4.HMR功能的说明

在webpack-dev-server模式下，我们提供了HMR的功能，你不需要添加任何参数，默认开启。如果你需要体验该功能，只要在入口文件中加上下面的这句代码：(你也可以查看该项目对应的该[git仓库](https://github.com/liangklfangl/wcf)，其test目录是完全支持HMR功能的，你修改任何test目录下的代码都会重新加载)：

```js
if (module.hot) {
    module.hot.accept();
  }
```

关于HMR的相关内容你可以参考[这篇文章](https://github.com/liangklfangl/webpack-hmr)。注意，我们的devServer是如下的配置:

```js
  devServer: {
      publicPath: '/',
      open: true,
      port: 8080,
      contentBase: false,
      hot: true//强制开启HMR的
    }
```

此时你运行wcf --dev --devServer就会发现会自动打开页面，如果你不需要该功能可以通过自定义配置文件来覆盖open参数！


### 5.说明

(1)我们的webpack入口文件必须在package.json或者自定义的webpack配置文件中至少一处配置(多处配置会合并)，如果两个地方都没有配置那么就会报错！

(2)我们的ExtractTextPlugin采用的是contentHash,而不是chunkHash,原因可以阅读[Webpack中hash与chunkhash的区别，以及js与css的hash指纹解耦方案](http://www.cnblogs.com/ihardcoder/p/5623411.html)

### 6.新功能的添加
新功能的添加不再修改readme文件，其功能都会在[changelog](./changelog.md)中说明。请查看该文件

### 7.可能出现的问题

(1)如果执行下面的命令不会自动打开浏览器，同时访问localhost:8080也无法访问

```js
wcf --devServer
```

这时候请加上--dev，因为其会访问html内置的模板,其默认的目录在test目录下，因为这个例子是内置的HMR的例子，如果你不需要查看这个例子，请使用shell参数htmlTemplate参数来指定模板路径(依然需要添加--dev参数，因为html-webpack-plugin是开发插件)

(2)如果端口报错

```js
 new RangeError('"port" argument must be >= 0 and < 65536');//设置的端口必须是数值类型
```

(3)必须安装webpack作为依赖，可以是全局安装也可以是局部安装

```js
npm install webpack -g//或者npm install webpack --save -dev
```

(4)无法打开URL

此时请确保你的参数有--dev，因为如果没有这个参数那么我们不会添加HMR的插件，同时也不会添加HtmlWebpackPlugin,所以不会自动打开页面。

### 8.与atool-build的区别

(1)wcf集成了三种打包模式

上面已经说过了，我们的wcf集成了三种打包模式，而且功能是逐渐增强的。*webpack模式*只是打包一次，然后退出，和webpack自己的打包方式是一样的。*webpack watch模式*会自动监听文件是否发生变化，然后重新打包。*webpack-dev-server模式*天然支持了HMR，支持无刷新更新数据。具体你可以[阅读文档](https://github.com/liangklfangl/wcf)

(2)很好的扩展性

atool-build提供一个mergeCustomConfig函数来合并用户自定义的配置与默认的配置，并将用户配置作为参数传入函数进行修改，但是当要修改的配置项很多的时候就比较麻烦。wcf自己也集成了很多loader对文件进行处理，但是很容易进行拓展，只要你配置自己的扩展文件就可以了，内部操作都会自动完成。你可以通过两种方式来配置：

cli模式：
```js
wcf --dev --devServer --config "Your custom webpack config file path"
//此时会自动合并用户自定义的配置与默认配置，通过webpack-merge完成，而不用逐项修改
```

Nodejs模式：
```js
const build = require("webpackcc/lib/build");
const program = {
    onlyCf : true,
    //不启动打包，只是获取最终配置信息
    cwd : process.cwd(),
    dev : true,
    //开发模式，不启动如UglifyJs等
    config :"Your custom webpack config file path"
  };
const finalConfig = build(program);
//得到最终的配置，想干嘛干嘛
```
通过nodejs模式，你可以获取webpack配置项用于其他地方。

下面给出一个完整的例子(假如下面给出的是我们*自定义的配置文件*)：
```js
module.exports = {
  entry:{
      'main': [
        'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
        "bootstrap-webpack!./src/theme/bootstrap.config.js",
        './src/client.js'
      ]
  },
   output: {
      path: assetsPath,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: 'http://' + host + ':' + port + '/dist/'
    },
  plugins:[
    new webpack.DefinePlugin({
        __CLIENT__: true,
        __SERVER__: false,
        __DEVELOPMENT__: true,
        __DEVTOOLS__: true 
         // <-------- DISABLE redux-devtools HERE
      }),
     new webpack.IgnorePlugin(/webpack-stats\.json$/),
     webpackIsomorphicToolsPlugin.development()
  ],
   module:{
      rules:[
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
        {
           test: webpackIsomorphicToolsPlugin.regular_expression('images'), 
           use: {
             loader: require.resolve("url-loader"),
             options:{}
           }
         },
           {
            test: /\.jsx$/,
            exclude :path.resolve("node_modules"),
            use: [{
              loader:require.resolve('babel-loader'),
              options:updateCombinedBabelConfig()
            }]
          },
            {
            test: /\.js$/,
            exclude :path.resolve("node_modules"),
            use: [{
              loader:require.resolve('babel-loader'),
              options:updateCombinedBabelConfig()
            }]
          }]
   }
}
```
注意：我们的wcf没有内置的entry，所以你这里配置的entry将会作为合并后的最终webpack配置的entry项。对于output来说，用户自定义的配置将会覆盖默认的配置(其他的也一样，除了module,plugins等)。对于plugin来说，我们会进行合并，此时不仅包含用户自定义的plugin，同时也包含内置的plugin。对于loader来说，如果有两个相同的loader,那么用户自定义的loader也会原样覆盖默认的loader。这样就很容易进行扩展。只要用户*配置一个自定义配置文件的路径即可*！

(3)dedupe

atool-build并没有对我们的plugin和loader进行去重，这样可能导致同一个plugin被添加了两次，这就要求用户必须了解内置那些plugin，从而不去添加它。同时也会导致某一个js文件的loader也添加了两次，得到如下的内容:
```js
 [ { test: { /\.jsx$/ [lastIndex]: 0 },
    exclude:
     { [Function: exclude]
       [length]: 1,
       [name]: 'exclude',
       [arguments]: null,
       [caller]: null,
       [prototype]: exclude { [constructor]: [Circular] } },
    use: [ { loader: 'babel-loader', options: {} }, [length]: 1 ] },
  { test: { /\.jsx$/ [lastIndex]: 0 },
  //对于jsx的loader又添加了一次
    exclude:
     { [Function: exclude]
       [length]: 1,
       [name]: 'exclude',
       [arguments]: null,
       [caller]: null,
       [prototype]: exclude { [constructor]: [Circular] } },
    use: [ { loader: 'after', options: {} }, [length]: 1 ] },
  [length]: 2 ]
```

这个问题你可以查看我给webpack-merge提出的[issue](https://github.com/survivejs/webpack-merge/issues/75)。但是这些工作wcf已经做了，所以当你有两个相同的插件，或者两个相同的loader的情况下，都只会留下一个，并且用户自定义的优先级要高于默认配置的优先级。

(4)打包前进行钩子设置

如果在打包前,或者获取到最终配置之前，你要对最终配置做一个处理，比如删除某个plugin/loader，那么我们提供了一个钩子函数：
```js
const program = {
    onlyCf : true,
    //此时不打包，只是为了获取最终配置用于nodejs
    cwd : process.cwd(),
    dev : true,
    //不启动压缩
    //下面这个hook用于去掉commonchunkplugin
    hook:function(webpackConfig){
         const commonchunkpluginIndex = webpackConfig.plugins.findIndex(plugin => {
           return plugin.constructor.name == "CommonsChunkPlugin"
         });
         webpackConfig.plugins.splice(commonchunkpluginIndex, 1);
         return webpackConfig;
    }
  };
```