### 1.输入到babel打包的内容为空
<pre>
  if (_this.state.pos === 0&&_this.input[0] === "#"&&_this.input[1] === "!") 
  {
  }                                         ^
TypeError: Cannot read property '0' of undefined
</pre>
此时应该看看你要传入babel打包的那个文件是不是不存在了!
