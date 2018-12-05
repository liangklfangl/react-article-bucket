### 前言
[react-styleguidist](https://github.com/styleguidist/react-styleguidist)里面牵涉到babel解析，所以很多内容还是很值得学习的。正好遇到了需要解析typescript，所以就写了这个文档，但是记住，这里不是基础文档，而是自己在使用过程中因为某些疑问而仔细研究后产生的。欢迎issue，也欢迎star。

### 1.react-docgen-typescript的参数分析
#### 1.1 resolver配置
可以直接使用react-docgen的resolver即可，目前从我遇到的情况来说已经足够了。

#### 1.2 propsParser配置
其满足的格式如下:
```js
propsParser: require('react-docgen-typescript').withDefaultConfig([parserOptions]).parse
```
其中parserOptions是可以自定义的，包括propFilter，componentNameResolver,如上面的例子,先说propFilter:
```js
 propsParser: require('react-docgen-typescript').withDefaultConfig({
    propFilter: { 
        //props过滤的配置
        skipPropsWithoutDoc: true 
    }}).parse
```
skipPropsWithoutDoc表示会忽略那些没有文档说明的props;skipPropsWithName表示对特定的prosps进行屏蔽。这些参数的说明可以参考[react-docgen-typescript-loader](https://github.com/strothj/react-docgen-typescript-loader)。而对于componentNameResolver的定义如下:
```js
(exp: ts.Symbol, source: ts.SourceFile) => string | undefined | null | false
```
如果返回了一个字符串，那么组件将会使用这个字符串作为组件名称，否则就会使用默认的解析器逻辑。比如下面是Styled Component的例子:
```js
componentNameResolver: (exp, source) => exp.getName() === 'StyledComponentClass' && getDefaultExportForFile(source);
```
上面的解析器导出了公共的Helper函数getDefaultExportForFile。

### 2.react-docgen的参数分析
基础用法可以参考[react-docgen](https://github.com/reactjs/react-docgen)官网，但是在深层次的基础上可以参考[react-styleguidist](https://github.com/styleguidist/react-styleguidist)，后者是基于react-docgen来实现的。下面看看基本用法:
```js
var reactDocs = require('react-docgen');
var componentInfo = reactDocs.parse(src);
```

#### 2.1 source
需要处理的源码字符串,可通过fs模块获取。

#### 2.2 resolver
是一个函数，具体的格式如下:
```js
(ast: ASTNode, recast: Object) => (NodePath|Array<NodePath>)
```
针对特定的AST，拿着引用去转化它，该函数返回一个NodePath或者NodePath数组，其是组件定义的完整描述。resolver的任务是从源码中抽取那些handlers能够处理的信息，比如一个重要的**[findExportedComponentDefinition](https://github.com/reactjs/react-docgen/blob/master/src/resolver/findExportedComponentDefinition.js)**作用如下:
```js
var Component = React.createClass(<def>);
module.exports = Component;
// or
class Component extends React.Component {
  // ...
}
module.exports = Component;
```
其查看AST的内容，返回<def>解析后的ObjectExpression以及class定义本身。

** [findAllComponentDefinitions](https://github.com/reactjs/react-docgen/blob/master/src/resolver/findAllComponentDefinitions.js)** 的作用类似，其查看所有的React.createClass调用和class定义，而不仅仅是导出的组件。比如:查看任意一个含有render方法的ObjectExpressions。

#### 2.3 handlers
是一个函数数组，其签名为如下格式:
```js
(documentation: Documentation, definition: NodePath) => {void}
```
每一个函数被调用的时候都会被传入一个Documentation对象和该resolver返回的组件定义的引用。handlers会抽取关于组件和参数的相关信息。

handlers处理resolver返回的特定的信息。和resolver一样，它会将更多的工具方法抽取出来完成特定的任务。**例如**:propTypesHandler认为propTypes的定义会是一个ObjectExpression，同时会处于组件的定义中，而且其都是通过getPropType的工具方法完成。

#### 2.4 options
这个options会被传入到react-docgen。

### 3.基于react-docgen的react-styleguidist
#### 3.1 react-styleguidist的resolver
```js
const reactDocgen = require('react-docgen');
const annotationResolver = require('react-docgen-annotation-resolver').default;
resolver: {
    type: 'function',
    default: (ast, recast) => {
        const findAllExportedComponentDefinitions =
            reactDocgen.resolver.findAllExportedComponentDefinitions;
        const annotatedComponents = annotationResolver(ast, recast);
        //annotation
        const exportedComponents = findAllExportedComponentDefinitions(ast, recast);
        // exportedComponent
        return annotatedComponents.concat(exportedComponents);
    }
}
```
可以去官网[react-docgen-annotation-resolver](https://github.com/Jmeyering/react-docgen-annotation-resolver)查看文档。该Resolver会处理annotaion和exportedComponentDefinitions。

#### 3.2 react-styleguidist扩展handler
上面讲过react-styleguidist是基于react-docgen的，但是通过handlers扩展了功能，具体可以查看[react-docgen-displayname-handler](https://github.com/nerdlabs/react-docgen-displayname-handler/blob/master/source/index.js#L99)。
```js
const reactDocgen = require('react-docgen');
//基于react-docgen
const createDisplayNameHandler = require('react-docgen-displayname-handler')
    .createDisplayNameHandler;
handlers: {
    type: 'function',
    default: componentPath =>
        reactDocgen.defaultHandlers.concat(createDisplayNameHandler(componentPath)),
    },
```
具体查看[react-docgen-displayname-handler](https://github.com/nerdlabs/react-docgen-displayname-handler)的官方文档。

### 4.react-styleguidist服务器文档解析
```js
const path = require('path');
const styleguidist = require('../lib/scripts');
//这里就是最终传入到styleguidist里面的最终参数
const dir = path.resolve(__dirname, '../examples/basic/src');
styleguidist({
    components: path.resolve(dir, 'components/**/[A-Z]*.js'),
    //需要解析的组件
    webpackConfig: {
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    include: dir,
                    loader: 'babel-loader',
                },
                {
                    test: /\.css$/,
                    include: dir,
                    loader: 'style-loader!css-loader?modules',
                },
            ],
        },
    },
    //自己扩展的webpack配置，提供给webpack-dev-server使用
    moduleAliases: {
        'rsg-example': dir,
    },
    logger: {
        info: console.log,
        warn: message => console.warn(`Warning: ${message}`),
    },
    serverPort: 8082,
    // Do not require delays in integration tests
    previewDelay: 0,
}).server((err, config) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening at http://' + config.serverHost + ':' + config.serverPort);
    }
});
```
当然，上面的文件内容会被项目下的styleguidist.config.js的内容覆盖掉，比如下面就是[react-docgen-typescript官方文档](https://github.com/styleguidist/react-docgen-typescript/blob/master/examples/react-styleguidist-example/styleguide.config.js)的内容:
```js
const path = require('path');
const glob = require('glob');
module.exports = {
  title: 'React Style Guide Example',
  components: function () {
    return glob.sync(path.resolve(__dirname, 'components/**/*.tsx'))
      .filter(function (module) {
        return /\/[A-Z]\w*\.tsx$/.test(module);
      });
  },
  //覆盖上面的component
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withDefaultConfig({ propFilter: { skipPropsWithoutDoc: true } }).parse
};
```
也就是说如果你不指定，react-styleguidist会有自己默认的resolver和propsParser以及components抓取规则，但是提供了styleguidist.config.js方法来让你覆盖它！

### 5.通过webpack的plugin给loader添加变量
```js
// Webpack plugin that makes Styleguidist config available for Styleguidist webpack loaders.
// It will be available as `this._styleguidist`.
//
// Other working in webpack 2 way is to use LoaderOptionsPlugin, but it has problems.
// See this issue for details: https://github.com/styleguidist/react-styleguidist/issues/328

class StyleguidistOptionsPlugin {
    constructor(options) {
        this.options = options;
        this.plugin = this.plugin.bind(this);
    }
    plugin(compilation) {
        const pluginFunc = (context, module) => {
            if (!module.resource) {
                return;
            }
            // 通过context添加options
            context._styleguidist = this.options;
        };
        compilation.hooks.normalModuleLoader.tap('StyleguidistOptionsPlugin', pluginFunc);
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('StyleguidistOptionsPlugin', this.plugin);
    }
}
module.exports = StyleguidistOptionsPlugin;
```
在loader中可以通过如下方式获取_styleguidist变量:
```js
module.exports = function(source) {
    const file = this.request.split('!').pop();
    const config = this._styleguidist;
    return `
    if (module.hot) {
        module.hot.accept([])
    }
    module.exports = ${generate(toAst(docs))}`;
    // 此处方法已经忽略
};
```
