#### 1.我们服务端渲染数据从何而来
##### 1.1 如何写出同构的组件
服务端生成HTML结构有时候并不完善，有时候不借助js是不行的。比如当我们的组件需要轮询服务器的数据接口，实现数据与服务器同步的时候就显得很重要。其实这个获取数据的过程可以是数据库获取，也可以是从其他的[反向代理服务器](https://github.com/liangklfangl/react-universal-bucket)来获取。对于客户端来说，我们可以通过ajax请求来完成，只要将ajax请求放到componentDidMount方法中来完成就可以。而之所以放在该方法中有两个原因，第一个是为了保证此时DOM已经挂载到页面中；另一个原因是在该方法中调用setState会导致组件重新渲染(具体你可以查看[这个文章](https://segmentfault.com/q/1010000008133309/a-1020000008135702))。而对于服务端来说，
一方面它要做的事情便是：*去数据库或者反向代理服务器拉取数据 -> 根据数据生成HTML -> 吐给客户端*。这是一个固定的过程，拉取数据和生成HTML过程是不可打乱顺序的，不存在先把内容吐给客户端，再拉取数据这样的异步过程。所以，componentDidMount在服务器渲染组件的时候，就不适用了(*因为render方法已经调用，但是componentDidMount还没有执行，所以渲染得到的是没有数据的组件。原因在于生命周期方法componentDidMount在render之后才会调用*)。

另一方面，componentDidMount这个方法，在服务端确实永远都不会执行！因此我们要采用和客户端渲染完全不一致的方法来解决渲染之前数据不存在问题。关于服务端渲染和客户端渲染的区别你可以查看[Node直出理论与实践总结](https://github.com/joeyguo/blog/issues/8)
```js
var React = require('react');
var DOM = React.DOM;
var table = DOM.table, tr = DOM.tr, td = DOM.td;
var Data = require('./data');
module.exports = React.createClass({
    statics: {
        //获取数据在实际生产环境中是个异步过程，所以我们的代码也需要是异步的
        fetchData: function (callback) {
            Data.fetch().then(function (datas) {
                callback.call(null, datas);
            });
        }
    },
    render: function () {
        return table({
                children: this.props.datas.map(function (data) {
                    return tr(null,
                        td(null, data.name),
                        td(null, data.age),
                        td(null, data.gender)
                    );
                })
            });
    },
    componentDidMount: function () {
        setInterval(function () {
            // 组件内部调用statics方法时，使用this.constructor.xxx
            // 客户端在componentDidMount中获取数据，并调用setState修改状态要求
            // 组件重新渲染
            this.constructor.fetchData(function (datas) {
                this.setProps({
                    datas: datas
                });
            });
        }, 3000);
    }
});
```
其中服务器端的处理逻辑render-server.js如下:
```js
var React = require('react');
var ReactDOMServer = require('react-dom/server');
// table类
var Table = require('./Table');
// table实例
var table = React.createFactory(Table);
module.exports = function (callback) {
    //在客户端调用Data.fetch时，是发起ajax请求，而在服务端调用Data.fetch时，
    //有可能是通过UDP协议从其他数据服务器获取数据、查询数据库等实现
    Table.fetchData(function (datas) {
        var html = ReactDOMServer.renderToString(table({datas: datas}));
        callback.call(null, html);
    });
};
```
下面是服务器的逻辑server.js:
```js
var makeTable = require('./render-server');
var http = require('http');
//注册中间件
http.createServer(function (req, res) {
    if (req.url === '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        //先访问数据库或者反代理服务器来获取到数据，并注册回调，将含有数据的html结构返回给客户端,此处只是渲染一个组件，否则需要renderProps.components.forEach来遍历所有的组件获取数据
        //http://www.toutiao.com/i6284121573897011714/
        makeTable(function (table) {
            var html = '<!doctype html>\n\
                      <html>\
                        <head>\
                            <title>react server render</title>\
                        </head>\
                        <body>' +
                            table +
                            //这里是客户端的代码，实现每隔一定事件更新数据，至于如何添加下面的script标签内容，可以参考这里https://github.com/liangklfangl/react-universal-bucket
                            '<script src="pack.js"></script>\
                        </body>\
                      </html>';
            res.end(html);
        });
    } else {
        res.statusCode = 404;
        res.end();
    }
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');
```
注意：因为我们的react服务端渲染只是一次性的，不会随着调用setState而重新reRender,所以我们需要在返回给客户端的html中加入客户端的代码，真正的每隔一定时间更新组件的逻辑是客户端通过ajax来完成的。

##### 1.2 如何避免服务端渲染后客户端再次渲染
服务端生成的data-react-checksum是干嘛使的？我们想一想，*就算服务端没有初始化HTML数据，仅仅依靠客户端的React也完全可以实现渲染我们的组件*，那服务端生成了HTML数据，会不会在客户端React执行的时候被重新渲染呢？我们服务端辛辛苦苦生成的东西，被客户端无情地覆盖了？当然不会！React在服务端渲染的时候，会为组件生成相应的校验和(在redux的情况下其实应该是一个*组件树，为整个组件树生成校验和,因为这整个组件树就是我们首页要显示的内容*)(checksum)，这样客户端React在处理同一个组件的时候，会复用服务端已生成的初始DOM，增量更新(也就是说当客户端和服务端的checksum不一致的情况下才会进行dom diff，进行增量更新)，这就是data-react-checksum的作用。可以通过下面的几句话来总结下:

<pre>
 如果data-react-checksum相同则不重新render，省略创建DOM和挂载DOM的过程，接着触发 componentDidMount 等事件来处理服务端上的未尽事宜(事件绑定等)，从而加快了交互时间；不同时，组件在客户端上被重新挂载 render。
</pre>

ReactDOMServer.renderToString 和 ReactDOMServer.renderToStaticMarkup 的区别在这个时候就很好解释了，前者会为组件生成checksum，而后者不会，后者仅仅生成HTML结构数据。所以，只有你不想在客户端-服务端同时操作同一个组件的时候，方可使用renderToStaticMarkup。注意：上面使用了statics块，该写法只在createClass中可用，你可以使用下面的写法:
```js
//组件内的写法
class Component extends React.Component {
    static propTypes = {
    ...
    }
    static someMethod(){
    }
}
```
在组件外面你可以按照如下写法：
```js
class Component extends React.Component {
   ....
}
Component.propTypes = {...}
Component.someMethod = function(){....}
```
具体你可以[查看这里](https://stackoverflow.com/questions/29433130/react-statics-with-es6-classes)。关于服务端渲染经常会出现下面的warning,大多数情况下是因为在返回 HTML 的时候没有将服务端上的数据一同返回，或者是返回的数据格式不对导致

<pre>
Warning: React attempted to reuse markup in a container but the checksum was invalid. This generally means that you are using server rendering and the markup generatted on the server was not what the client was expecting. React injected new markup to compensate which works but you have lost many of the benefits of server rendering. Insted, figure out why the markup being generated is different on the client and server
</pre>

#### 2.如何区分客户端与服务端代码
##### 2.1 添加客户端代码到服务端渲染的html字符串
通过[这个例子](https://github.com/liangklfangl/react-universal-bucket)我们知道，将webpack-isomorphic-tools这个插件添加到webpack的plugin中:
```js
module.exports = {
    entry:{
        'main': [
          'webpack-hot-middleware/client?path=http://' + host + ':' + port + '/__webpack_hmr',
        // "bootstrap-webpack!./src/theme/bootstrap.config.js",
        "bootstrap-loader",
        //确保安装bootstrap3，bootstrap4不支持less
          './src/client.js'
        ]
    },
   output: {
      path: assetsPath,
      filename: '[name]-[hash].js',
      chunkFilename: '[name]-[chunkhash].js',
      publicPath: 'http://' + host + ':' + port + '/dist/'
      //表示要访问我们客户端打包好的资源必须在前面加上的前缀，也就是虚拟路径
    },
    plugins:[
        new webpack.DefinePlugin({
          __CLIENT__: true,
          __SERVER__: false,
          __DEVELOPMENT__: true,
          __DEVTOOLS__: true //,
        }),
     webpackIsomorphicToolsPlugin.development()
     //在webpack的development模式下一定更要调用它支持asset hold reloading!
     //https://github.com/liangklfang/webpack-isomorphic-tools
    ]
}
```
此时我们client.js会被打包到相应的文件路径下，然后在我们的模版中，只要将这个打包好的script文件添加到html返回给客户端就可以了。下面是遍历我们的webpack-assets.json来获取到我们所有的产生的资源，然后添加到html模板中返回的逻辑：
```js
export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  };
  render() {
    const {assets, component, store} = this.props;
    const content = component ? renderToString(component) : '';
    //如果有组件component传递过来，那么我们直接调用renderToString
    const head = Helmet.rewind();
    return (
      <html lang="en-us">
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}
          <link rel="shortcut icon" href="/favicon.ico" />
         <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans:400,500"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/violet/0.0.1/violet.min.css"/>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          {/* styles (will be present only in production with webpack extract text plugin)
             styles属性只有在生产模式下才会存在，此时通过link来添加。便于缓存
           */}
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}
         {/*
            assets.styles如果开发模式下，那么肯定是空，那么我们直接采用内联的方式来插入即可。此时我们的css没有单独抽取出来，也就是没有ExtractTextWebpackPlugin，打包到js中从而内联进来
        */}
          {/* (will be present only in development mode) */}
          {/* outputs a <style/> tag with all bootstrap styles + App.scss + it could be CurrentPage.scss. */}
          {/* can smoothen the initial style flash (flicker) on page load in development mode. */}
          {/* ideally one could also include here the style for the current page (Home.scss, About.scss, etc) */}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
           {/*将组件renderToString后放在id为content的div内部*/}
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
          {/*将store.getState序列化后放在window.__data上，让客户端代码可以拿到*/}
          <script src={assets.javascript.main} charSet="UTF-8"/>
          {/*将我们的main.js，来自于客户端打包并放在特定文件夹下的资源放在页面中，
               这就成了客户端自己的js资源了
          */}
        </body>
      </html>
    );
  }
}
```
所以说下面的div#content中是服务端渲染后得到的html字符串，并被原样返回给客户端。这样的话，对于服务端的任务就完成了
```html
 <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
```
而我们的下面的script标签的内容就是我们的客户端代码打包后的结果:
```js
   <script src={assets.javascript.main} charSet="UTF-8"/>
```
此时客户端和服务端的逻辑都已经完成了，客户端可以继续接收用户操作而发送ajax请求更新组件状态。

##### 2.2 如何使得服务端和客户端发起请求的逻辑通用
一个好的用法在于使用[isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch)

##### 2.3 immutable数据在同构中的注意事项
首先在服务端返回的时候必须将store.getState得到的结果[序列化](https://github.com/yahoo/serialize-javascript)，而且此时如果store返回的某一个部分state是immutbale的，那么客户端要重新通过这部分state数据来创建新的immutable对象(如下面的例子中我们的recipeGrid和connect是immutable的)：
```js
  <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
```
对于客户端来说，我们必须将从服务端注入到HTML上的state数据转成 immutable对象，并将该对象作为initialState来创建store:
```js
  const data = window.__data;
  //其中data是服务端返回的store.getState的值，也就是store的当前状态
  if (data) {
     data.recipeGrid = Immutable.fromJS(data.recipeGrid);
     //这里必须设置，否则报错说:paginator.equals is not a function
      data.connect = Immutable.fromJS(data.connect);
     //可以使用https://github.com/liangklfang/redux-immutablejs
  }
  const store = finalCreateStore(reducer, data);
```

##### 2.4 服务端server不支持ES6的兼容
如果你想在服务端使用import等ES6的语法的话，你可以采用下面的方式，首先在项目的根目录下配置.babelrc文件，内容如下：
```js
{
  "presets": ["react", "es2015", "stage-0"],
  "plugins": [
    "transform-runtime",
    "add-module-exports",
    "transform-decorators-legacy",
    "transform-react-display-name"
  ]
}
```
然后配置一个单独的文件server.babel.js：
```js
const fs = require("fs");
const babelrc = fs.readFileSync("./.babelrc");
let config ;
try{
    config = JSON.parse(babelrc);
}catch(err){
    console.error("你的.babelrc文件有误，请仔细检查");
    console.error(err);
}
//你可以指定ignore配置来忽略某些文件。
//https://github.com/babel/babel/tree/master/packages/babel-register
require("babel-register")(config);
//require("babel-register")会导致以后所有的.es6,.es,.js,.jsx的文件都会被babel处理
```
最后我们添加我们的server.js，内容如下(直接node server.js，而真正的逻辑放在../src/server中)：
```js
#!/usr/bin/env node
require('../server.babel'); // babel registration (runtime transpilation for node)
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = false;  
// <----- DISABLES SERVER SIDE RENDERING FOR ERROR DEBUGGING
global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
if (__DEVELOPMENT__) {
//服务端代码热加载
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json|\.scss$)/i
    })) {
    return;
  }
}
// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');
global.webpackIsomorphicTools = new WebpackIsomorphicTools(require('../webpack/webpack-isomorphic-tools-config'))
  .development(__DEVELOPMENT__)
  .server(rootDir, function() {
  //rootDir必须和webpack的context一致，调用这个方法服务器就可以直接require任何资源了
  //这个路径用于获取webpack-assets.json文件，这个是webpack输出的
  // webpack-isomorphic-tools is all set now.
  // here goes all your web application code:
  // (it must reside in a separate *.js file 
  //  in order for the whole thing to work)
  //  此时webpack-isomorphic-tools已经注册好了，这里可以写你的web应用的代码，而且这些代码必须在一个独立的文件中
    require('../src/server');
  });
```
经过上面的babel-register的处理，此时你的../src/server.js中可以使用任意ES6的代码了。

##### 2.5 服务端代码单独使用webpack打包
如果对于服务端的代码要单独打包，那么必须进行下面的设置:
```js
target: "node"
```
你可以[参考这里](https://github.com/liangklfang/universal-react-demo)。

##### 2.6 服务端渲染之忽略css/less/scss文件
在2.4中我们使用了babel-register帮助服务端识别特殊的js语法，但对less/css文件无能为力，庆幸的是，在一般情况下，服务端渲染不需要样式文件的参与，css文件只要引入到HTML文件中即可，因此，可以通过配置项，忽略所有 css/less 文件:
```js
require("babel-register")({
  //默认情况ignore是node_modules表示node_modules下的所有文件的require不会进行处理
  //这里明确指定css/less不经过babel处理
  ignore: /(.css|.less)$/, });
```
具体内容你可以查看[babel-register文档](https://github.com/babel/babel/tree/master/packages/babel-register)。你可以传递其指定的所有的其他选项，包括plugins和presets。但是有一点要注意，就是距离我们源文件的最近一个*.babelrc*始终会起作用，同时其优先级也要比你在此配置的选项优先级高。此时我们忽略了样式文件的解析并不会导致客户端对组件再次渲染，因为我们的checksum和具体的css/less/scss文件无关，只是和组件render的结果有关。

##### 2.7 使用webpack-isomorphic-tools识别css/less/scss文件
通过 babel-register 能够使用babel解决jsx语法问题，对 css/less 只能进行忽略，但在使用了CSS Modules 的情况下，服务端必须能够解析 less文件，才能得到转换后的类名，否者服务端渲染出的HTML结构和打包生成的客户端 css 文件中，类名无法对应。其原因在于：我们在服务端使用了CSS Module的情况下必须采用如下的方式来完成类名设置:
```js
const React = require("react");
const styles = require("./index.less");
class Test extends React.Component{
 render(){
     return (
        //如果不是css module，那么可能是这种情况:className="banner"
           <div className={styles.banner}>This is banner<\/div>
        )
   }
}
```
如果服务端无法解析css/less肯定无法得到最终的class的名称(经过css module处理后的className)。从而导致客户端和服务端渲染得到的组件的checksum不一致(因为class的值不一致)。而对于2.6提到的忽略less/css文件的情况，虽然服务端没有解析该类名，但是我们的组件上已经通过class属性值指定了相同的字符串，因此checksum是完全一致的。

为了解决这个问题，需要一个额外的工具，即webpack-isomorphic-tools，帮助识别less文件。通过这个工具，我们会将服务器端组件引入的less/css/scss文件进行特别的处理，如下面是Widget组件引入的scss文件被打包成的内容并写入到webpack-assets.json中：
```js
 "./src/containers/Widgets/Widgets.scss": {
      "widgets": "widgets___3TrPB",
      "refreshBtn": "refreshBtn___18-3v",
      "idCol": "idCol___3gf_9",
      "colorCol": "colorCol___2bs_U",
      "sprocketsCol": "sprocketsCol___3nkz0",
      "ownerCol": "ownerCol___fwn86",
      "buttonCol": "buttonCol___1feoO",
      "saving": "saving___7FVQZ",
      "_style": ".widgets___3TrPB .refreshBtn___18-3v {\n  margin-left: 20px;\n}\n\n.widgets___3TrPB .idCol___3gf_9 {\n  width: 5%;\n}\n\n.widgets___3TrPB .colorCol___2bs_U {\n  width: 20%;\n}\n\n.widgets___3TrPB .sprocketsCol___3nkz0 {\n  width: 20%;\n  text-align: right;\n}\n\n.widgets___3TrPB .sprocketsCol___3nkz0 input {\n  text-align: right;\n}\n\n.widgets___3TrPB .ownerCol___fwn86 {\n  width: 30%;\n}\n\n.widgets___3TrPB .buttonCol___1feoO {\n  width: 25%;\n}\n\n.widgets___3TrPB .buttonCol___1feoO .btn {\n  margin: 0 5px;\n}\n\n.widgets___3TrPB tr.saving___7FVQZ {\n  opacity: 0.8;\n}\n\n.widgets___3TrPB tr.saving___7FVQZ .btn[disabled] {\n  opacity: 1;\n}\n"
    }
```
此时，在服务端你可以使用上面说的*styles.banner*这种方式来设置className，而不用担心使用babel-register只能忽略css/less/scss文件而无法使用css module特性，从而导致checksum不一致！具体你可以[查看这里](https://github.com/liangklfangl/react-universal-bucket)

##### 2.8 前后端路由不同的处理
单页应用一个常见的问题在于：所有的代码都会在页面初始化的时候一起加载，即使这部分的代码是不需要的，这常常会产生长时间的白屏。webpack支持将你的代码进行切分，从而分割成为不同的chunk而按需加载。当我们在特定路由的时候加载该路由需要的代码逻辑，哪些当前页面不需要的逻辑[按需加载](https://github.com/5tefan/universal-react-demo)。对于server-rendering来说，我们服务端不会采用按需加载的方式，而我们的客户端常常会使用[System.import或者require.ensure来实现按需加载](https://github.com/liangklfang/universal-react-demo)。

比如下面的例子:
```js
module.exports = {
    path: 'complex',
    getChildRoutes(partialNextState, cb) {
       //如果是服务端渲染，我们将Page1,Page2和其他所有的组件打包到一起，如果是客户端，那么我们会将Page1,Page2的逻辑单独打包到一个chunk中从而按需加载
        if (ONSERVER) {
            cb(null, [
                require('./routes/Page1'),
                require('./routes/Page2')
            ])
        } else {
            require.ensure([], (require) => {
                cb(null, [
                    require('./routes/Page1'),
                    require('./routes/Page2')
                ])
            })
        }
    },
    //IndexRoute表示默认加载的子组件，
    getIndexRoute(partialNextState, cb) {
        if (ONSERVER) {
            const { path, getComponent } = require('./routes/Page1');
            cb(null, { getComponent });
        } else {
            require.ensure([], (require) => {
                // separate out the path part, otherwise warning raised
                // 获取下一个模块的path和getComponent，因为他是采用module.export直接导出的
                // 我们直接将getComponent传递给callback函数
                const { path, getComponent } = require('./routes/Page1');
                cb(null, { getComponent });
            })
        }
    },
    getComponent(nextState, cb) {
        if (ONSERVER) {
            cb(null, require('./components/Complex.jsx'));
        } else {
            require.ensure([], (require) => {
                cb(null, require('./components/Complex.jsx'))
            })
        }
    }
}
```
这个例子的路由对应于*/complex*，如果是服务端渲染，那么我们会将Page1,Page2代码和其他的组件代码打包到一起。如果是客户端渲染，那么我们会将Page1,Page2单独打包成为一个chunk，当用户访问"/complex"的时候才会加载这个chunk。那么为什么服务端渲染要将Page1,Page2一起渲染呢？其实你要弄清楚，对于服务端渲染来说，将Page1,Page2一起渲染其实是获取到了该两个子页面的DOM返回给客户端(形成当前页面的子页面的两个Tab页面)。而客户端单独加载chunk其实只是为了让这部分DOM能够响应用户的点击,滚动等事件而已。注意：服务端渲染和我们的req.url有关，如下面的例子：
```js
 match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
      //重定向要添加pathname+search
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
      //发送500告诉客户端请求失败，同时不让缓存了
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          <\/Provider>
        );
        res.status(200);
        global.navigator = {userAgent: req.headers['user-agent']};
        res.send('<!doctype html>\n' +
          renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}\/>));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
});
```
我们的服务端根据req.url获取到[renderProps](https://github.com/liangklfangl/react-router-renderProps),从而将一个组件树渲染成为html字符串返回给客户端。所以我们服务端不会按需渲染，最终导致的结果只是多渲染了该path下的一部分DOM而已，而且这样有一个好处就是快速响应用户操作(还是要客户端进行注册事件等)而不用客户端重新render该部分DOM。而从客户端来说，我此时只需要加载该path下对应的chunk就可以了，而不是将整个应用的chunk一起加载，从而按需加载，速度更快，更加合理。

服务端match路由需要注意的问题：尽量前置重定向（写到路由的 onEnter 里）。除非*需要拉取数据进行判断*，不要在路由确定之后再重定向。因为在拿到路由配置之后就要根据相应的页面去拉数据了。这之后再重定向就比较浪费。如下面的例子：
```js
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replace('/');
      }
      cb();
    }
    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };
```
下面使用onEnter钩子函数的路由配置:
```js
    <Route onEnter={requireLogin}>
       //如果没有登录，那么下面的路由组件根本不会实例化，更不用说拉取数据了
        <Route path="chat" component={Chat}/>
        <Route path="loginSuccess" component={LoginSuccess}/>
  <\/Route>
```

##### 2.9 服务端渲染与客户端开发模式结合
在React的客户端渲染的过程中，我们其实采用下面的几句代码就结束了:
```js
const dest = document.getElementById('content');
ReactDOM.render(
  <Provider store={store} key="provider">
    {component}
  <\/Provider>,
  dest
);
```
此时我们整个组件树都被渲染到div#content的元素上去了。但是在开发模式(development)+服务端渲染的情况下，当我们访问某一个URL的时候，服务端返回了渲染好的html字符串，并插入到div#content的元素中间。此时，我们客户端拿到渲染好的数据会做一个判断，判断服务端是否在最外层的组件上添加了data-react-checksum属性，如果没有，表示服务端渲染失败了(如果成功会有该属性)，此时上面的代码逻辑会通过客户端来完成(客户端和服务端都能够渲染成最终的DOM结构，但是客户端渲染的代码逻辑没有data-react-checksum属性)，也就表示服务端渲染失败了。
```js
if (process.env.NODE_ENV !== 'production') {
  window.React = React; // enable debugger
  if (!dest || !dest.firstChild || !dest.firstChild.attributes || !dest.firstChild.attributes['data-react-checksum']) {
    //服务端渲染默认会有data-react-checksum
    console.error('Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.');
  }
}
```
具体报错含义你可以看看[这个](https://stackoverflow.com/questions/33528060/reactjs-router-match-callback-parameters-are-always-undefined)

##### 2.10 React代码同构
下面我们说说我们为什么要同构？要回答这个问题，首先要问什么是同构。所谓同构，顾名思义就是同一套代码，既可以运行在客户端（浏览器），又可以运行在服务器端（node）。我们知道，在前端的开发过程中，我们一般都会有一个index.html, 在这个文件中写入页面的基本内容（静态内容），然后引入JavaScript脚本根据用户的操作更改页面的内容（数据）。在性能优化方面，通常我们所说的种种优化措施也都是在这个基础之上进行的。在这个模式下，前端所有的工作似乎都被限制在了这一亩三分地之上。

那么同构给了我们什么样的不同呢？前面说到，在同构模式下，客户端的代码也可以运行在服务器上。换句话说，我们在服务器端就可以将不同的数据组装成页面返回给客户端（浏览器）。这给页面的性能，尤其是首屏性能带来了巨大的提升可能。另外，在SEO等方面，同构也提供了极大的便利。除此以外，在整个开发过程中，同构会极大的降低前后端的沟通成本，后端更加专注于业务模型，前端也可以专注于页面开发，中间的数据转换大可以交给node这一层来实现，省去了很多来回沟通的成本。

因此，从我自己的理解来说，同构的好处是:同样是一个组件，该组件既可以在客户端渲染成为DOM结构，插入到我们自己的index.html中，完成页面的展示。同时，该组件也能够首先在服务端组合成为我们的DOM结构，然后将整个DOM结构返回给客户端，客户端针对服务端返回的这部分DOM进行自己的操作，如绑定事件等，同时将页面展示给客户端。而该组件不用针对客户端或者服务端两种情况写出两套代码。当然，这需要做一定的适配，而适配的内容已经在1.1和1.2中做了重点讲解，此处不再赘述。对于同构中的事件绑定，你需要牢记下面的点:

<pre>
  服务端渲染，仅仅是渲染静态的页面内容而已，并不做任何的事件绑定。所有的事件绑定都是在客户端进行的。
</pre>

当然，在结合了redux的情况下，你可以参考我[这个例子](https://github.com/liangklfangl/react-universal-bucket)来看看如何进行了同构。






参考资料:

[React同构思想](http://imweb.io/topic/5636466d09e01a534b461ec3)

[React数据获取为什么一定要在componentDidMount里面调用？](https://segmentfault.com/q/1010000008133309/a-1020000008135702)

[ReactJS 生命周期、数据流与事件](http://www.codeceo.com/article/reactjs-life-circle-event.html)

[React statics with ES6 classes](https://stackoverflow.com/questions/29433130/react-statics-with-es6-classes)

[React同构直出优化总结](http://www.tuicool.com/articles/qYbEJ3v)

[腾讯新闻React同构直出优化实践](http://www.tuicool.com/articles/Y7b6zmR)

[Node直出理论与实践总结](https://github.com/joeyguo/blog/issues/8)

[React+Redux 同构应用开发](http://www.aliued.com/?p=3077)

[ReactJS 服务端同构实践「QQ音乐web团队」](http://www.toutiao.com/i6284121573897011714/)

[代码拆分 - 使用 require.ensure](http://www.css88.com/doc/webpack2/guides/code-splitting-require/)

[性能优化三部曲之三——Node直出让你的网页秒开 #6](https://github.com/lcxfs1991/blog/issues/6)

[React koa2 同构应用实践](https://www.zeroling.com/react-koa2-isomorphic-practise/?utm_source=tuicool&utm_medium=referral)

[从零开始React服务器渲染](http://www.tuicool.com/articles/ziIzMrq)

[React直出实现与原理](http://www.tuicool.com/articles/YrmYZf6)

[redux+react同构实例](https://github.com/liangklfangl/react-universal-bucket)

[React 同构开发（一）](http://www.cnblogs.com/bingooo/p/5724354.html)

[React 同构开发（二）](http://www.cnblogs.com/bingooo/p/5827535.html)
