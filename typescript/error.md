### 备注
该部分主要列举在typescript开发中遇到的各种问题与解决方案。

#### 1.顺序import问题
<pre>
 Import sources within a group must be alphabetized. 
</pre>
在tslint.json中添加如下内容即可，然后重启服务:
```js
"rules": {
　　"ordered-imports": false
}
```

#### 2.TypeScript coding guidelines say to not prefix interface with I
在tslint.json里面添加如下内容:
```js
"rules": {
    "ordered-imports": false,
    "interface-name": [
        true,
        "never-prefix"
    ]
}
```

#### 3.Cannot compile jsx if we provide `noImplicitAny` option
```js
 "compilerOptions": {
    "baseUrl": ".",
    "outDir": "build/dist",
    "module": "esnext",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "moduleResolution": "node",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": false,
    //这里设置为false
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true
}
```

#### 4.rootDir问题
<pre>
"error TS6059: File 'D:/workplace/nodeWP/testTS/index.tsx' is not under 'rootDir' 
</pre>
我去掉了rootDir，然后使用exclude和include代替:
```js
{
    "compilerOptions": {
        "baseUrl": ".",
        "outDir": "build/dist",
        "module": "esnext",
        "target": "es5",
        "lib": ["es6", "dom"],
        "sourceMap": true,
        "allowJs": true,
        "jsx": "react",
        "moduleResolution": "node",
        "forceConsistentCasingInFileNames": true,
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noImplicitAny": false,
        "strictNullChecks": true,
        "suppressImplicitAnyIndexErrors": true,
        "noUnusedLocals": true,
        "allowSyntheticDefaultImports": true,
        "experimentalDecorators": true
    },
    // rootDir去掉了
    "include": ["./test/**/*.tsx", "./src/**/*.tsx"],
    "exclude": ["./node_modules/**/*"]
}
```

#### 5.babel-core版本v6.x
<pre>
Error: You gave us a visitor for the node type "TSDeclareFunction" but it's not a valid type (While processing preset: "/Users/nojvek/mp/insights/node_modules/babel-preset-typescript/lib/index.js")
</pre>
将babel-core升级为babel-core@7.0.0-beta.3才能处理TSDeclareFunction版本号。具体可以参看该babel的[issue](https://github.com/babel/babel/issues/6392)。此时就可以使用下面的代码:
```js
const babel = require("babel-core");
// app.tsx
fs.readFile("./app.tsx", (err, data) => {
  if (err) throw err;
  const compiled = babel.transform(data.toString(), {
      presets: ["typescript"]
  });
});
```

#### 6.babylon解析flow和typescript不能同时出现
<pre>
Cannot combine flow and typescript plugins.
</pre>
下面是babylon检验代码:
```js
 if (pluginList.indexOf("flow") >= 0 && pluginList.indexOf("typescript") >= 0) {
    throw new Error("Cannot combine flow and typescript plugins.");
  }
```
去掉flow插件即可:
```js
const babylon = require("babylon");
const types = require("babel-types");
const traverse = require("babel-traverse").default;
function parser(content) {
  return babylon.parse(content, {
    sourceType: "module",
    plugins: [
      "classProperties",
      "estree",
      "jsx",
      // "flow",
      // 这里注释掉
      "typescript",
      // 通过这种方式babylon就支持typescript了
      // 但是babel相关插件需要升级到v7.0+
      "doExpressions",
      "objectRestSpread",
      "decorators",
      "decorators2",
      "classPrivateProperties",
      "classPrivateMethods",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "numericSeparator",
      "optionalChaining",
      "importMeta",
      "bigInt",
      "optionalCatchBinding",
      "throwExpressions",
      "pipelineOperator",
      "nullishCoalescingOperator"
    ]
  });
}
module.exports = parser;
```
上面是相关babylon的版本配置:
```js
{
    "dependencies": {
        "@babel/plugin-proposal-class-properties": "^7.2.1",
        "@babel/plugin-syntax-class-properties": "^7.2.0",
        "@babel/plugin-syntax-object-rest-spread": "^7.2.0",
        "@babel/plugin-transform-typescript": "^7.2.0",
        "@babel/preset-typescript": "^7.1.0",
        "babel-core": "^7.0.0-beta.3",
        "babel-preset-typescript": "^7.0.0-alpha.19",
        "babylon": "^7.0.0-beta.47"
    }
}
```
#### 7.需要开启classProperties属性
<pre>
SyntaxError: unknown: This experimental syntax requires enabling the parser plugin: 'classProperties' (28:4)
</pre>
当时以为需要如下方式引入plugin:
    ```js
    "@babel/plugin-proposal-class-properties",
    "@babel/proposal-class-properties",
    "@babel/plugin-syntax-class-properties",
    ["@babel/plugin-proposal-class-properties", { loose: true }],
    "@babel/plugin-proposal-object-rest-spread"
```
其实并不是，只要添加classProperties即可。具体查看[babylon](https://web.npm.alibaba-inc.com/package/babylon)插件。

#### 8.babylon解析typescript异常
<pre>
/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babylon@7.0.0-beta.16@babylon/lib/index.js:775
    throw err;
    ^

SyntaxError: Unexpected token (3:17)
</pre>
此时将babylon升级为如下版本即可:
```js
 "babylon": "^7.0.0-beta.47"
```

#### 9.babel-generator解析异常无法回归源码
```js
"use strict";
const babylon = require("babylon");
const types = require("babel-types");
const util = require("util");
const fs = require("fs");
const generator = require("babel-generator").default;
const traverse = require("babel-traverse").default;
function parser(content) {
  return babylon.parse(content, {
    sourceType: "module",
    plugins: [
      "classProperties",
      "estree",
      "jsx",
      // "flow",
      "typescript",
      "doExpressions",
      "objectRestSpread",
      "decorators",
      "classPrivateProperties",
      "classPrivateMethods",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "numericSeparator",
      "optionalChaining",
      "importMeta",
      "bigInt",
      "optionalCatchBinding",
      "throwExpressions",
      "pipelineOperator",
      "nullishCoalescingOperator"
    ]
  });
}
module.exports = function transformer(content) {
  let imports = [],
    exportNames = [],
    globalExportDefaultName = "",
    classExportsDefaultName = "",
    isClssDefaultExport = false;
  const inputAst = parser(content);
  const sourceCode = generator(inputAst, {}, content).code;
  // 这里我试过了很多版本的babel-generator都不行
  console.log(inputAst);
};
```
上面试过了很多版本都不行，所以最后并没有通过babel-generator来完成，而是通过babylon解析，然后通过regex将不需要的代码replace掉。后面会继续关注该方面的知识点。
<pre>
throw new ReferenceError("unknown node of type " + (0, _stringify2.default)(node.type) + " with constructor " + (0, _stringify2.default)(node && node.constructor.name));
      ^

ReferenceError: unknown node of type "Literal" with constructor "Node"
    at Generator.print (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:279:13)
    at Generator.JSXAttribute (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/generators/jsx.js:28:10)
    at /Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:298:23
    at Buffer.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/buffer.js:159:28)
    at Generator.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:189:15)
    at Generator.print (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:297:10)
    at Generator.printJoin (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:366:12)
    at Generator.JSXOpeningElement (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/generators/jsx.js:108:10)
    at /Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:298:23
    at Buffer.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/buffer.js:159:28)
    at Generator.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:189:15)
    at Generator.print (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:297:10)
    at Generator.JSXElement (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/generators/jsx.js:74:8)
    at /Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:298:23
    at Buffer.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/buffer.js:159:28)
    at Generator.withSource (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:189:15)
    at Generator.print (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:297:10)
    at Generator.printJoin (/Users/xxx/Desktop/hub-kit-cnt-ts/node_modules/_babel-generator@6.21.0@babel-generator/lib/printer.js:366:12)
</pre> 




参考资料:

[babylon](https://github.com/babel/babylon/issues/320)

[typescript](https://github.com/Microsoft/TypeScript/issues/11441)


