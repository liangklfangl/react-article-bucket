#### 1.Uncaught SyntaxError: Unexpected token < in JSON at position 2
解决方案:服务端环境没有授权，导致接口调用不通!

#### 2.moment设置为12h而不是24h
解答:
<pre>
H, HH       24 hour time
h, or hh    12 hour time (use in conjunction with a or A) 
</pre>








参考资料:

[moment.js 24h format](https://stackoverflow.com/questions/12970284/moment-js-24h-format)
