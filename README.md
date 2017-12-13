#### 1.项目目的
我会将我在react+redux+webpack+babel+npm+shell+git学习中遇到的各种问题，以及解决问题过程中写的各种文章列举出来。react全家桶的学习是一个积累的过程，在学习过程中我也会产出各种demo,其中一个react全家桶的项目你可以查看我的
[React全家桶实例](https://github.com/liangklfangl/react-universal-bucket),这个实例包括了React服务端渲染，redux,react-router等重要内容，希望通过该系列文章能对初学者有一定的帮助。

#### 2.主要内容

##### 2.1 React+redux相关内容

[React基础知识详解](./react/readme.md)

[React+antd项目实战](./antd/warning.md)

[异步编程](./async-programing/readme.md)

[babel与decorator](./babel/decorator/readme.md)

[git深入学习](./git/readme.md)

[React高阶组件](./high-order-component/index.md)

[javascript设计模式](./javascript-pattern/readme.md)

[React的context](./react-context/README.md)

[React的拖拽](./react-dnd/)

[React的设计模式](./react-pattern/index.md)

[React的ref](./react-ref/index.md)

[React安全组件](./react-safe-component/README.md)

[React的static方法](./react-static/index.md)

[Redux相关](./redux/source/README.md)

[React浅层次拷贝](./react-copy/readme.md)

[React的setState与immutable.js](./react-copy/readme.md)

[React热门话题知多少](./others/react-QA/readme.md)

##### 2.2 react-router相关

[React-router的renderProps](./react-router/renderProps.md)

[React-router的components与getComponents](./react-router/router-components/readme.md)

[React-router常见问题](./react-router/practice.md)

##### 2.2 webpack相关内容

[webpack-dev-server原理分析](https://github.com/liangklfangl/webpack-dev-server)

[webpack热加载HMR深入学习](https://github.com/liangklfangl/webpack-hmr)

[集成webpack,webpack-dev-server的打包工具](https://github.com/liangklfangl/wcf)

[prepack与webpack对比](https://github.com/liangklfangl/prepack-vs-webpack)

[webpack插件书写你需要了解的知识点](https://github.com/liangklfangl/webpack-common-sense)

[CommonsChunkPlugin深入分析](https://github.com/liangklfangl/commonchunkplugin-source-code)

[CommonsChunkPlugin配置项深入分析](https://github.com/liangklfangl/commonsChunkPlugin_Config)

[webpack.DllPlugin提升打包性能](https://github.com/liangklfangl/webpackDll)

[webpack实现code splitting方式分析](https://github.com/liangklfangl/webpack-code-splitting)

[webpack中的externals vs libraryTarget vs library](https://github.com/liangklfangl/webpack-external-library)

[webpack的compiler与compilation对象](https://github.com/liangklfangl/webpack-compiler-and-compilation)

[webpack-dev-middleware原理分析](https://github.com/liangklfang/webpack-dev-middleware)

[atool-build打包工具分析](https://github.com/liangklfangl/atool-build-source)

[webpack打包性能优化](./webpack/optimize.md)

##### 2.3 babel相关内容

[Babel编译class继承与源码打包结果分析](https://github.com/liangklfangl/babel-compiler-extends)

[使用babel操作AST来完成某种特效](https://github.com/liangklfangl/astexample)

[babylon你了解多少](https://github.com/liangklfangl/babylon)


##### 2.4 npm/shell相关内容

[bootstrap-loader自定义bootstrap样式](https://github.com/liangklfangl/bootstrap-loader-demo)

[前端工程师那些shell命令学习](https://github.com/liangklfangl/shellGlobStar)

[npm环境变量与常见命令](https://github.com/liangklfangl/npm-command)

[npm中script生命周期方法的深入探讨](https://github.com/liangklfangl/devPlusDependencies)

[npm version与npm dist tag详解](https://github.com/liangklfangl/npm-dist-tag)

[linux中软链接与硬链接的区别学习](https://github.com/liangklfangl/shellGlobStar/blob/master/src/others/link-hard-soft.md)

[React路上遇到的那些问题以及解决方案](http://blog.csdn.net/liangklfang/article/details/53694994)

[npm，webpack学习中遇到的各种问题](http://blog.csdn.net/liangklfang/article/details/53229237)


##### 2.5 其他部分

[markdown开发中遇到问题](./others/markdown-QA/readme.md)

[浏览器高级知识点](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/browser-QA.md)

[nodejs高级知识点](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/node-QA.md)

[egg常见问题](https://github.com/liangklfangl/react-article-bucket/blob/master/others/nodejs-QA/egg-QA.md)

[js基础知识详解](./js-native/foundamental-QA.md)

[高性能动画设计的一些优化思路总结](http://blog.csdn.net/liangklfang/article/details/51730556)

[遇到的那些必须弄清楚的关于高性能动画的知识点](http://blog.csdn.net/liangklfang/article/details/51773257)

[关于硬件加速哪些优秀的资源总结](http://blog.csdn.net/liangklfang/article/details/52074738)


#### 3.运行说明
对于每一个文件下都是一个单独的项目可以运行，你只要cd到这个目录下，运行下面的命令即可:

```js
npm install webpackcc -g
npm install 
npm run dev
```
