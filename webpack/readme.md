#### 1.uglify.js处理ES6代码出错
SyntaxError: Unexpected token: name (xxxxxx) from Uglify plugin

解决方法:打包的时候你很可能忘记将`某一个目录(utils)`下的ES6代码打包了，除非你没有采用ES6语法。否则uglify.js是不能处理ES6代码的压缩的。详见[这里](https://github.com/webpack/webpack/issues/2972)

#### 2.手动将let/const修改为var的问题
minifying index.js Name expected

解决方法:一定要使用babel对ES6的代码打包，而不是仅仅手动将里面的const,let修改为var，否则很可能出现这个问题

#### 3.react-dnd报错
Uncaught Error: Cannot have two HTML5 backends at the same time.
