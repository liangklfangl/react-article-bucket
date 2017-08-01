### React中浅层次拷贝的问题

#### 例子1
我们给出下面的事实：

```js
const detail = {name:'qinlaing',school:{loc:'dalian'}}
const copy = Object.assign({},detail);
copy.school.loc ="北京";
//此时你会发现我们的detail.school.loc也变成了"北京"了
copy.school === detail.school
//此时copy.school和detail.school指向同一个对象，引用相同，一个值被修改那么另一个同样被修改
```
这也就是告诉我们，如果你要对整个state对象进行处理，那么你一定要深度拷贝，而不是浅层次的拷贝，因为Object.assign这种类型会导致copy后的结果发送变化，而`源对象`也是会变化的。下面我再给出一个例子：

```js
onChange = (relation)=>{
   this.setState({ownRelationship:relation});
   this.props.onSave&&this.props.onSave(Transform2RawRelationship(deepCopy(this.state.ownRelationship)));
 }
```
我先给出场景：假如我们每次删除一行数据的时候都会调用onChange函数，而onChange回调函数会接收到最新的`删除了特定行的数据的对象`。我们此处就是直接将state.ownRelationship设置为最新的对象。但是，除了设置state.ownRelationship以外，我们还会将最新的对象通知给上层的组件，于是我们直接调用了onSave方法，这里的逻辑本来很清楚，但是你仔细看看这一句代码:

```js
 this.props.onSave&&this.props.onSave(Transform2RawRelationship(deepCopy(this.state.ownRelationship)));
```
你的关注点应该是在`Transform2RawRelationship`方法上，它首先对`this.state.ownRelationship`做了一次深度拷贝，然后将调用`Transform2RawRelationship`方法的结果传递给上层组件。那么你肯定会问，为什么要做深度拷贝？

解答：如果我们不做深度拷贝，那么在方法`Transform2RawRelationship`中我们无法确保其是否对`this.state.ownRelationship`做了改变，以及做了改变后这个数据是否会导致render方法得到的数据不满足组件指定的格式从而报错，从而报错，从而报错!

那么做一次浅层次的复制是否可以？

解答：不可以。就像文章第一个例子展示的情况，我们虽然使用Object.assign做了一次浅层次的复制，但是当我们在方法`Transform2RawRelationship`中对shallowCopy(this.state.ownRelationship)的引用数据做了修改，那么原来的this.state.ownRelationship也会发生改变，从而有可能导致数据不是组件渲染需要的格式(因为setState后组件重新渲染，但是this.state.ownRelationship可能已经被污染了，即被Transform2RawRelationship默默的修改掉了，从而不是组件需要的渲染数据)

#### 例子2
```js
import '_' from 'lodash';
const Component = React.createClass({
  getInitialState() {
    return {
      data: { times: 0 }
    }
  },
  handleAdd() {
    let data = this.state.data;
    //data和this.state.data指向了同一个数据，即data:{times:0}这个引用类型
    data.times = data.times + 1;
    //此时你会发现我们的this.state.data和data.times都会发生变化了，因为他们指向同一个引用
    this.setState({ data: data });
    //我们此时的data还是原来的data，只是其times属性值发生变化了，所以SCU判断的时候要小心
    console.log(this.state.data.times);
    //此时this.state.data.times是已经修改后的数据了
  }
}
```
盗用别人的一个例子只是为了说明，如果是引用类型的时候不管是浅层次的拷贝，还是压根不拷贝都是很可能产生副作用的。所以上面的代码我们经常会做一次深拷贝，一方面是为了保持state的不可变特性，还有另一方面就是为了使得SCU(shouldComponentUpdate)能够正常判断，而不是两次nextProps或者nextState指向同一个引用。

```js
import '_' from 'lodash';

const Component = React.createClass({
  getInitialState() {
    return {
      data: { times: 0 }
    }
  },
  handleAdd() {
    let data = _.cloneDeep(this.state.data);
    data.times = data.times + 1;
    this.setState({ data: data });
    // 如果上面不做 cloneDeep，下面打印的结果会是已经加 1 后的值。
    console.log(this.state.data.times);
  }
}
```






参考文献:

[如何有效地提高react渲染效率--深复制，浅复制，immutable原理](http://blog.csdn.net/u010977147/article/details/61195784)

[Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)
