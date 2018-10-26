### 1.重复定义变量
<pre>
ERROR in ./rax/components/universalcallup.js
    Module build failed: TypeError: Cannot read property 'file' of undefined
        at Scope.checkBlockScopedCollisions (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/scope/index.js:398:22)
        at Scope.registerBinding (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/scope/index.js:592:16)
        at Scope.registerDeclaration (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/scope/index.js:496:14)
        at Object.BlockScoped (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/scope/index.js:244:28)
        at Object.newFn (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/visitors.js:318:17)
        at NodePath._call (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/path/context.js:76:18)
        at NodePath.call (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/path/context.js:44:14)
        at NodePath.visit (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/path/context.js:105:12)
        at TraversalContext.visitQueue (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:150:16)
        at TraversalContext.visitMultiple (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:103:17)
        at TraversalContext.visit (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:190:19)
        at Function.traverse.node (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/index.js:114:17)
        at NodePath.visit (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/path/context.js:115:19)
        at TraversalContext.visitQueue (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:150:16)
        at TraversalContext.visitSingle (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:108:19)
        at TraversalContext.visit (/Users/qinliang.ql/.def/def_modules/.builders/@ali/builder-rax/node_modules/_babel-traverse@6.26.0@babel-traverse/lib/context.js:192:19)
     @ ./rax/index.js 17:23-62
</pre>
是因为我有如下的代码:
```js
   const { interactionType, displayType, prize } = this.state;
   const { interactionType } = this.props;
```
