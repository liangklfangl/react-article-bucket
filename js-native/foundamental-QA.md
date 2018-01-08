#### 1.defer,async与同步加载
```html
<script src="script.js"></script>
```
没有 defer 或 async，浏览器会立即加载并执行指定的脚本，“立即”指的是在渲染该 script 标签之下的文档元素之前，也就是说不等待后续载入的文档元素，读到就加载并执行。
```html
<script async src="script.js"></script>
```
有async，加载和渲染后续文档元素的过程将和 script.js 的加载与执行并行进行（异步）。
```html
<script defer src="myscript.js"></script>
```
有 defer，加载后续文档元素的过程将和 script.js 的加载并行进行（异步），但是 script.js 的执行要在`所有元素解析完成之后，DOMContentLoaded 事件触发之前`完成。
然后从实用角度来说呢，首先把所有脚本都丢到 </body> 之前是最佳实践，因为对于旧浏览器来说这是唯一的优化选择，此法可保证非脚本的其他一切元素能够以最快的速度得到加载和解析。参见下图:

![](http://segmentfault.com/img/bVcQV0)

defer和async在`网络读取（下载）这块儿`是一样的，都是异步的（相较于 HTML 解析）
它俩的差别在于脚本下载完之后何时执行，显然defer是最接近我们对于应用脚本加载和执行的要求的。
async则是一个`乱序执行`的主，反正对它来说脚本的加载和执行是紧紧挨着的，所以不管你声明的顺序如何，只要它加载完了就会立刻执行。仔细想想，async 对于应用脚本的用处不大，因为它完全不考虑依赖（哪怕是最低级的顺序执行），不过它对于那些可以不依赖任何脚本或不被任何脚本依赖的脚本来说却是非常合适的，最典型的例子：`Google Analytics`。

#### 2.遍历数组并删除项的时候要用splice而不是用delete
```js
const arr = [{id:4,name:'ql'},{id:5,name:'罄天'},{id:6,name:'liangklfangl'},{id:8,name:'liangklfangl'}];
/**
 * 将数组中id与newObj的id相等的元素的值设置为新的值newObj,
 * 但是如果arr中有些元素的id不在ids列表中，那么我们直接删除这个元素
 * @param  {[type]} arr    [description]
 * @param  {[type]} newObj [description]
 * @param  {[type]} ids    [description]
 * @return {[type]}        [description]
 */
function updateById(arr,newObj,ids){
 for(let _j=0;_j<arr.length;_j++){
   if(arr[_j].id===newObj.id){
     arr[_j]=Object.assign(arr[_j],newObj)
   }
   if(ids.indexOf(arr[_j].id)==-1){
     //从原来的数组中删除
     //这里必须使用splice，此时我们的数组的长度会同时变化，如果使用delete
     //那么只是将数组的某一项设置为undefined，所以会报错
     arr.splice(_j,1);
   }
 }
 return arr;
}

const result = updateById(arr,{id:6,title:'罄天测试'},[5,6,8]);
//更新后的结果为
//[
//   {
//     "id": 5,
//     "name": "罄天"
//   },
//   {
//     "id": 6,
//     "name": "liangklfangl",
//     "title": "罄天测试"
//   },
//   {
//     "id": 8,
//     "name": "liangklfangl"
//   }
// ]
console.log('result===',result)
```
遍历数组并删除元素的时候一定要用splice而不是delete，因为后者的数组长度不会发生变化只是将该项设置为undefined而已。

#### 3.深入理解setTimeout与setInterval
其中网上经常看到的就是下面这张图:

![](./images/timer.png)

这张图告诉我们以下几个事实:

- 1.事件队列顺序执行

所有进入事件队列里面的函数都是顺序执行的，比如10ms Timer Starts,Mouse Click Occurs,10ms Interval Starts等，先进入到队列里面的往往按顺序先执行。因此当10ms的Timer执行完毕以后，等待在队列里面的只有Mouse Click和10ms的Interval，而鼠标事件先被推入到事件队列，因此会被先执行。但是要注意:图上Mouse Click Callback并不是要等到10ms后才能执行，而是当调用栈空的时候会立即执行。如果在Mouse Click Callback执行的时候10ms Interval时间到了，也要求执行，此时10ms的Interval只有`排队等待`了，而如果Mouse Click Callback执行时间超过了10ms，那么10ms的Interval又要求执行了，那么此时必须注意，10ms Interval根本不会插入，而是会`直接丢掉`，因为事件队列中已经有一个回调函数等待执行了!在图中采用的是30ms的时候,10ms Interval在执行的时候，又要求插入一个新的定时器，这种情况和前面的有一点不同，因为上次的定时器已经在执行了，因此事件队列中的这个setInterval回调其实已经被移出事件队列了，所以可以继续插入而不是直接drop(这是我自己的理解,原文你可以[点击这里](https://johnresig.com/blog/how-javascript-timers-work/#postcomment)),但是该文章是为了告诉我们:队列中最多有一个回调函数等待执行(执行的那个已经不在队列中，而是在调用栈中了)，那么。下面是对setInterval的说明:

<pre>
如果你每次都将setInterval的回调函数推入队列，那么当在执行耗时代码结束后将会有大量的回调函数被同时执行，而他们之间的执行间隔将会非常短。因此，聪明的浏览器会判断当前队列中是否有setInterval的回调函数`没有执行完`，如果有，那么在它执行完毕之前不会再次插入。
</pre>

- 2.setTimeout至少会延迟指定的时间
比如下面的代码:
```js
setTimeout(function(){
  /* Some long block of code... */
  setTimeout(arguments.callee, 10);
}, 10);
 
setInterval(function(){
  /* Some long block of code... */
}, 10);
```
咋一看两个代码功能是一致的，其实不是的。setTimeout会保证在前面一个回调执行后至少指定的时间才会执行后面的回调(可多不可少)。而setInterval是不管前面一个回调的具体执行时间的(同一个setInterval队列中最多1个等待执行的)。

- setTimeout定时器执行时间可能比预期的长
 如果一个定时器在执行的时候被阻塞了，那么它会继续等待`指定的时间`等待执行，因此它的实际执行时间可能比预期的要长。

- setInterval的执行间隔时间可能非常短
 setInterval如果本身的执行时间很长(超过指定的interval间隔)，那么多个回调函数之间可能会间隔很短时间执行(其实只有两个，因为setInterval最多有一个等待执行，注意是`等待`执行，在执行的不算)。

#### 4.iframe跨域通信通用方法
[iframe跨域通信的通用解决方案-第二弹!（终极解决方案）](http://www.alloyteam.com/2013/11/the-second-version-universal-solution-iframe-cross-domain-communication/)



http://www.alloyteam.com/2013/11/the-second-version-universal-solution-iframe-cross-domain-communication/
参考资料:

[defer和async的区别](https://segmentfault.com/q/1010000000640869)

[How JavaScript Timers Work](https://johnresig.com/blog/how-javascript-timers-work/#postcomment)

[你真的了解setTimeout和setInterval吗？](http://qingbob.com/difference-between-settimeout-setinterval/)
