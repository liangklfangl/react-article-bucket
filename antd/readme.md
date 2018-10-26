#### 1.如何更新表格的某一条数据并要求组件重新渲染
我们有时候会要求更新表格的某一条数据并要求对组件进行重新渲染，比如一个常用的场景如`"上线/下线"`操作。此时我们可以通过下面的方式来完成:

```js
  //修改该条记录的上线和下线的状态
   const newItem = update(item,{status:{
        $set:wantStatus
      }});
 //其中newItem就是你对该条数据进行了更新后的结果
      this.setState(update(this.state,{
         dataSource:{
           $splice:[
             [index,1,newItem]
           ]
         }
      }))
```
上面这句代码表示将this.state.dataSource中下标为index的哪行记录设置为一个新的值，即newItem。对于上面的$splice的用法，你可以参考我在[react-dnd中的写法](../react-dnd/cancelDropOuside/Container.js)，替换成为下面的形式:

```js
 this.setState(update(this.state,{
         dataSource:{
           $splice:[
             [index,1],
             [index,0,newItem]
           ]
         }
      }))
```
此处我讲解一下react-dnd中的例子：

```js
/**
  * 移动card
  * props.moveCard(draggedId, overIndex)
  * @param  {[type]} id     被拖动的元素的id值
  * @param  {[type]} atIndex DropTarget即hover的那个Card的id值
  * @return {[type]}         [description]
  */
  moveCard(id, atIndex) {
    const { card, index } = this.findCard(id);
    //找到被拖动的Card的属性，如：
    // {
    //   id: 4,
    //   text: 'Create some examples',
    // }
   //以及该card在this.state.cards中的下标值
    this.setState(update(this.state, {
      cards: {
        $splice: [
          [index, 1],
          //首先删除我们的DragSource，同时在我们DragTarget前面插入我们的DragSource
          [atIndex, 0, card],
        ],
      },
    }));
  }
```
其中参数id表示移动的那个卡片的id值，而atIndex表示要drop的那个卡片的id，所以我们首先删除我们的DragSource，然后在DragTarget前面插入我们的DragSource。如果你使用antd那么你只要关注render方法就能够很容易的知道当前的表格行的index:

```js
render(text, record, index) {

}
```

#### 2.弹窗使用componentDidMount替代componentWillReceiveProps
对于弹窗来说，使用componentDidMount比componentWillReceiveProps要好的多。所以当存在一种情况,即编辑和添加一条记录`共用弹窗`的情况下，我们就会遇到两者选择的问题。但是对于两者来说，不管是添加还是编辑可以通过一个字段来决定，比如data,在编辑的时候data为该条记录的值，而添加的时候data为null。这个data可以作为props传入到弹窗组件中，进而在弹窗组件中通过this.props.data来对该条记录处理。就像我开头说的，即可以通过componentWillReceiveProps也可以通过componentDidMount来处理，但是在componentWillReceiveProps中要复杂的多：

- setState调用的时候我们的componentWillReceiveProps也会被调用（这是因为弹窗在首次渲染的时候会被挂载，后续在组件中setState会导致弹窗的数据也会发生改变），所以在弹窗内部如果存在维护state的情况下就显得比较尴尬，因为外层组件每次setState都会导致外层组件的state发生变化，从而触发弹窗的componentWillReceiveProps方法

```js
class Outer extends React.Component{
  //外层组件setState一般都会导致内层弹窗Modal组件props改变，从而触发componentWillReceiveProps
   render(){
     <div>
        <Modal><\/Modal>
     <\/div>
   }
}
```

- componentWillReceiveProps每次收到的nextProps都是打开弹窗的值，即该条记录的值，而不会随着外层组件的setState调用而发生改变(如果弹窗接受的那一部分的数据没有变化)。而为了导致外层组件每次的值的改变我们就会使用this.state来维护，而这就会陷入第一种情况的问题

基于以上两种原因，我们一般会使用componentDidMount来取代componentWillReceiveProps，而取代的方式就是给弹窗一个key，而这个key每次的都是变化的，所以自然而然想到了visibile，即弹窗的可见性：

```js
  <Popup visible={this.state.popupVisible} key={this.state.popupVisible}>
  <\/Popup>
```
这样，每次打开弹窗和关闭弹窗都会是一个完全不同的`弹窗对象`，所以你可以安心的在`componentDidMount`中处理逻辑。比如，编辑的时候给弹窗传入该条记录作为this.props而添加的时候传入data=null。此处我需要给你看看使用antd的Table的时候是如何的:

```js
{
    title: '操作',
    key: 'action',
    render: (item,record,index) => (
      <div>
        <a onClick={() => this.edit(item)}>编辑</a>
     </div>
    ),
  }
```
`虽然Table中的dataSource中并没有action这一行`，但是我们依然可以为该行实例化一个`编辑`操作，而render方法中会传入该条记录本身，以及该记录的index。

#### 3.选中Select的option的时候填充的是key
此时你只要学会使用两个Select的属性即可，即`name`和`optionLabelProp`。前者为每一个Option都添加一个name属性，其值表示对象的value值(即keyValues对象的value)，而在Select中通过指定optionLabelProp为`'name'`就可以显示Option中通过name指定的值了。

```js
const keyValues =  {
          "name1": "value1",
          "name2": "value2",
        }
const categoryOptions = Object.keys(keyValues).map((option,index)=>{
  //value是发送到服务端的内容
  return <Option key={index} name={keyValues[option]} value={option}>
  {
      keyValues[option]
  }<\/Option>
})
<Select optionLabelProp={'name'}  optionFilterProp={"children"}  mode="combobox"  placeholder="请选择分类">
<\/Select>
```

#### 4.如何将数组中某一个对象的值修改并让组件进行更新
```js
this.setState(update(this.state,{
    checkShowObj:{
      // {$splice: array of arrays}
      // for each item in arrays call splice() on the target with the parameters provided by the item
      $splice:[[index,1,{
        isShow:true,
        index:index
      }]]
    }
  }))
```
此时将我们的index下标的元素替换为一个新的元素，当然其作用和下面的代码是相同的:

```js
 update.extend('$auto', function(value, object) {
  //注意：这里做了一个判断，如果更新的这个对象存在那么直接在这个对象上更新，否则对一个空对象更新并返回结果
    return object ?
      update(object, value):
      update({}, value);
  });
 //第一个参数表示调用$autoArray的时候传入的值，即需要更新成为的值，而object表示原始的值即没有更新之前的。注意，这里都是调用update来完成数据更新的，update会返回更新后的值
  update.extend('$autoArray', function(value, object) {
    return object ?
      update(object, value):
      update([], value);
  });
 this.setState(update(this.state,{
    checkShowObj:{
      //注意：这里使用$auto也是可以的
      $autoArray:{
        //注意：这里的[index]表示变量而不是key为"index"字符串。通过这种方式，即数组下标的方式可以修改数组中某一个值
        [index] : {
         $set:{
           isShow:true,
           index:index
         }
        }
      }
    }
  }))
```
这里讲到了自定义的命令，我们下面来看一个例子:

```js
//所以自定义命令的时候接受两个参数，其中第一个参数表示调用命令的时候传入的值(即特定更新路径的值)，如此时的$addtax:0.8(路径为['price'])，而我们的original就是更新的原始数据的price为123(原始路径也是['price'])
update.extend('$addtax', function(tax, original) {
  return original + (tax * original);
});
const state = { price: 123 };
//original表示需要更新的这个数据的相应的属性的值
const withTax = update(state, {
  price: {$addtax: 0.8},
});
assert(JSON.stringify(withTax) === JSON.stringify({ price: 221.4 }));
```
其中自定义命令的第一个参数表示当前调用命令传入的值，而第二个参数表示`更新之前的原始的值`。此处original表示的就是state.price即`123`。但是，如果你的price是一个对象，那么你要对这个对象进行修改之前必须做一次`shallow clone`。如果你觉得克隆比较麻烦，那么你依然可以使用`update`来完成。

```js
return update(original, { foo: {$set: 'bar'} })
```

如果你不想在全局的update上进行操作，那么你可以自己创建一个update的副本，然后对这个副本进行操作，如下:

```js
import { newContext } from 'immutability-helper';
const myUpdate = newContext();
myUpdate.extend('$foo', function(value, original) {
  return 'foo!';
});
```
针对上面的$auto和$autoArray方法，我们再给出下面的例子:

```js
update.extend('$auto', function(value, object) {
  return object ?
    update(object, value):
    update({}, value);
});
update.extend('$autoArray', function(value, object) {
  return object ?
    update(object, value):
    update([], value);
});
var state = {}
var desiredState = {
  foo: [
    {
      bar: ['x', 'y', 'z']
    },
  ],
};
var state2 = update(state, {
  foo: {$autoArray: {
    0: {$auto: {
      bar: {$autoArray: {$push: ['x', 'y', 'z']}}
    }}
  }}
});
console.log(JSON.stringify(state2) === JSON.stringify(desiredState)) // true
```
通过上面两个例子我是要告诉你，如果你使用$autoArray的话，你可以对数组进行更新，更新特定的元素。但是如果你是要更新一个特定的下标可以采用`[index]`这种方式，而不需要仅仅采用`0/1`类似的下标。

#### 5.弹窗的SCU方法没有被调用
```js
shouldComponentUpdate(nextProps,nextState){
   if(nextProps.visible===false){
    return false;
   }
   return true;
 }
```
一个可能的原因在于：你为弹窗指定了一个key，每次属性发生变化都是生成一个全新的弹窗，而不是更新弹窗，所以SCU不会调用

#### 6.React的事件机制深入理解
记住下面的规则就可以了:

(1)第一步:原生事件和React事件是两套事件体系，互不干扰。Native事件冒泡的时候会不断到父级节点，所以父级节点的所有事件会被执行，但是document除外，即绑定到document上的原生事件在这一步不会执行

(2)第二步:因为React事件是直接绑定到document上的，所以这一步会执行React事件，因为此时已经冒泡到document上，所以直接执行document上的React事件即可。事件会按照[组件树]的嵌套来进行冒泡。但是，绑定到document上的原生事件在这一步不会执行

(3)第三步:执行document上的Native事件，即最后一步是执行document上的Native事件

请看下面的例子:

```js
class App extends React.Component {
  componentDidMount(){
    document.addEventListener('click',function(e){
      console.log('App native Event fired');
    });
  }
  render(){
   return <GrandPa />;
  }
}

class GrandPa extends React.Component {
  constructor(props){
      super(props);
      this.state = {clickTime: 0};
      this.handleClick = this.handleClick.bind(this);
  }
  
 handleClick(){
   console.log('React Event grandpa is fired');
  this.setState({clickTime: new Date().getTime()})
};
//可以阻止React事件冒泡到原生事件，但是原生事件本身的冒泡是不能阻止的。 
//原生事件继续接收到
  componentDidMount(){
  document.getElementById('grandpa').addEventListener('click',function(e){
      console.log('native Event GrandPa is fired');
    })
  }
  
  render(){
    return (
      <div id='grandpa' style={{border:'1px solid yellow'}} onClick={this.handleClick}>
        <p>GrandPa Clicked at: {this.state.clickTime}</p>
        <Dad />
      </div>
    )
  }
}
/*
*(1)第一步:原生事件和React事件是两套事件体系，互不干扰。Native事件冒泡的时候会不断到父级节点，所以父级节点的所有事件会被执行，但是document除外，即绑定到document上的原生事件在这一步不会执行
*(2)第二步:因为React事件是直接绑定到document上的，所以这一步会执行React事件，因为此时已经冒泡到document上，所以直接执行document上的React事件即可
*(3)第三步:执行document上的Native事件，即最后一步是执行document上的Native事件
*/
class Dad extends React.Component {
  constructor(props){
    super(props);
    this.state = {clickTime:0};
    this.handleClick=this.handleClick.bind(this);
  }
 
  //Dad组件也会接受到原生事件，但是在原生事件中并没有阻止冒泡，所以原生事件还是会继续往上冒泡，所以GrandParent会接续接受到事件
  componentDidMount(){
  document.getElementById('dad').addEventListener('click',function(e){
      console.log('native Event Dad is fired');
     // e.stopPropagation();
    })
  }
  
  //我们这里的React事件不会继续往上冒泡了，即父级组件是接受不到这个事件的
  handleClick(e){
    e.stopPropagation();
    //防止React事件往父级React组件冒泡
   e.nativeEvent.stopImmediatePropagation();
    //防止React事件冒泡到原生事件,如document上的事件，如果document上绑定了一个事件
    console.log('React Event Dad is fired')
    this.setState({clickTime: new Date().getTime()})
  }
  
  render(){
    return (
      <div id='dad' style={{border:'1px solid blue'}} onClick={this.handleClick}>
       <p>Dad Clicked at: {this.state.clickTime}</p>
        <Son/>
      </div>
     )
  }
}

class Son extends React.Component {
  constructor(props){
    super(props);
    this.state = {clickTime:0};
    this.handleClick=this.handleClick.bind(this);
  }
  //React会接受到我们自己的事件
  handleClick(){
    console.log('React Event Son is fired');
    this.setState({clickTime: new Date().getTime()})
  }
  componentDidMount(){
    //原生事件肯定不断往上冒泡
  document.getElementById('son').addEventListener('click',function(e){
      console.log('native Event son is fired');
    })
  }
  
  render(){
    return (
      <div id="son" style={{border:'1px solid red'}}>
       <p onClick={this.handleClick} style={{border:'1px solid black'}}>Son Clicked at: {this.state.clickTime} </p>
      </div>
     )
  }
}

ReactDOM.render(<App />, mountNode);
```
此时打印的结果如下:
<pre>
native Event son is fired
native Event Dad is fired
native Event GrandPa is fired
React Event Son is fired
React Event Dad is fired
</pre>

其中前三次输出的是不是绑定到document上的native事件，而后两次的输出分析如下:

在`Dad`组件中，我们调用了如下方法:
```js 
handleClick(e){
    e.stopPropagation();
    //防止React事件往父级React组件冒泡
   e.nativeEvent.stopImmediatePropagation();
    //防止React事件冒泡到原生事件,如document上的事件，如果document上绑定了一个事件
    console.log('React Event Dad is fired')
    this.setState({clickTime: new Date().getTime()})
  }
```
`stopPropagation`方法使得我们的React事件不会继续冒泡到父级组件，所以GrandPa组件的handleClick并没有调用。同时，stopImmediatePropagation会使得`绑定到document上的Native事件`也不会被调用。所以上面的结果也就容易理解了。你可以查看这里的[源代码](https://riddle.alibaba-inc.com/riddles/9672a38?mode=jsx),其实只要记住我上面总结的三个规则就可以了。但是如果我们将Dad组件的handleClick修改为如下内容:

```js
//我们这里的React事件不会继续往上冒泡了，即父级组件是接受不到这个事件的
  handleClick(e){
    e.stopPropagation();
    console.log('React Event Dad is fired')
    this.setState({clickTime: new Date().getTime()})
  }
```
此时输出如下:

<pre>
native Event son is fired
native Event Dad is fired
native Event GrandPa is fired
React Event Son is fired
React Event Dad is fired
App native Event fired
</pre>

根据我上面的总结的步骤，前三次输出很好理解，而第二步就会执行React事件，但是因为我们调用了stopPropagation，所以Dad组件的所有的父级React组件的都不会接受到React事件了(虽然所有的React组件的事件都是绑定到document上的，但是stopPropagation依然可以阻止冒泡到父级组件)。但是，在第三步，我们的document上的原生事件还是会调用的，因为我们没有调用stopImmediatePropagation。这就是上面六次输出的结果分析。

更加深入一步，我们将函数修改为如下:
```js
 handleClick(e){
   e.nativeEvent.stopImmediatePropagation();
    console.log('React Event Dad is fired')
    this.setState({clickTime: new Date().getTime()})
  }
```
此时输出的结果如下：

```js
native Event son is fired
native Event Dad is fired
native Event GrandPa is fired
React Event Son is fired
React Event Dad is fired
React Event grandpa is fired
```
此时我们没有调用stopPropagation，所以所有React父级组件都能够接受到React事件，但是因为调用了e.nativeEvent.stopImmediatePropagation()，所以绑定到document上的原生事件会被阻止掉。

#### 7.React点击遮罩隐藏弹窗(React冒泡)
通过下面的例子你就很容易理解了:
```js
import { Modal, Button } from 'antd';
class App extends React.Component {
  state = { visible: true }
  componentDidMount(){
   //(2)点击遮罩的时候，document会接受到我们的click事件，然后将弹出关闭
    document.onclick = ()=>{
      this.setState({
         visible:false
      })
    }
  }
  onCancel=(e) =>{
    console.log('onCancel调用');
    //e.nativeEvent.stopImmediatePropagation();
  }
  //(1)点击遮罩的时候我们不允许关闭
  render() {
    return (
      <div>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          style={{border:'1px solid red'}}
          onCancel={this.onCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
ReactDOM.render(<App />, mountNode);
```
此时你会发现，当你点击遮罩的时候，我们document上的onclick会被调用，从而使得弹窗能够正常关闭。如果你了解上面我讲的冒泡流程你就很容易理解了。但是如果你添加stopImmediatePropagation就可以发现我们的弹窗无法关闭了,因为stopImmediatePropagation会阻止原生document上的事件。

#### 8.Antd的Select的滚动定位问题
记得采用下面的getPopupContainer来解决:

```js
const {
  Select
} = antd;
const Option = Select.Option;

var Hello = React.createClass({
  render() {
    return <div style={{margin: 10, overflow: 'scroll', height: 200}}>
      <h2>修复滚动区域的浮层移动问题</h2>
      <div style={{padding: 100, height: 1000, background: '#eee', position: 'relative' }} id="area">
        <h4>可滚动的区域</h4>
        <Select defaultValue="lucy" style={{ width: 120 }} getPopupContainer={() => document.getElementById('area')}>
          <Option value="jack">Jack</Option>
          <Option value="lucy">Lucy</Option>
          <Option value="yiminghe">yiminghe</Option>
        </Select>
      </div>
    </div>;
  }
});

ReactDOM.render(<Hello />,
  document.getElementById('container')
);
```

#### 9.使用react-copy-to-clipboard对于tooltip状态的切换
请看下面的代码:
```js
handleCodeCopied=(text,result)=>{
    if(result){
      this.setState({
        copied:true
      })
    }
  }
//(1)移动到Tooltip:此时Tooltip可见，我们将this.state.copied设置为false，防止受到上一次copy的影响，即每次都可以copy,同时移动上去的时候copyTooltipVisible为true表示Tooltip一直显示
//(2)移出Tooltip:此时将copyTooltipVisible设置为false表示不可见
onCopyTooltipVisibleChange=(visible)=>{
    if (visible) {
      this.setState({
        copyTooltipVisible: visible,
        copied: false
      });
      return;
    }
    this.setState({
      copyTooltipVisible: visible
    });
  }
   <CopyToClipboard
      text={js}
      onCopy={this.handleCodeCopied}
    >
      <Tooltip
        visible={this.state.copyTooltipVisible}
        onVisibleChange={this.onCopyTooltipVisibleChange}
        title={this.state.copied ? "copied" : "copy"}
      >
        <Icon
          type={
            //用户点击了复制，同时当前Tooptip可见我就会设置为check
            this.state.copied && this.state.copyTooltipVisible ? (
              "check"
            ) : (
              "copy"
            )
          }
          className="code-box-code-copy"
        />
      </Tooltip>
    </CopyToClipboard>
```

#### 10.antd的cascader动态加载数据的解决方法
解答：可以不使用我们的loadData，也不使用我们的showSearch，从而让我们的Cascader允许动态加载数据。依赖的antd@2.13.1版本，我们只需要将antd依赖的rc-cascader中[Cascader.js](https://github.com/fis-components/rc-cascader/blob/master/lib/Menus.js)中的代码修改如下:
```js
_this.handleMenuSelect = function (targetOption, menuIndex, e) {
  if (e && e.preventDefault) {
    e.preventDefault();
  }
 // 此处禁止了所有的键盘事件
}
```
因为这个方法会在keyDown中被调用:
```js
_this.handleKeyDown = function (e) {
      if (e.keyCode !== _KeyCode2["default"].DOWN && e.keyCode !== _KeyCode2["default"].UP && e.keyCode !== _KeyCode2["default"].LEFT && e.keyCode !== _KeyCode2["default"].RIGHT && e.keyCode !== _KeyCode2["default"].ENTER && e.keyCode !== _KeyCode2["default"].BACKSPACE && e.keyCode !== _KeyCode2["default"].ESC) {
        return;
      }
      // Press any keys above to reopen menu
      if (!_this.state.popupVisible && e.keyCode !== _KeyCode2["default"].BACKSPACE && e.keyCode !== _KeyCode2["default"].ESC) {
        _this.setPopupVisible(true);
        return;
      }
      if (e.keyCode === _KeyCode2["default"].DOWN || e.keyCode === _KeyCode2["default"].UP) {
        var nextIndex = currentIndex;
        if (nextIndex !== -1) {
          if (e.keyCode === _KeyCode2["default"].DOWN) {
            nextIndex += 1;
            nextIndex = nextIndex >= currentOptions.length ? 0 : nextIndex;
          } else {
            nextIndex -= 1;
            nextIndex = nextIndex < 0 ? currentOptions.length - 1 : nextIndex;
          }
        } else {
          nextIndex = 0;
        }
        activeValue[currentLevel] = currentOptions[nextIndex].value;
      } else if (e.keyCode === _KeyCode2["default"].LEFT || e.keyCode === _KeyCode2["default"].BACKSPACE) {
        activeValue.splice(activeValue.length - 1, 1);
        //如果是回退按键，那么还是让他显示
      } else if (e.keyCode === _KeyCode2["default"].RIGHT) {
        if (currentOptions[currentIndex] && currentOptions[currentIndex].children) {
          activeValue.push(currentOptions[currentIndex].children[0].value);
        }
      } else if (e.keyCode === _KeyCode2["default"].ESC) {
        _this.setPopupVisible(false);
        return;
      }
      if (!activeValue || activeValue.length === 0) {
        _this.setPopupVisible(false);
      }
      var activeOptions = _this.getActiveOptions(activeValue);
      var targetOption = activeOptions[activeOptions.length - 1];
      _this.handleMenuSelect(targetOption, activeOptions.length - 1, e);
      //注意：此处被调用，所以导致我们没法在文本框中删除元素，也不能输入元素
      if (_this.props.onKeyDown) {
        _this.props.onKeyDown(e);
      }
    };
```
但是这样会引入一个bug，即如果上一次选中了cascader的第二级，然后删除完成，继续点击Enter按键，此时会多显示一个空白面板，解决方法其实就是隐藏空白的ul面板而已:
```css
ul:empty{
    display: none;
    //建议在组件外层再套上一个选择器
}
```
所以我们最后通过接口获取Cascader选项就会是如下的形式:
```js
render() {
    return (
      <span>
        <Cascader
          allowClear={true}
          options={this.state.options}
          //和antd接受的options参数一致
          onChange={this.onChange}
          //onChange方法通知外部表单我们的Form.Item的值已经发生变化，但是使用的时候必须通过getFieldDecriptor包装过
        >
          <Input
            placeholder="请输入名称搜索"
            onPressEnter={this.onSearch}
            //当你点击Enter的时候我们调用接口继续搜索
            defaultValue={
              (this.props.idPath && this.props.idPath.split(",")) || []
            }
            ref={input => {
              this.textInput = input;
            }}
          />
        </Cascader>
      </span>
    );
  }
```
其中onChange方法如下:
```js
onChange = (value, selectedOptions) => {
    const searchValue = ReactDOM.findDOMNode(this.textInput);
    searchValue.value = selectedOptions.map(o => o.label).join(", ");
    //设置我们的Input的值，即回填数据到Input给用户展示
    const optionsLength = selectedOptions.length;
    this.nowId = selectedOptions[optionsLength - 1].id;
    const onChange = this.props.onChange;
    //将所属层级通知外部表单，所以这个组件本身可以放到我们的Form.Item中
    if (onChange) {
      onChange(this.nowId);
    }
  };
```
建议先了解一下[antd的自定义表单控件](https://codepen.io/pen/?&editors=001)。有一点需要注意，如果你的自定义控件放到Form中表单提交的时候没有提交到服务端，那么很可能是因为你在你的控件外面又包裹了一个元素，即你的组件不是getFieldDecorator里面的唯一元素，如:
```js
<FormItem
    validateStatus={passwordError ? 'error' : ''}
    help={passwordError || ''}
  >
    {getFieldDecorator('password', {
      rules: [{ required: true, message: 'Please input your Password!' }],
    })(
       <div>
          <SearchCascade dataScene={getUrlParam("dataScene")} /> 
       </div>
    )}
  </FormItem>
```
应该修改为如下内容,即去掉自定义控件外层的div包裹而将自定义控件作为唯一的一个子元素:
```js
<FormItem
    validateStatus={passwordError ? 'error' : ''}
    help={passwordError || ''}
  >
    {getFieldDecorator('password', {
      rules: [{ required: true, message: 'Please input your Password!' }],
    })(
          <SearchCascade dataScene={getUrlParam("dataScene")} /> 
    )}
  </FormItem>
```
而且写自定义控件的时候还有一点要注意，那就是当你修改里面的元素的时候不管你自己有没有调用setState，Form本身都是会发生一次重新渲染的(即使你在Form里面包裹了一个textarea,当你在textarea中输入值的时候你也会发现Form所在的组件会发生重新渲染)。所以，如果你写了componentWillReceiveProps的时候你可能会莫名其妙的发现多了一次调用，特别是当有接口请求的时候。所以，一个好的方式就是通过修改componentWillReceiveProps来完成，如果两次的某一个props不同那么就不重新渲染，所以你可能会看到如下的组件:
```js
export default class CascaderSearch extends React.Component {
  state = {
    options: []
  };
  defaultValue =   this.props.idPath && this.props.idPath.split(",")|| [];
  componentDidMount() {
    IO.get(URL, {
      dataScene: this.props.dataScene || "",
    })
      .then(response => {
        const data = response.data;
        this.setState({
          options: data
        });
      })
      .catch(e => {
        console.log("失败", e);
      });
  }

  componentWillReceiveProps(nextProps){
    //(1)一定要有这一次判断,否则你可能会发生问题
    if(nextProps.dataScene !== this.props.dataScene){
      this.defaultValue = nextProps.idPath && nextProps.idPath.split(",")|| [];
      IO.get("/tag/level/tree.htm", {
        dataScene: nextProps.dataScene || "",
      })
        .then(response => {
          const data = response.data;
          this.setState({
            options: data,
          });
        })
        .catch(e => {
          console.log("失败", e);
        });
    }
  }
  onChange = (value, selectedOptions) => {
    this.defaultValue = selectedOptions.map(o => o.label);
    const optionsLength = selectedOptions.length;
    this.parentId = selectedOptions[optionsLength - 1].id;
    const onChange = this.props.onChange;
    //(2)将所属层级通知为外部表单
    if (onChange) {
      onChange(this.parentId);
    }
  };

  render() {
    const { options } = this.state;
    return (
      <Cascader
        options={options}
        value={this.defaultValue}
        onChange={this.onChange}
        showSearch
        allowClear={true}
        changeOnSelect
      />
    );
  }
}
```


#### 11.模拟React的点击事件
```js
  fireKeyEvent=(el, evtType, keyCode)=>{
    var doc = el.ownerDocument,
        win = doc.defaultView || doc.parentWindow,
        evtObj;
    if(doc.createEvent){
        if(win.KeyEvent) {
            evtObj = doc.createEvent('KeyEvents');
            evtObj.initKeyEvent( evtType, true, true, win, false, false, false, false, keyCode, 0 );
        }
        else {
            evtObj = doc.createEvent('UIEvents');
            Object.defineProperty(evtObj, 'keyCode', {
                get : function() { return this.keyCodeVal; }
            });
            Object.defineProperty(evtObj, 'which', {
                get : function() { return this.keyCodeVal; }
            });
            evtObj.initUIEvent( evtType, true, true, win, 1 );
            evtObj.keyCodeVal = keyCode;
            if (evtObj.keyCode !== keyCode) {
                console.log("keyCode " + evtObj.keyCode + " 和 (" + evtObj.which + ") 不匹配");
            }
        }
        el.dispatchEvent(evtObj);
    }
    else if(doc.createEventObject){
        evtObj = doc.createEventObject();
        evtObj.keyCode = keyCode;
        el.fireEvent('on' + evtType, evtObj);
    }
}
  ReactTestUtils.Simulate.click(node);
  ReactTestUtils.Simulate.keyDown(node);
  ReactTestUtils.Simulate.change(node);
  ReactTestUtils.Simulate.focus(node);
  //下面模拟js原生事件
  this.fireKeyEvent(node, 'keydown', 13);
  this.fireKeyEvent(node, 'keydown', 1);
```

#### 12.Form.Item在同一行显示说明文字
解决：其实很简单的代码如下:
```js
const formLayout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};
  <FormItem {...formLayout} label="业务场景">
        {getFieldDecorator("name", {
          initialValue: '罄天',
          rules: [{ required: true, message: "请输入名字" }]
        })(
          <Select style={{width:'300px'}} onChange={this.businessChange}>{businessScene}</Select>
        )}
         <span className="text-red" style={{marginLeft:'20px'}}>如果不选，则表示你是罄天本人哦</span>
    </FormItem>
```
很显然label占据了6列，而内容占据了18列，内容就是Select框的宽度。所以，如果你将Select定宽了，那么后面的文字就可以同行显示了。

#### 13.moment时间相关
- 本日本周的时间获取
```js
generateTimeStamp = type => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const startWeek = moment()
      .startOf("week")
      .format("YYYY-MM-DD");
    const endWeek = moment()
      .endOf("week")
      .format("YYYY-MM-DD");
    if (type == 2) {
      //今日
      const startDateString = `${year}-${month}-${day} 00:00:00`;
      const endDateString = `${year}-${month}-${day} 23:59:59`;
      return {
        startDate: startDateString,
        endDate: endDateString
      };
    } else if (type == 3) {
      //  本周
      return {
        startDate: `${startWeek} 00:00:00`,
        endDate: `${endWeek} 23:59:59`
      };
    }
  };
```

- moment类型与日期字符串，timeStamp之间的转化
```js
this.state = {
  startDay: "",
  endDay: ""
}
/**
 * 修改数据
 */
timeChange = (value, str) => {
    const [startTime, endTime] = value;
    const startDay = moment(startTime).format("YYYY-MM-DD");
    const endDay = moment(endTime).format("YYYY-MM-DD");
    //其实可以通过str直接获取而不用通过moment转化，此处为了演示
    this.setState({
      startDay,
      endDay
    });
  };
<RangePicker 
showTime={true} 
onChange={this.timeChange}
initialValue={[
  moment(this.state.startDay, DATE_FORMAT_STRING),
  moment(this.state.endDay, DATE_FORMAT_STRING)
 ]}
format={"YYYY-MM-DD"}/>
```
下面假如这个字段是存放到time上的:
```js
 const [startTime, endTime] = values.time;
 const endTimeStamp = moment(startTime).unix();
 const endTimeStamp1 = moment(startTime).format("X");
// 1.将moment类型转化为timestamp，如果是毫秒级别的要✖️1000
// 一般服务端下发的createTime,modifiedTime都是毫秒级别的
 queryParams.startTime = startTime.format("YYYY-MM-DD HH:mm:ss");
 queryParams.endTime = endTime.format('YYYY-MM-DD HH:mm:ss');
// 2.moment转化为日期字符串,此时startTime,endTime必须是moment类型
const DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const startTime = moment(+item.startTimeStamp).format(DATE_FORMAT),
const endTime  =  moment(+item.endTimeStamp).format(DATE_FORMAT)
//3.此时服务端下发timeStamp，且必须转化为数字类型才行
```

#### 14.如何引入彩色IconFont
- iconFont网站添加

通过在iconfont网站加入相应的svg图片,直接点击下载(选择svg版本)，然后使用React组件添加。比如下面的地理位置图标:
```js
import React from "react";
export default class LocationIcon extends React.Component {
  render() {
    return (
      <svg
        width="6px"
        height="9px"
        viewBox="0 0 6 9"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g
          id="Page-1"
          stroke="none"
          strokeWidth="1"
          fill="none"
          fillRule="evenodd"
        >
          <g
            id="消息号-copy-7"
            transform="translate(-768.000000, -502.000000)"
            fillRule="nonzero"
            fill="#FFFFFF"
          >
            <g id="Group-5" transform="translate(229.000000, 64.000000)">
              <g
                id="Group-6-Copy"
                transform="translate(111.000000, 358.000000)"
              >
                <g id="门店优惠卷" transform="translate(418.000000, 22.000000)">
                  <g
                    id="location_fill"
                    transform="translate(7.761600, 56.448000)"
                  >
                    <path
                      d="M5.13864324,2.4696 C3.6731634,2.4696 2.48072432,3.775401 2.48072432,5.3802 C2.48072432,6.929433 4.8624613,9.6802146 4.96370385,9.796374 C5.00937173,9.8490294 5.07267853,9.8784 5.13864324,9.8784 C5.14033465,9.8784 5.14226768,9.8784 5.14395908,9.8784 C5.21185683,9.8784 5.27588851,9.8437374 5.32058987,9.7879068 L6.14526963,8.7533208 C7.24105711,7.2834678 7.79656216,6.1485984 7.79656216,5.3802 C7.79656216,3.775401 6.60412308,2.4696 5.13864324,2.4696 Z M5.13864324,6.7032 C4.47126397,6.7032 3.93049828,6.1110252 3.93049828,5.3802 C3.93049828,4.6493748 4.47126397,4.0572 5.13864324,4.0572 C5.80602252,4.0572 6.34678821,4.6493748 6.34678821,5.3802 C6.34678821,6.1110252 5.80602252,6.7032 5.13864324,6.7032 Z"
                      id="Shape"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }
}
```
但是要注意xmlns:xlink等属性需要替换为`xmlnsXlink`等驼峰属性。


#### 16.antd获取鼠标属性
比如onClick可以通过如下方式来获取metaKey等鼠标相关的信息:
```js
localProps.onClick = e => {
   const { metaKey } = e;
}
```

#### 17.编辑时候搜索数据回填
##### 17.1 不需要编辑的数据回填(onSearch+onSelect)
```js
/**
  * 选中某一个用户
  */
 onEmpSelect=(value,options)=>{
     const {children} = options.props || {};
     this.selectedEmps.push({
         empId:value,
         lastName:children
     });
 }
```
每次搜索都将搜索已经选中的结果加入到一个全局变量中，这样下次直接将最近的搜索结果和已经选中的数据concat起来就可以了。
```js
 {getFieldDecorator('empIdsb', {
   initialValue:[]
   })(
    <Select
    onSearch={this.userSearch}
    onSelect={this.onEmpSelect}
    mode="multiple"
    filterOption={false}
    //不是将所有的数据都给我让我筛选，而是每次搜索一次重新渲染一次，导致前面的变成了ID
    style={{ width: '316px' ,display:this.state.empIds==3 ? "inline-block" :'none'}}
    placeholder="输入用户查询">
    {
        this.selectedEmps.concat(this.userList).map(el=>{
            return <Option value={el.empId} key={el.empId}>{el.lastName}</Option>
        })
    }
    </Select>
   )}
```

##### 17.2 需要编辑的数据回填query
(1)编辑的时候首先根据已经选中的id搜索一遍并放到变量里面,不需要放在state里面。

(2)每次onSelect的时候继续往全局里面插入最新选中的数据。

(3)keyword查询结果回来和全局变量进行合并

##### 17.3 queryAll查询所有的数据
弹窗出现的时候查询一次所有的数据
```js
 /**
   * 资源位搜索
   */
  adsPosSearch=(value="")=>{
    return Fetcher.queryAdsPos({name:value,status:1}).then(res=>{
      const {success,message} = res;
      if(success){
        const deliveryPlan = this.state.deliveryPlan;
        this.adsPos = res.data.data || [];
        this.setState({
          deliveryPlan
        });
      }else{
        Modal.error({
          title: "搜索接口异常",
          content: `搜索接口异常 ${message ? message : ""}`
        });
      }
    }).catch(e=>{
      Modal.error({
        title: "获取方案详情失败",
        content: `获取方案详情失败`
      });
    });
  }
```
jsx只需要如下书写即可:
```js
 {getFieldDecorator("mediaIds", {
    initialValue: this.state.deliveryPlan.mediaIds || [],
    rules: [
      {
        required: true,
        message: "请选择广告位"
      }
    ]
  })(<Select style={{width:'100%'}} 
      mode="multiple"
      optionLabelProp={"name"}
      optionFilterProp={"name"}
      showSearch={true}
      >
       {
         this.adsPos.map(el=>{
           const elStr = `[${el.id}]${el.name}_${el.size}_${el.imgCount}`;
           return <Option size={el.size} key={el.id} name={elStr} value={el.id}>[{el.id}]{el.name}_{el.size}_{el.imgCount}</Option>
         })
       }
</Select>)}
```

#### 18 getFieldDecorator复杂组件未实现componentWillReceiveProps
```js
  handleChange = ({ fileList }) => {
    console.log('handleChange被调用啦');
    let imgUrl = fileList[0] && fileList[0].response && fileList[0].response.data.path;
    this.setState({
      fileList,
      imgUrl: imgUrl
    });
    const onChange = this.props.onChange;
    if (onChange) {
        onChange(imgUrl);
      }
  }
```
如果通过getFieldDecorator开发复杂组件的时候没有实现componentWillReceiveProps那么调用this.props.form.resetFieldsValue的时候是无法重置复杂组件数据的，所以可以提供一个上面类似的方法，在调用的使用直接如下:
```js
{getFieldDecorator('imgUrl', {
    initialValue: data.imgUrl
  })(
    <UploadImg
      action={window.g_IMG_UPLOAD_ACTION}
      key={"UploadImg1"}
      propKey={"UploadImg1"}
      ref={(UploadImg1)=>{
        this.UploadImg1 = UploadImg1;
      }}
      listType="picture-card"
      style={{display:'inline-block'}}
      onChange={this.handleChange1}
    />
)}
```
而在特定的情况下直接重置它:
```js
  _crop=()=>{
    this.cropper.getCroppedCanvas({
      width: this.final.width||this.state.crop.width,
      height: this.final.height||this.state.crop.height,
      // minWidth:  this.state.crop.width,
      // minHeight: this.state.crop.height,
      // maxWidth:  this.state.crop.width,
      // maxHeight: this.state.crop.height,
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high',
    }).toBlob((blob) => {
      ajaxUploadFile(blob).then(res=>{
        let cropAttributeIdx = this.state.cropAttribute.substr(-1);
        if(isNaN(parseInt(cropAttributeIdx))){
          cropAttributeIdx = '';
        }
        const {height,width,path} = res.data;
        const crop = this.state.crop;
        this.setState({
          cropVisible:false,
          [`img${cropAttributeIdx}`]: this.final.width + 'x' + this.final.height
        });
        this.props.form.setFieldsValue({
          [`imgsize${cropAttributeIdx}`]: crop.width + 'x' + crop.height
        });
        const elEl = `UploadImg${cropAttributeIdx}`;
        //下面是关键代码直接重置没有实现componentWillReceiveProos复杂组件的方式
        this[`UploadImg${cropAttributeIdx ? cropAttributeIdx : '1'}`].resetFile(path);
      });
    });
  }
```

#### 19.手动通过FormData上传文件
```js
function ajaxUploadFile(blob) {
    return new Promise((resolve,reject)=>{
        const formData = new FormData();
        const idx = blob.type.indexOf('/');
        let xmlhttp;
        if (window.XMLHttpRequest) {
            xmlhttp = new XMLHttpRequest();
        }else {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        formData.append("file", blob,blob.type.slice(idx+1));
        // 必须为file字段
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange=function() {
            if (xmlHttp.readyState==4) {
                if (xmlHttp.status==200) {
                    console.log("上传成功",xmlHttp.response,typeof xmlHttp.response);
                    resolve(JSON.parse(xmlHttp.response));
                }else {
                    reject("文件保存失败");
                    console.log("上传失败",xmlHttp.response);
                }
            }
        }
        xmlHttp.open("POST", "/platform/uploadImg.json");
        xmlHttp.send(formData);
       
    });
}
module.exports = {
    ajaxUploadFile
}
```
下面是具体的使用:
```js
_crop=()=>{
    this.cropper.getCroppedCanvas({
      width: this.final.width||this.state.crop.width,
      height: this.final.height||this.state.crop.height,
      fillColor: '#fff',
      imageSmoothingEnabled: false,
      imageSmoothingQuality: 'high',
    }).toBlob((blob) => {
      // 关键代码文件上传
      ajaxUploadFile(blob).then(res=>{
        let cropAttributeIdx = this.state.cropAttribute.substr(-1);
        if(isNaN(parseInt(cropAttributeIdx))){
          cropAttributeIdx = '';
        }
        const {height,width,path} = res.data;
        const crop = this.state.crop;
        this.setState({
          cropVisible:false,
          [`img${cropAttributeIdx}`]: this.final.width + 'x' + this.final.height
        });
        this.props.form.setFieldsValue({
          [`imgsize${cropAttributeIdx}`]: crop.width + 'x' + crop.height
        });
        const elEl = `UploadImg${cropAttributeIdx}`;
        this[`UploadImg${cropAttributeIdx ? cropAttributeIdx : '1'}`].resetFile(path);
      });
    });
  }
```

#### 20.页面有多个getFieldDecorator处理的同一个组件
一个页面中有多个通过getFieldDecorator处理的同一个复杂组件的时候会导致componentWillReceiveProps会走多次，即使你只是在一个Upload上上传了图片而已。此时可以考虑使用上面的ref来解决调用它的实例方法

虽然我没有监听componentWillReceiveProps，但是当值发生变化后比如调用this.props.form.onChange时候，重新设置了UploadImg的值，此时**依然会走**UploadImg的onChange方法:
```js
componentWillReceiveProps(nextProps){
    console.log('nextProps====',`${nextProps.propKey}为${nextProps.value}`);
    let value = nextProps.value || '';
    value = ImgUtils.getFullUrl(value);
    const fileList = value ? [{
      uid: 0,
      name: `图片`,
      status: 'done',
      url: value
    }] : [];
    this.setState({
      previewVisible: false,
      previewImage: '',
      fileList: fileList,
      imgUrl: value
    });
  }
```

#### 21.开启时候显示输入框
```js
<FormItem {...formItemLayout} 
  labelCol={{xs: { span: 5 },sm: { span: 5 }}}
  style={{width:'650px',display:'inline-block'}}
  label="唤端控制">
    {getFieldDecorator("frequencyCallup", {
      initialValue: !this.state.deliveryPlan.frequencyCallup ? 0 :1,
      rules: [
        {
          required: false
        }
      ]
    })(<RadioGroup>
        <Radio value={0}>关闭</Radio>
        <Radio value={1}>开启</Radio>
      </RadioGroup>)}
    {
    !this.props.form.getFieldValue('frequencyCallup') ? null :      
    <FormItem style={{width:'300px',display:'inline-block'}}>
    {getFieldDecorator("frequencyCallup1", {
      initialValue: this.state.deliveryPlan.frequencyCallup ? this.state.deliveryPlan.frequencyCallup :1,
      rules: [{required: false}]
      })(<InputNumber disabled={true} min={0} max={99} style={{width:'200px'}}/>)}
  </FormItem>
  }
</FormItem>
```
你会看到FormItem里面嵌套了FormItem,同时两者都提供了getFieldDecorator来包裹，这是第一点。第二点，我们的输入框通过this.props.form.getFieldValue依赖于前一个选项的值，这样有一个好处，就是在编辑的时候只需要设置frequencyCallup的值后面的Input就能同时变化!


#### 22.antd构建数组
```js
 this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const formData = {
          // 提交时候获取数据
          refers: values.refers ? values.refers.join(',') : ''
        };
  });
 <FormItem key={k}>
    {getFieldDecorator(`refers[${k}]`, {
      initialValue: this.refersArr && this.refersArr[k]
    })(<Input style={{ width: 400 }} disabled={!isEditing} />)}
    {keys.length > 1 ? (
      <Icon
        className="dynamic-delete-button"
        type="minus-circle-o"
        disabled={keys.length === 1}
        style={{ marginLeft: 5 }}
        onClick={() => this.removeKeys(k)}
      />
    ) : null}
  </FormItem>
```

#### 23.antd的select在单选和多选之间切换
```js
 <Select
    maxTagCount={2}
    mode={this.props.form.getFieldValue('channelType') != 3 ? 'multiple' : ''}
    showSearch={this.props.form.getFieldValue('channelType') == 3}
    labelInValue
    filterOption={false}
    onSearch={this.onSearchChannel}
    onChange={this.setSelectedChannels}
    placeholder={'请输入关键字搜索具体渠道'}
    notFoundContent={'请重新输入关键字搜索'}
  >
    {this.state.channels.map(el => {
      return (
        <Option
          key={el.channelId}
          value={el.channelId}
          channelId={el.channelId}
          channelName={el.channelName}
          channelAccount={el.channelAccount}
        >
          {`${el.channelName}_${el.id}_${el.channelAccount}_${el.promotionProduct
            ? el.promotionProduct
            : ''}`}
        </Option>
      );
    })}
  </Select>
```
主要是利用mode与showSearch来切换。


参考资料:

[淺析REACT之事件系統（二）](https://ddnews.me/world/rxbn08z5.html)

[immutability-helper](https://github.com/kolodny/immutability-helper)

[深入React事件系统(React点击空白部分隐藏弹出层；React阻止事件冒泡失效)](http://www.cnblogs.com/lihuanqing/p/6295685.html)

[React事件初探](http://imweb.io/topic/5774e361af96c5e776f1f5cd)

[reactjs的事件绑定](https://segmentfault.com/q/1010000007409267)
