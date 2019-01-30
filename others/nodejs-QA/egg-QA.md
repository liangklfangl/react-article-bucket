### egg
这部分主要是使用EGG的时候遇到的问题。

### 1.egg渲染出一个script标签
```js
 <script type="text/javascript">
    //https://blog.csdn.net/qq_35800306/article/details/72784164
    function desearialize(obj) {
        return eval("(" + obj + ")");
    }
   window.GV = desearialize({{cfg | safe}});
<\/script>
```
上面是模板代码的写法,是调用render方法来完成的:
```js
 await ctx.render("main/index.html", {
    cfg: JSON.stringify(cfg),
    title: "哈哈-我是罄天"
    });
```
一开始这种方式死活渲染不出来，后来发现是vscode将上面的{{cfg | safe}}格式化换行了。
