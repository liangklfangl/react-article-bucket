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
盗用别人的一个例子只是为了说明，如果是引用类型的时候不管是浅层次的拷贝，还是压根不拷贝都是很可能产生副作用的。所以上面的代码我们经常会做一次深拷贝，一方面是为了保持state的不可变特性，还有另一方面就是为了使得SCU(shouldComponentUpdate)能够正常判断，而不是两次nextProps或者nextState指向同一个引用。这也是为什么react官方建议将state设置为不可变的原因。

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

### React中引用类型导致组件不更新
首先看下面的例子：
```js
  class Parent extends React.Component{
   state = {
     school:{
       location:"Dalian",
       name :"DLUT"
     }
   }
   onClick =()=>{
    this.setState({school:{location:"HUNan",name:"湖南大学"}});
    // const newSchool = this.state.school;
    // newSchool.location = "HUNan";
    // this.setState({school:newSchool});
   }
   render(){
       return (
         <div>
        <Child school={this.state.school}/>
        <button onClick={this.onClick}>点击我改变state</button>
      </div>
     )
   }
  }
  class Child extends React.Component{
    shouldComponentUpdate(nextProps,nextState,nextContext){
      return true;
    }
     render(){
       return (
         <div>
        学校名称:{this.props.school.name}
      学校位置:{this.props.school.location}
       <\/div>
     )
   }
  }
      ReactDOM.render(
        <Parent/>,
        document.getElementById('example')
      );
```
我们通过this.state.school将上层组件的一个引用传入到子组件中，于是子组件就可以拿到这个上层组件的引用了。当我们点击按钮修改state的时候，即调用下面的逻辑：

```js
this.setState({school:{location:"HUNan",name:"湖南大学"}});
```
如果你在Child组件的SCU方法中做如下判断，那么判断的结果就是false:

```js
 console.log('this.props.school===nextProps.school',this.props.school===nextProps.school);
```
原因在于，我们其实是采用了一个新的对象来`替换原来的this.state.school中的对象，所以导致this.state.school的引用已经发生变化了`。所以下面组件接受到的this.props.school和nextProps.school`并不是指向同一个引用`，因此上面返回了false。

但是如果你将上面setState用下面几句代码替代，问题就会出现了

```js
 const newSchool = this.state.school;
  newSchool.location = "HUNan";
  this.setState({school:newSchool});
 //其实newSchool和this.state.school指向的是同一个引用(即指针)，因此导致下层组件接受到的this.props.school依然是同一个引用。即，此时我们的变量newSchool保存的是引用而不是一个对象，不过其引用的值指向的是该对象
```
此时我们的下面的判断就会得到true:

```js
 console.log('this.props.school===nextProps.school',this.props.school===nextProps.school);
```
原因很简单：在父组件中通过newSchool保存了一个`指针`，这个指针和this.state.school这个指针指向的对象是完全相同的。当你通过this.setState({school:newSchool})重置this.state.school的值的时候，其实你将school设置的内存地址newSchool和当前的this.state.schoo的内存地址是完全一样的，所以导致this.props.school和nextProps.school的内存地址是完全一样的。通过这个例子你要明白：this.props.school和nextProps.school的内存地址完全一样(newSchool只是this.state.school`指针的一个copy`)是导致组件不会重新渲染的罪魁祸首。你可以通过深度拷贝或者immutable(如果对象改变，那么会得到一个不一样的引用，而没有变化的部分结构依然可以共享)来完成组件重新渲染。同时，你也要注意到，通过下面这种方式来改变state组件是会重新渲染的，因为地址已经发生改变:

```js
this.setState({school:{location:"HUNan",name:"湖南大学"}});
```

### immutable.js的简单例子

```js
   var map1 = Immutable.Map({a:1, b:2, c:3,school:{
        location:"DaLian",
        name :"DLUT"
     }});
   var map2 = map1.set('b', 50);
    //(1)我这里仅仅设置了b的值，那么其他的值都会共享
    console.log('引用相等',map1===map2);
    //(2)immutable.js中每次返回的引用都是不一样的，此处返回false
    console.log('school的引用没有变化',map2.school===map1.school);
    //(3)immutable.js中没有变化的对象将会共享，所以此处返回true
    var map3 = {a:1,b:2,c:3}
    var map4 = map3;
    //(4)map4拿到的是map3的指针，所以一个变化后另外一个也会变化，但是变化的是值，引用本身是不变化的，所以map3===map4返回true
    map4.c =4;
    console.log('map3===map4',map3===map4);
```
因此在immutable.js中你常常会看到这样的SCU：

```js
import { is } from 'immutable';
shouldComponentUpdate: (nextProps = {}, nextState = {}) => {
  const thisProps = this.props || {}, thisState = this.state || {};
  if (Object.keys(thisProps).length !== Object.keys(nextProps).length ||
      Object.keys(thisState).length !== Object.keys(nextState).length) {
    return true;
  }
  for (const key in nextProps) {
    if (!is(thisProps[key], nextProps[key])) {
      return true;
    }
  }
  for (const key in nextState) {
    if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
      return true;
    }
  }
  return false;
}
```
其主要通过immutable.js的is方法来判断数据是否发生变化，Immutable.js提供了简洁高效的判断数据是否变化的方法，只需 === 和 is比较就能知道`是否需要执行render()`，而这个操作几乎0成本，所以可以极大提高性能。所以如果我们有如下的组件树:

![](https://camo.githubusercontent.com/85bcf6a09c811f9e68b729557726504ac008d18e/687474703a2f2f696d672e616c6963646e2e636f6d2f7470732f69332f54423156696e704b58585858585841587058585a5f4f644e4658582d3731352d3332342e706e67)

而且我们的`props`是从最顶层组件往下传递的，那么对于整个组件树中的组件不会`都要求重新渲染`。而渲染的只会是绿色的部分，因为只有这部分的数据发生改变，按照immutable.js的实现，只有在`变化的节点以及父节点的引用`会发生变化，从而要求重新渲染。


参考文献:

[如何有效地提高react渲染效率--深复制，浅复制，immutable原理](http://blog.csdn.net/u010977147/article/details/61195784)

[Immutable 详解及 React 中实践](https://github.com/camsong/blog/issues/3)

[react组件性能优化探索实践](http://www.imweb.io/topic/577512fe732b4107576230b9)

[正式学习 React（三）番外篇 reactjs性能优化之shouldComponentUpdate](http://www.cnblogs.com/huenchao/p/6096254.html)
