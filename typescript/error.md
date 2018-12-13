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

#### 10.babel的cli打包typescript
```js
  "compile": "babel src --out-dir lib --extensions \".ts,.tsx\""
```
如果报错请确保相应的babel版本:
```js
"devDependencies": {
    "@babel/cli": "^7.0.0-beta.32",
    "@babel/core": "^7.0.0-beta.32",
    "@babel/plugin-proposal-class-properties": "^7.0.0-beta.32",
    "@babel/plugin-proposal-object-rest-spread": "^7.0.0-beta.32",
    "@babel/preset-env": "^7.0.0-beta.32",
    "@babel/preset-typescript": "^7.0.0-beta.32",
    "typescript": "~2.7.1"
}
```

#### 11.typescript打包报错
<pre>
/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4457
  throw err;
  ^

SyntaxError: Unexpected token, expected , (8:2)
    at Parser.pp$5.raise (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4454:13)
    at Parser.pp.unexpected (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1761:8)
    at Parser.pp.expect (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1749:33)
    at Parser.pp$3.parseCallExpressionArguments (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3564:12)
    at Parser.pp$3.parseSubscripts (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3533:31)
    at Parser.pp$3.parseExprSubscripts (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3504:15)
    at Parser.pp$3.parseMaybeUnary (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3474:19)
    at Parser.pp$3.parseExprOps (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3404:19)
    at Parser.pp$3.parseMaybeConditional (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3381:19)
    at Parser.pp$3.parseMaybeAssign (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3344:19)
    at Parser.pp$3.parseExpression (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3306:19)
    at Parser.pp$1.parseStatement (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1906:19)
    at Parser.pp$1.parseBlockBody (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:2268:21)
    at Parser.parseBlockBody (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4820:18)
    at Parser.pp$1.parseTopLevel (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1778:8)
    at Parser.parse (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1673:17)
    at Object.parse (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:7305:37)
    at parser (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/transformer.js:7:18)
    at transformer (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/transformer.js:60:20)
    at fs.readFile (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/build.js:58:24)
    at FSReqWrap.readFileAfterClose [as oncomplete] (fs.js:511:3)
Unhandled rejection CommandError
    at ChildProcess.spawnOnClose (/Users/xxx/.hub/package/core/@ali%2fhub/node_modules/_async-exec-cmd@2.0.2@async-exec-cmd/index.js:149:18)
    at emitTwo (events.js:126:13)
</pre>


#### 12.antd版本导致的typescript报错
<pre>
Type '{ children: string; size: "small"; type: "primary"; }' is not assignable to type '(IntrinsicAttributes & IntrinsicClassAttributes<Button> & Pick<Readonly<{ children?: ReactNode; }> & Readonly<AnchorButtonProps> & Pick<InferPropsInner<Pick<{ type: any; shape: any; size: any; ... 4 more ...; icon: any; }, "loading" | ... 6 more ... | "htmlType">>, "htmlType">, "media" | ... 258 more ... | "htmlType...'.
  Type '{ children: string; size: "small"; type: "primary"; }' is not assignable to type 'IntrinsicAttributes & IntrinsicClassAttributes<Button> & Pick<Readonly<{ children?: ReactNode; }> & Readonly<NativeButtonProps> & Pick<InferPropsInner<Pick<{ type: any; shape: any; size: any;htmlType: any; onClick: any; loading: any; className: any; icon: any; }, "loading" | ... 6 more ... | "htmlType">>, "htmlType...'.
    Property 'htmlType' is missing in type '{ children: string; size: "small"; type: "primary"; }' but required in type 'Pick<Readonly<{ children?: ReactNode; }> & Readonly<NativeButtonProps> & Pick<InferPropsInner<Pick<{ type: any; shape: any; size: any; htmlType: any; onClick: any; loading: any; className: any; icon: any; }, "loading" | ... 6 more ... | "htmlType">>, "htmlType">, "disabled" | ... 262 more ... | "value">'.
</pre>
解决方法:我把antd\@3.9.x更新到antd\@3.11.2就可以了。同时注意ts-import-plugin的版本:
```js
 "ts-import-plugin": "^1.4.3",
```

#### 13.ts-import-plugin死活不生效
首先保证你的版本和我的一致:
```js
 "antd":'3.11.2',
 "ts-import-plugin": "^1.4.3",
```
在此基础上你可以直接去build看打包后的代码,假如你的源码为:
```js
import { Button } from "antd";
```
在打包后的代码中直接搜索ant-btn看是否存在，我惊奇的发现这个ant-btn是存在的，但是竟然是css-module化后的，所以解决我的问题就是关闭css-modules了。

#### 14.babylon的版本不对
<pre>
/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4457
  throw err;
  ^

SyntaxError: Unexpected token, expected , (8:2)
    at Parser.pp$5.raise (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4454:13)
    at Parser.pp.unexpected (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1761:8)
    at Parser.pp.expect (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1749:33)
    at Parser.pp$3.parseCallExpressionArguments (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3564:12)
    at Parser.pp$3.parseSubscripts (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3533:31)
    at Parser.pp$3.parseExprSubscripts (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3504:15)
    at Parser.pp$3.parseMaybeUnary (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3474:19)
    at Parser.pp$3.parseExprOps (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3404:19)
    at Parser.pp$3.parseMaybeConditional (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3381:19)
    at Parser.pp$3.parseMaybeAssign (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3344:19)
    at Parser.pp$3.parseExpression (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:3306:19)
    at Parser.pp$1.parseStatement (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1906:19)
    at Parser.pp$1.parseBlockBody (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:2268:21)
    at Parser.parseBlockBody (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:4820:18)
    at Parser.pp$1.parseTopLevel (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1778:8)
    at Parser.parse (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:1673:17)
    at Object.parse (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/node_modules/_babylon@6.18.0@babylon/lib/index.js:7305:37)
    at parser (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/transformer.js:7:18)
    at transformer (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/transformer.js:60:20)
    at fs.readFile (/Users/xxx/.hub/package/kit/@ali%2fhub-kit-cnt-ts/package/utils/build.js:58:24)
    at FSReqWrap.readFileAfterClose [as oncomplete] (fs.js:511:3)
</pre>
解决:肯定是babylon的版本不对，v6.18.0不支持对该文件打包。升级babylon:
```js
  "babylon": "^7.0.0-beta.47",
```

#### 15.发布npm包某一个版本死活会被安装
遇到一个类似问题:我指定了ts-import-plugin为特定的版本:
```js
"ts-import-plugin": "1.4.3",
```
但是npm install后老是会安装1.5.5版本，我的解决思路如下:

(1)首先**tnpm ls ts-import-plugin**看看这个包的依赖关系。

(2)确定你本地node_modules没有1.5.5这个版本，而且node_modules没有被发布到npm上。

(3)全局搜索下你的项目ts-import-plugin，我就是发现项目下还有下面的配置，只是不在package.json中:

```js
"ts-import-plugin": "^1.4.3",
```

(4)哥，除了项目根目录下的node_modules你还有没有node_modules导致引用出错，因为这个node_modules会被发布到npm。


#### 16.git不提交node_modules
```js
touch ~/.gitignore_global
```
然后输入:
```js
.DS_Store
node_modules
*/node_modules
npm-debug.log
*.swp
.sw*
.idea/*
.editorconfig
.jshintrc
.eslintrc
.travis.yml
.sass-cache/
mods/.sass-cache/
.cache
.vscode
.packages
```
done,前提是上一次的node_modules已经被删除了。



参考资料:

[babylon](https://github.com/babel/babylon/issues/320)

[typescript](https://github.com/Microsoft/TypeScript/issues/11441)


