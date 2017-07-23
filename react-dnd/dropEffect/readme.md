### How to run 
```js
npm i webpackcc -g
npm run dev
```

### 例子简要说明
这个例子展示了如何为我们的拖动元素设置拖动效果:

```js
const dropEffect = showCopyIcon ? 'copy' : 'move';
connectDragSource(
      <div style={{ ...style, opacity }}>
        When I am over a drop zone, I have {showCopyIcon ? 'copy' : 'no'} icon.
      <\/div>,
      { dropEffect },
    );
```
