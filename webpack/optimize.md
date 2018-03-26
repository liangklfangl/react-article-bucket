#### 1.如何按需导入文件减小bundle.js大小
下面是ladash中对外导出的对象:
```js
   lodash.isFunction = isFunction;
    lodash.isInteger = isInteger;
    lodash.isLength = isLength;
    lodash.isMap = isMap;
    lodash.isMatch = isMatch;
    lodash.isMatchWith = isMatchWith;
    lodash.isNaN = isNaN;
    lodash.isNative = isNative;
    lodash.isNil = isNil;
    lodash.isNull = isNull;
    lodash.isNumber = isNumber;
    lodash.isObject = isObject;
    lodash.isObjectLike = isObjectLike;
    lodash.isPlainObject = isPlainObject;
    lodash.isRegExp = isRegExp;
    lodash.isSafeInteger = isSafeInteger;
    lodash.isSet = isSet;
    lodash.isString = isString;
    lodash.isSymbol = isSymbol;
    lodash.isTypedArray = isTypedArray;
    lodash.isUndefined = isUndefined;
    lodash.isWeakMap = isWeakMap;
    lodash.isWeakSet = isWeakSet;
```
这是为什么我们可以通过如下方式引入方法的原因:
```js
import { concat, sortBy, map, sample } from 'lodash';
//lodash其实是一个对象
```
但是还有一种常见的方法就是只引入我们需要的函数，如下:
```js
import sortBy from 'lodash/sortBy';
import map from 'lodash/map';
import sample from 'lodash/sample';
```
之所以可以通过__相对路径__的方法引用是因为在lodash的npm包中，我们每一个方法都对应于一个独立的文件，并导出了我们的方法，如下面就是sortBy.js方法的源码:
```js
var sortBy = baseRest(function(collection, iteratees) {
  if (collection == null) {
    return [];
  }
  var length = iteratees.length;
  if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
    iteratees = [];
  } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
    iteratees = [iteratees[0]];
  }
  return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
});
module.exports = sortBy;
```
注意一点就是:通过后者来导入我们需要的文件比前者全部导入的文件要小的多。上面我已经说了原因，即后者将每一个方法都存放在一个独立的文件中，从而可以按需导入，所以文件也就比较小了。具体你可以[查看这里](https://lacke.mn/reduce-your-bundle-js-file-size/)来学习如何减少bundle.js的大小。当然，如果你使用了webpack3的tree-shaking，那么就不需要考虑这个情况了。tree-shaking会让没用的代码在打包的时候直接被剔除。

#### 2.webpack动态路由与按需加载(代码来自bisheng)
##### 2.1 React-router动态加载
```js
function processRoutes(route) {
    if (Array.isArray(route)) {
      return route.map(processRoutes);
    }
    return Object.assign({}, route, {
      onEnter: () => {
        if (typeof document !== 'undefined') {
        }
      },
      component: undefined,
      //Same as component but asynchronous, useful for code-splitting.
      //https://github.com/liangklfang/react-router/blob/master/docs/API.md#getcomponentsnextstate-callback
      //http://www.mtons.com/content/61.htm
      getComponent: templateWrapper(route.component, route.dataPath || route.path),
      indexRoute: route.indexRoute && Object.assign({}, route.indexRoute, {
        component: undefined,
        getComponent: templateWrapper(
          route.indexRoute.component,
          route.indexRoute.dataPath || route.indexRoute.path
        ),
      }),
      childRoutes: route.childRoutes && route.childRoutes.map(processRoutes),
    });
  }
  const processedRoutes = processRoutes(routes);
  //routes见下面的代码块
  processedRoutes.push({
    path: '*',
    getComponents: templateWrapper('/NotFound.jsx'),
  });
```
其中我们的routes内容如下:
```js
const contentTmpl = "./template/content/index.jsx";
//下面的内容是routes部分，即processRoutes(routes)中的routes
{
    path: "/",
    component: layoutTemp,
    indexRoute: { component: homeTmpl },
    childRoutes: [
      {
        path: "docs/react/:children",
        component: contentTmpl
        //这里配置的是一个路径
      }
    ]
  }
```
即内容格式和我们的react-router的配置完全一致。其中上面的TempalateWrapper如下:
```js
function calcPropsPath(dataPath, params) {
  return Object.keys(params).reduce(
    (path, param) => path.replace(`:${param}`, params[param]),
    dataPath
  );
}
//替换动态参数
function hasParams(dataPath) {
  return dataPath.split('/').some((snippet) => snippet.startsWith(':'));
}
function defaultCollect(nextProps, callback) {
  callback(null, nextProps);
}

function templateWrapper(template, dataPath = '') {
   const Template = require('{{ themePath }}/template' + template.replace(/^\.\/template/, ''));
   //一定记住学习这里:https://github.com/liangklfang/react-router/blob/master/docs/API.md#getcomponentsnextstate-callback，这里是异步的api，其中getComponet得到的必须是一个callback，签名是(nextState, cb) => {}
    return (nextState, callback) => {
      const propsPath = calcPropsPath(dataPath, nextState.params);
      //replace dynamic parameter of url, such as `path: 'docs/pattern/:children'`
      const pageData = exist.get(data.markdown, propsPath.replace(/^\//, '').replace(/\/$/,"").split('/'));
      //注入数据,这里如果
      const collect = Template.collect || defaultCollect;
      //如果某一个组件有collect，那么在组件实例化之前我们可以保证collect方法被调用
      collect(Object.assign({}, nextState, {
        data: data.markdown,
        picked: data.picked,
        pageData,
        //page data is for special html page based on url
        utils,
      }), (err, nextProps) => {
        const Comp = (hasParams(dataPath) || pageData) && err !== 404 ?
        Template.default || Template : NotFound.default || NotFound;
        //E6组件我们要调用.default
        const dynamicPropsKey = nextState.location.pathname;
        Comp[dynamicPropsKey] = nextProps;
        //将组件需要的数据封装到组件的dynamicPropsKey上，在createElement的时候从组件的
        //这个属性上获取
        callback(err === 404 ? null : err, Comp);
        //https://react-guide.github.io/react-router-cn/docs/guides/advanced/DynamicRouting.html
        //callback of react-router natively
      });
    };
  }
```
通过上面这种getComponet的方法，我们可以保证我们的组件在被实例化之前一定会调用某一个函数。因为getComponent本身就是为了异步设计的。
```js
   <ReactRouter.Router
        history={ReactRouter.useRouterHistory(history.createHistory)({ basename })}
        routes={routes}
        //routes就是上面添加的routes集合
        createElement={createElement}
      \/>;
 module.exports = function createElement(Component, props) {
  const dynamicPropsKey = props.location.pathname;
  //从props.location.pathname获取我们自己封装的数据，并传入到组件中，同时将react-router本身的属性也放在组件中传入
  return <Component {...props} {...Component[dynamicPropsKey]} />;
};
```
其中ReactRouter.Router的createElement允许配置一个函数，用于在实例化这个组件的时候调用。第一个参数表示组件本身，而第二个参数表示React-Router传入的参数,不知道的可以参考[React-router相关](../react-router/renderProps.md)

```js
function lazyLoadWrapper(filePath, filename, isSSR) {
  // filePath===== /Users/qinliang.ql/Desktop/std-website/docs/spec/repetition.md
  // filename===== docs/spec/repetition.md
  return 'function () {\n' +
    '  return new Promise(function (resolve) {\n' +
    (isSSR ? '' : '    require.ensure([], function (require) {\n') +
    `      resolve(require('${filePath}'));\n` +
    (isSSR ? '' : `    }, '${filename}');\n`) +
    '  });\n' +
    '}';
}
```
这样在

##### 2.2 require.ensure加载
  require.ensure在需要的时候才下载依赖的模块，当参数指定的模块都下载下来了（下载下来的模块还没执行），便执行参数指定的回调函数。require.ensure会创建一个chunk，且可以指定该chunk的名称，如果这个chunk名已经存在了，则将本次依赖的模块合并到已经存在的chunk中，最后这个chunk在webpack构建的时候会单独生成一个文件。
<pre>
  require.ensure(dependencies: String[], callback: function([require]), [chunkName: String])
  dependencies: 依赖的模块数组
  callback: 回调函数，该函数调用时会传一个require参数
  chunkName: 模块名，用于构建时生成文件时命名使用
</pre>

注意点：requi.ensure的模块只会被下载下来，不会被执行，只有在回调函数使用require(模块名)后，这个模块才会被执行。详细[查看这里](http://blog.csdn.net/zhbhun/article/details/46826129)

#### 3.webpack引入tree-shaking功能
##### 3.1 webpack如何使用tree-shaking
为了让webpack2支持tree-shaking功能，我们需要对[wcf的babel配置进行修改](https://github.com/liangklfangl/wcf/blob/master/src/getBabelDefaultConfig.js)，其中修改最重要的一点就是去掉babel-preset-es2015，而采用plugin处理。在plugin中处理的时候还需要去掉下面的插件:
```js
require.resolve("babel-plugin-transform-es2015-modules-amd"),
//转化为amd格式，define类型
require.resolve("babel-plugin-transform-es2015-modules-commonjs"),
//转化为commonjs规范，得到:exports.default = 42,export.name="罄天"
require.resolve("babel-plugin-transform-es2015-modules-umd"),
//umd规范
```
采用babel-plugin-transform-es2015-modules-commonjs以后，我们的代码:
```js
//imported.js
export function foo() {
    return 'foo';
}
export function bar() {
    return 'bar';
}
//下面是index.js
import {foo} from './imported';
let elem = document.getElementById('output');
elem.innerHTML = `Output: ${foo()}`;
```
会被webpack转化为如下的形式:
```js
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.foo = foo;
exports.bar = bar;
//都转化为commonjs规范了
function foo() {
    return 'foo';
}
function bar() {
    return 'bar';
}
/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var _imported = __webpack_require__(0);

var elem = document.getElementById('output');
elem.innerHTML = 'Output: ' + (0, _imported.foo)();
/***/ })
/******/ ]);
```
所以，我们没有用到的bar方法也被引入了。而如果引入babel-plugin-transform-es2015-modules-amd，我们的打包代码就会得到如下的内容:
```js
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {
var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_RESULT__ = function (exports) {
    'use strict';
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.foo = foo;
    exports.bar = bar;
    //我们的没有用到的bar方法也被导出了
    function foo() {
        return 'foo';
    }
    function bar() {
        return 'bar';
    }
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(0)], __WEBPACK_AMD_DEFINE_RESULT__ = function (_imported) {
  'use strict';

  var elem = document.getElementById('output');
  elem.innerHTML = 'Output: ' + (0, _imported.foo)();
}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
        __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
/***/ })
/******/ ]);
```
而如果引入babel-plugin-transform-es2015-modules-umd也会面临同样的问题，所以我们应该去掉上面三个插件，即不再使用`amd/cmd/umd`规范打包，而使用我们的ES6原生模块打包策略。让ES6模块不受 Babel 预设（preset）的影响。Webpack 认识 ES6 模块，只有当保留 ES6 模块语法时才能够应用 tree-shaking。如果将其转换为 CommonJS 语法，Webpack 不知道哪些代码是使用过的，哪些不是（就不能应用tree-shaking了）。最后，Webpack将把它们转换为 CommonJS语法。最终得到的babel默认配置就是如下的内容:
```js
function getDefaultBabelConfig() {
  return {
    cacheDirectory: tmpdir(),
    //We must set!
    presets: [
      require.resolve('babel-preset-react'),
      // require.resolve('babel-preset-es2015'),
      //(1)这个必须去掉
      require.resolve('babel-preset-stage-0'),
    ],
    plugins: [
      require.resolve("babel-plugin-transform-es2015-template-literals"),
      require.resolve("babel-plugin-transform-es2015-literals"),
      require.resolve("babel-plugin-transform-es2015-function-name"),
      require.resolve("babel-plugin-transform-es2015-arrow-functions"),
      require.resolve("babel-plugin-transform-es2015-block-scoped-functions"),
      require.resolve("babel-plugin-transform-es2015-classes"),
      //这里会转化class
      require.resolve("babel-plugin-transform-es2015-object-super"),
      require.resolve("babel-plugin-transform-es2015-shorthand-properties"),
      require.resolve("babel-plugin-transform-es2015-computed-properties"),
      require.resolve("babel-plugin-transform-es2015-for-of"),
      require.resolve("babel-plugin-transform-es2015-sticky-regex"),
      require.resolve("babel-plugin-transform-es2015-unicode-regex"),
      require.resolve("babel-plugin-syntax-object-rest-spread"),
      require.resolve("babel-plugin-transform-es2015-parameters"),
      require.resolve("babel-plugin-transform-es2015-destructuring"),
      require.resolve("babel-plugin-transform-es2015-block-scoping"),
      require.resolve("babel-plugin-transform-es2015-typeof-symbol"),
      [
        require.resolve("babel-plugin-transform-regenerator"),
        { async: false, asyncGenerators: false }
      ],
      // require.resolve("babel-plugin-add-module-exports"),
      // 交给webpack2处理，可以删除
      require.resolve("babel-plugin-check-es2015-constants"),
      require.resolve("babel-plugin-syntax-async-functions"),
      require.resolve("babel-plugin-syntax-async-generators"),
      require.resolve("babel-plugin-syntax-class-constructor-call"),
      require.resolve("babel-plugin-syntax-class-properties"),
      require.resolve("babel-plugin-syntax-decorators"),
      require.resolve("babel-plugin-syntax-do-expressions"),
      require.resolve("babel-plugin-syntax-dynamic-import"),
      require.resolve("babel-plugin-syntax-exponentiation-operator"),
      require.resolve("babel-plugin-syntax-export-extensions"),
      require.resolve("babel-plugin-syntax-flow"),
      require.resolve("babel-plugin-syntax-function-bind"),
      require.resolve("babel-plugin-syntax-jsx"),
      require.resolve("babel-plugin-syntax-trailing-function-commas"),
      require.resolve("babel-plugin-transform-async-generator-functions"),
      require.resolve("babel-plugin-transform-async-to-generator"),
      require.resolve("babel-plugin-transform-class-constructor-call"),
      require.resolve("babel-plugin-transform-class-properties"),
      require.resolve("babel-plugin-transform-decorators"),
      require.resolve("babel-plugin-transform-decorators-legacy"),
      require.resolve("babel-plugin-transform-do-expressions"),
      require.resolve("babel-plugin-transform-es2015-duplicate-keys"),
      require.resolve("babel-plugin-transform-es2015-spread"),
      require.resolve("babel-plugin-transform-exponentiation-operator"),
      require.resolve("babel-plugin-transform-export-extensions"),
      // require.resolve("babel-plugin-transform-es2015-modules-amd"),
      // require.resolve("babel-plugin-transform-es2015-modules-commonjs"),
      // require.resolve("babel-plugin-transform-es2015-modules-umd"),
      // (2)去掉这个
      require.resolve("babel-plugin-transform-flow-strip-types"),
      require.resolve("babel-plugin-transform-function-bind"),
      require.resolve("babel-plugin-transform-object-assign"),
      require.resolve("babel-plugin-transform-object-rest-spread"),
      require.resolve("babel-plugin-transform-proto-to-assign"),
      require.resolve("babel-plugin-transform-react-display-name"),
      require.resolve("babel-plugin-transform-react-jsx"),
      require.resolve("babel-plugin-transform-react-jsx-source"),
      require.resolve("babel-plugin-transform-runtime"),
      require.resolve("babel-plugin-transform-strict-mode"),
    ]
  };
}
```
具体文件内容你可以点击[wcf](https://github.com/liangklfangl/wcf/blob/master/src/getBabelDefaultConfig.js)打包babel配置。当然你可以使用下面方式告诉babel预设不转换模块：
```js
{
  "presets": [
    ["env", {
      "loose": true,
      "modules": false
    }]
  ]
}
```
这种方式要简单的多。但是，正如[如何在 Webpack 2 中使用 tree-shaking](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651226843&idx=1&sn=8ce859bb0ccaa2351c5f8231cc016052&chksm=bd495b5f8a3ed249bb2d967e27f5e0ac20b42f42698fdfd0d671012782ce0074a21129e5f224&mpshare=1&scene=1&srcid=08241S5UYwTpLwk1N2s51tXG&key=adf9313632dd72f547280f783810492f9adb79ab0d4163835d8f16b9ef1ba0b666c3253ebf73fcbd10842f39091c3775a8bcb7ebf2f1613b0baadc517bd3a3f871c02aa3495fa42b3e960fd7f99357e0&ascene=0&uin=MTkwNTY4NjMxOQ%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.12+build(16A323)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=Kwkar2P9YwiWaPYmrcaqYmEqAigrP8I305SDCp6p05cCbna5znl6Uz%2FMx75BskRL)文章本身所说，这种方式会存在副作用，即无法移除多余的类声明。在使用ES6语法定义类时，类的成员函数会被添加到属性prototype，没有什么方法能完全避免这次赋值，所以webpack会`认为我们添加到prototype上方法的操作也是对类的一种使用，导致无法移除多余的类声明`,编译过程阻止了对类进行tree-shaking,它仅对函数起作用。UglifyJS 不能够分辨它仅仅是类声明，还是其它有副作用的操作 -- UglifyJS 不能做控制流分析。

##### 3.2 webpack的tree-shaking标记 vs rollup标记区别
<pre>
移除未使用代码（Dead code elimination） vs 包含已使用代码（live code inclusion）
</pre>
Webpack 仅仅标记未使用的代码（而__不移除__），并且不将其导出到模块外。它拉取所有用到的代码，将剩余的（未使用的）代码留给像 UglifyJS 这类压缩代码的工具来移除。UglifyJS 读取打包结果，在压缩之前移除未使用的代码。而 Rollup 不同，它（的打包结果）只包含运行应用程序所__必需__的代码。打包完成后的输出并没有未使用的类和函数，压缩仅涉及实际使用的代码。

##### 3.3 基于babel-minify-webpack-plugin(即babili-webpack-plugin)移除多余的类声明
[babel-minify-webpack-plugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin)能将ES6代码编译为ES5，移除未使用的类和函数，这就像UglifyJS 已经支持ES6一样。babel-minify会在编译前`删除未使用的代码`。在编译为 ES5 之前，很容易找到未使用的类，因此tree-shaking也可以用于类声明，而不再仅仅是函数。如果你去看babili-webpack-plugin的代码，你会看到下面两句:
```js
import { transform } from 'babel-core';
import babelPresetMinify from 'babel-preset-minify';
```
首先是就是[babel-preset-minify](https://github.com/babel/minify/blob/master/packages/babel-preset-minify/src/index.js),你可以看到他内部会调用如babel-plugin-minify-dead-code-elimination,babel-plugin-minify-type-constructors等来判断哪些代码没有被引用，进而可以在代码没有被编译为ES5之前把它移除掉或者压缩。而babel-core就是负责把处理后的ES6代码继续编译为ES5代码。

所以，我们只需用babel-minify-webpack-plugin替换UglifyJS，然后删除babel-loader(该plugin自己会处理ES6代码，但是jsx处理需要自己添加preset) 即可。另一种方式是将[babel-preset-minify](https://github.com/babel/minify/tree/master/packages/babel-preset-minify)作为Babel的预设，仅使用 babel-loader（移除 UglifyJS插件,因为babel-preset-minify已经压缩完成）。推荐使用第一种（插件的方式），因为当编译器不是 Babel（比如 Typescript）时，它也能生效。
```js
module: {
  rules: []
},
plugins: [
  new BabiliPlugin()
  //替代uglifyjs，它可以移除es6的多余类声明
]
```
我们需要将 ES6+ 代码传给babel-minify，否则它不会移除（未使用的）类。所以，这种方式就要求所有的第三方包都必须有es6的代码发布，否则无法移除。

##### 3.4 目前wcf没有引入babili-webpack-plugin
这种情况下我们依然会对类的代码打包成为ES5，然后交给我们的uglifyjs处理,比如下面的例子：
```js
//imported.js
export function foo() {
    return 'foo';
}
export function bar() {
    return 'bar';
}
export function ql(){
  return 'ql'
}
export class Test{
 toString(){
   return 'test';
 }
}
export class Test1{
 toString(){
   return 'test1';
 }
}
//index.js
import {foo} from './imported';
let elem = document.getElementById('app');
elem.innerHTML = `Output: ${foo()}`;
```
打包后的结果如下:
```js
/***/ (function(module, __webpack_exports__, __webpack_require__) {
"use strict";
/* harmony export (immutable) */ 
__webpack_exports__["a"] = foo;
/* unused harmony export bar */
/* unused harmony export ql */
/* unused harmony export Test */
/* unused harmony export Test1 */
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass__);
function foo() {
  return 'foo';
}
function bar() {
  return 'bar';
}
function ql() {
  return 'ql';
}
var Test = function () {
  function Test() {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Test);
  }
  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Test, [{
    key: 'toString',
    value: function toString() {
      return 'test';
    }
  }]);

  return Test;
}();
var Test1 = function () {
  function Test1() {
    __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_classCallCheck___default()(this, Test1);
  }

  __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_createClass___default()(Test1, [{
    key: 'toString',
    value: function toString() {
      return 'test1';
    }
  }]);
  return Test1;
}();
})
```
此时通过查看`harmony export`部分，我们知道webpack导出的仅仅是我们用到的foo模块而已，而其他的不管是多余的函数声明还是多余的类声明都是被标记为无用代码(`'unused'`)。我以为，通过这种方式打包，经过uglifyjs处理就会将类Test1,Test2的代码移除，其实事实并不是这样，经过uglifyjs处理后多余的函数是没有了，但是多余的类声明打包成的函数代码依然存在!依然存在!依然存在!

终极解决方法:[使用babel-minify-webpack-plugin](https://github.com/webpack-contrib/babel-minify-webpack-plugin),即babili-webpack-plugin。完整实例代码可以[参考这里](https://github.com/blacksonic/babel-webpack-tree-shaking),而目前[wcf](https://github.com/liangklfangl/wcf)没有采用这种策略，所以多余的class是无法去除的。目前，我觉得这种策略是可以接受的，因为我们第三方发布的包很少是使用class发布的，而都是编译为ES5代码后发布的，所以通过uglifyjs这种策略已经足够了。

当然，你也可以使用[babel-preset-minify](https://github.com/babel/minify/tree/master/packages/babel-preset-minify)来将代码压缩作为你的预设，我觉的这种方式在独立封装自己的打包工具的时候比较有用，他是所有babel代码压缩插件的集合。

##### 3.5 tree-shaking的局限性
这一部分都是自己的理解，但是是基于这样一个事实：
```js
import {sortBy} from "lodash";
```
我通过import引入sortBy方法以后，以为仅仅是引入了该方法而已，但是实际上把concat等函数都引入了。因为import是基于ES6的静态语法分析，而我们的lodash第三方包导出的时候并不是基于ES6的import/export机制，代码如下：
```js
 var _ = runInContext();
  if (typeof define == 'function' && typeof define.amd == 'object' && define.amd) {
    root._ = _;
    define(function() {
      return _;
    });
  }
  else if (freeModule) {
    // Export for Node.js.
    (freeModule.exports = _)._ = _;
    // Export for CommonJS support.
    freeExports._ = _;
  }
  else {
    // Export to the global object.
    root._ = _;
  }
}.call(this));
```
所以，实际上tree-shaking是无法完成的!所以，上面说的babel-minify-webpack-plugin其实在这里根本不能起作用，因为他的第一步就是去掉ES6中没有用到的代码然后打包成为ES5，但是这里的代码压根就不是ES6，所以它也就没有魔力了。对第三方包来说也是，应当使用ES6 模块规范。幸运的是，越来越多的包作者同时发布CommonJS和ES6模块规范两种格式(**比如antd也已经支持了**)。ES6模块的入口由 package.json的字段[module指定](http://loveky.github.io/2018/02/26/tree-shaking-and-pkg.module/)。其最后生成的package.json结构是如下的形式:
```js
{
  "main": "dist/dist.js",
  "module": "dist/dist.es.js"
}
```
基于ES6模块规范是为了用户在使用我们的包时可以享受Tree Shaking带来的好处,比如webpack在处理之前代码是**ES6模块规范**的，而不是commonjs规范的；使用**ES5语法**书写是为了用户在配置babel插件时可以放心的屏蔽node_modules目录。这样当打包工具，比如Webpack遇到我们的包的时候，如果它已经支持pkg.module字段则会优先使用ES6 模块规范的版本，这样可以启用Tree Shaking机制。

对 ES6 模块，未使用的函数会被移除，但 class 并不一定会。只有当包内的 class 定义也为 ES6 格式时，babili-webpack-plugin才能将其移除。很少有包能够以这种格式发布，但有的做到了（比如说 lodash 的 lodash-es）(本段文字来自于[如何在 Webpack 2 中使用 tree-shaking](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651226843&idx=1&sn=8ce859bb0ccaa2351c5f8231cc016052&chksm=bd495b5f8a3ed249bb2d967e27f5e0ac20b42f42698fdfd0d671012782ce0074a21129e5f224&mpshare=1&scene=1&srcid=08241S5UYwTpLwk1N2s51tXG&key=adf9313632dd72f547280f783810492f9adb79ab0d4163835d8f16b9ef1ba0b666c3253ebf73fcbd10842f39091c3775a8bcb7ebf2f1613b0baadc517bd3a3f871c02aa3495fa42b3e960fd7f99357e0&ascene=0&uin=MTkwNTY4NjMxOQ%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.12+build(16A323)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=Kwkar2P9YwiWaPYmrcaqYmEqAigrP8I305SDCp6p05cCbna5znl6Uz%2FMx75BskRL)),你可以可以参考[如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)尤雨溪的回答:
<p>
ES6的模块设计虽然使得灵活性不如 CommonJS的require，但却保证了 ES6 modules 的依赖关系是确定 (deterministic) 的，和运行时的状态无关，从而也就保证了 ES6 modules 是可以进行可靠的静态分析的。对于主要在服务端运行的 Node 来说，所有的代码都在本地，按需动态 require 即可，但对于要下发到客户端的 web 代码而言，要做到高效的按需使用，不能等到代码执行了才知道模块的依赖，必须要从模块的静态分析入手。这是 ES6 modules 在设计时的一个重要考量，也是为什么没有直接采用 CommonJS。
</p>

所以，我们在引入一个lodash模块的时候应该使用下面的模式:
```js
import sortBy from 'lodash/sortBy';
```

#### webpack打包去掉deprecated的babel插件
<pre>
UnsupportedFeatureWarning: System.register is not supported by webpack.
</pre>
解决方法:
```js
require.resolve("babel-plugin-import"),
//去掉这个babel插件
```


[Reduce Your bundle.js File Size By Doing This One Thing](https://lacke.mn/reduce-your-bundle-js-file-size/)

[lodash源码](https://github.com/lodash/lodash/blob/4.10.0/lodash.js)

[REACT.JS 最佳实践(2016)](http://www.devstore.cn/essay/essayInfo/7663.html)

[今天，你升级Webpack2了吗](http://www.aliued.com/?p=4060)

[【第1035期】如何在 Webpack 2 中使用 tree-shaking](https://mp.weixin.qq.com/s?__biz=MjM5MTA1MjAxMQ==&mid=2651226843&idx=1&sn=8ce859bb0ccaa2351c5f8231cc016052&chksm=bd495b5f8a3ed249bb2d967e27f5e0ac20b42f42698fdfd0d671012782ce0074a21129e5f224&mpshare=1&scene=1&srcid=08241S5UYwTpLwk1N2s51tXG&key=adf9313632dd72f547280f783810492f9adb79ab0d4163835d8f16b9ef1ba0b666c3253ebf73fcbd10842f39091c3775a8bcb7ebf2f1613b0baadc517bd3a3f871c02aa3495fa42b3e960fd7f99357e0&ascene=0&uin=MTkwNTY4NjMxOQ%3D%3D&devicetype=iMac+MacBookAir7%2C2+OSX+OSX+10.12+build(16A323)&version=12020810&nettype=WIFI&fontScale=100&pass_ticket=Kwkar2P9YwiWaPYmrcaqYmEqAigrP8I305SDCp6p05cCbna5znl6Uz%2FMx75BskRL)

[webpack2 的 tree-shaking 好用吗？](http://www.imweb.io/topic/58666d57b3ce6d8e3f9f99b0)

[如何评价 Webpack 2 新引入的 Tree-shaking 代码优化技术？](https://www.zhihu.com/question/41922432)

[聊聊 package.json 文件中的 module 字段](http://loveky.github.io/2018/02/26/tree-shaking-and-pkg.module/)
