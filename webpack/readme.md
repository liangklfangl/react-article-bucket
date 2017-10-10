#### 1.uglify.js处理ES6代码出错
SyntaxError: Unexpected token: name (xxxxxx) from Uglify plugin

或者如下报错信息:

Error: index.js from UglifyJs Unexpected token: name (source)

解决方法:打包的时候你很可能忘记将`某一个目录(utils)`下的ES6代码打包了，除非你没有采用ES6语法。否则uglify.js是不能处理ES6代码的压缩的。详见[这里](https://github.com/webpack/webpack/issues/2972)。如果你采用[wcf]()，请修改如下:

```js
 "build": "wcf  --config ./webpack.config.js",
```
修改为:
```js
 "build": "wcf  --dev --config ./webpack.config.js",
```
但是此时资源并没有被压缩。

#### 2.手动将let/const修改为var的问题
minifying index.js Name expected

解决方法:一定要使用babel对ES6的代码打包，而不是仅仅手动将里面的const,let修改为var，否则很可能出现这个问题

#### 3.react-dnd报错
Uncaught Error: Cannot have two HTML5 backends at the same time.

#### 4.开发环境下使用extract-text-webpack-plugin问题
webpack使用ExtractTextPlugin将css抽取出来作为单个文件加载到head中，这个过程是异步的，是随着js执行而完成的;所以，当组件componentDidMount触发的时候，我们的css可能没有加载完成，从而导致组件初次渲染出现计算问题。所以，一般在开发环境中，我们不要使用ExtractTextPlugin组件将css单独抽取出来以文件的方式引用，而以内联style的方式是不会存在这个问题的

#### 5.webpack动态加载字体文件.woff的异常
报错信息：url-loader找不到

解决方法如下:

你要弄清楚，对于下面的css中的资源加载也会使用url-loader的,只要你使用了webpack配置:
```js
{
  test: /\.(png|jpg|gif|woff|woff2)$/,
  loader: require.resolve('url-loader') + '?limit=8192',
  publicPath: publicPath
}
```

```css
@font-face {
  font-family: 'anticon';
  src: url('@{icon-url-customize}.eot'); /* IE9*/
  src: url('@{icon-url-customize}.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('@{icon-url-customize}.woff') format('woff'), /* chrome、firefox */
  url('@{icon-url-customize}.ttf') format('truetype'), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
  url('@{icon-url-customize}.svg#iconfont') format('svg'); /* iOS 4.1- */
}
```
所以报错说url-loader找不到的时候可以查看是否有类似的字体资源引用。解决方法：将`url-loader`的webpack配置修改为`require('url-loader')`即可。

#### 6.webpack处理css中引入的iconfont资源
首先：在webpack中配置publicPath，如`/myProject/1.0.0/`

然后:如下方式使用eot资源
```css
@font-face {
font-family: 'anticon';
src: url(/static/iconfont.57a86336.eot);
}
```
最后生成的url引用为`/myProject/1.0.0/static/confont.57a86336.eot`

#### 7.import与module.export混用存在的问题
报错信息如下:
<pre>
Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'
    at Object.<anonymous> (index.js:24)
    at Object.__webpack_require__.constructor.promise (index.js:26)
    at __webpack_require__ (bootstrap f46fb0d5b88212eed390:693)
    at fn (bootstrap f46fb0d5b88212eed390:114)
    at Object.<anonymous> (index.js:7)
    at __webpack_require__ (bootstrap f46fb0d5b88212eed390:693)
    at fn (bootstrap f46fb0d5b88212eed390:114)
    at Object.<anonymous> (index.less:21)
    at __webpack_require__ (bootstrap f46fb0d5b88212eed390:693)
    at webpackJsonpCallback (bootstrap f46fb0d5b88212eed390:25)
</pre>
不要在代码中混用module.exports与import，但是[require和export](http://www.dongcoder.com/detail-380119.html)是可以的。

#### 8.webpack-dev-server监听80端口号问题
问题：报错信息如下
<pre>
Error: listen EACCES 30.6.219.146:80
    at Object.exports._errnoException (util.js:1018:11)
</pre>
解决:请使用管理员权限
```js
sudo npm run dev
```

#### 9.webpack-dev-server报错
<pre>
Invalid Host header
</pre>

解决方法：
```js
  devServer:{
      host:'30.6.219.146',
      disableHostCheck: true,
      //设置为true即可
      publicPath:'/',
      open :false,
      https: false,
      port:80
    }
```
但是disableHostCheck这个参数只有在80端口启动http的情况下是有效的。

#### 10.在html中引入相对路径找不到的问题
解决方法:请设置[--content-base](https://github.com/liangklfangl/webpack-dev-server)即可

#### 11. $export is not a function
报错信息如下:
<pre>
  Uncaught TypeError: $export is not a function
    at Object.<anonymous> (es6.object.define-property.js:5)
    at __webpack_require__ (bootstrap 82d50e4553d9d0d3550e:689)
    at fn (bootstrap 82d50e4553d9d0d3550e:108)
    at Object.<anonymous> (define-property.js:3)
    at __webpack_require__ (bootstrap 82d50e4553d9d0d3550e:689)
    at fn (bootstrap 82d50e4553d9d0d3550e:108)
    at Object.<anonymous> (define-property.js:3)
    at __webpack_require__ (bootstrap 82d50e4553d9d0d3550e:689)
    at fn (bootstrap 82d50e4553d9d0d3550e:108)
    at Object.hasOwn (_object-dp.js:3)
</pre>

解决方法:发现我的exclude是通过如下方式指定的:
```js
 exclude :path.resolve("node_modules"),
```
修改为如下内容就可以了:
```js
 exclude: /node_modules/,
```
你也可以[点击这里查看](https://stackoverflow.com/questions/36313885/babel-6-transform-runtime-export-is-not-a-function),关于path.resolve内容[可以点击这里](https://github.com/liangklfangl/webpack-chunkfilename)

#### 12.url-loader找不到的问题
在css中通过下面的方式引入字体文件也会使用url-loader加载:
```js
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1479085947184'); /* IE9*/
  src: url('iconfont.eot?t=1479085947184#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('iconfont.woff?t=1479085947184') format('woff'), /* chrome, firefox */
  url('iconfont.ttf?t=1479085947184') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1479085947184#iconfont') format('svg'); /* iOS 4.1- */
}
```
所以，请确保你的webapck配置可以处理此种类型的字体文件，即添加特定的loader，如果还是有问题，那么请保证在loader配置中使用require.resolve:
```js
{
    test: /\.xyz$/,
    loader: require.resolve("file-loader")
}
```
详细信息可以[点击这里](https://github.com/webpack/webpack/issues/111)
