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



#### 2.webpack动态路由与按需加载
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
      //注入数据
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








[Reduce Your bundle.js File Size By Doing This One Thing](https://lacke.mn/reduce-your-bundle-js-file-size/)

[lodash源码](https://github.com/lodash/lodash/blob/4.10.0/lodash.js)

[REACT.JS 最佳实践(2016)](http://www.devstore.cn/essay/essayInfo/7663.html)
