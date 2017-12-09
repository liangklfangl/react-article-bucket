### 动态插入FormItem时候的warning
Warning: Cannot use `setFieldsValue` until you use `getFieldDecorator` or `getFieldProps` to register it.

解决方法：这是因为我们的setState是异步的，所以虽然在`前面调用了setState`，但是动态插入的FormItem本身还没有渲染出来,即没有调用`getFieldDecorator`，所以我们可以采用下面的方式来完成

```js
this.setState({},()=>{
    //这里处理逻辑
})
```


### 为table中每一个row都指定一个key
Warning: Each record in table should have a unique `key` prop,or set `rowKey` to an unique primary key.

解决方法如下:

```js
 <Table columns={this.columns}
       rowKey="id"
 />
```
表明使用数据的id作为每一行的key,即作为rowKey

### 你在迭代一个对象
Error: Minified React error #31; visit http://facebook.github.io/react/docs/error-decoder.html?invariant=31&args[]=object%20with%20keys%20%7BseniorDate%2C%20empId%2C%20emailPrefix%2C%20firstName%2C%20lastName%2C%20nickNameCn%2C%20emailAddr%2C%20cellphone%2C%20locationDesc%2C%20depDesc%2C%20country%7D&args[]= for the full message or use the non-minified dev environment for full errors and additional helpful warnings.
    at n (index.js?v=20170809110311:1)
    at o (index.js?v=20170809110311:4)
    at a (index.js?v=20170809110311:4)
    at Object.instantiateChildren (index.js?v=20170809110311:9)
    at v._reconcilerInstantiateChildren (index.js?v=20170809110311:10)
    at v.mountChildren (index.js?v=20170809110311:10)
    at v._createInitialChildren (index.js?v=20170809110311:10)
    at v.mountComponent (index.js?v=20170809110311:10)
    at Object.mountComponent (index.js?v=20170809110311:1)
    at v.mountChildren (index.js?v=20170809110311:10)

解决方法：你在迭代一个对象，比如`{location}`而location本身是一个object报错。很可能是线上接口返回数据而本地接口返回数据不一致，所以看看你的代理吧

### antd的DatePicker显示invalid date
解决方法：首次解析的时候momnent传入了`null`了，所以下次虽然setState重新渲染了，但是依然是无法得到有效的日期对象的。所以可以做下面的判断即可：

```js
const {startDate,endDate} =  this.state;
    //moment第一次为null的时候就报错了
const defaultRange = [startDate?moment(startDate,'YYYYMMDD'):null,endDate ? moment(endDate,'YYYYMMDD'):null];
```
即，如果startDate和endDate本身是null，那么就不要经过moment方法来处理了。

### Select的defaultValue类型不正确
<pre>
    warning.js:35 Warning: Failed prop type: Invalid prop `value` supplied to `Select`.
    in Select (created by Select)
    in Select (created by WhiteListForm)
    in div (created by FormItem)
    in div (created by Col)
    in Col (created by FormItem)
    in div (created by Row)
    in Row (created by FormItem)
    in FormItem (created by WhiteListForm)
    in form (created by Form)
    in Form (created by WhiteListForm)
    in div (created by WhiteListForm)
    in WhiteListForm (created by Unknown)
    in Unknown (created by WhiteListForm)
    in WhiteListForm (created by App)
    in div (created by Dialog)
    in div (created by Dialog)
    in div (created by LazyRenderBox)
    in LazyRenderBox (created by Dialog)
    in AnimateChild (created by Animate)
    in Animate (created by Dialog)
    in div (created by Dialog)
    in div (created by Dialog)
    in Dialog
</pre>
比如下面就是将Number类型转化为string类型:
```js
  <FormItem
      {...formItemLayout}
      label='节目级别'
      required={true}
    >
      {getFieldDecorator('priority', {
        initialValue: whitelist.priority ? whitelist.priority+"" :""
      })(
          <Select>
            {levelDOM}
          </Select>
      )}
    <\/FormItem>
```

### 学会Select的labelInValue
labelInValue是否把每个选项的`label包装到value`中，会把Select的value类型从string 变为`{key: string, label: ReactNode}`的格式。如下面的例子:
```js
import { Select } from 'antd';
const Option = Select.Option;
function handleChange(value) {
  console.log(value); 
  // { key: "lucy", label: "Lucy (101)" }
}
ReactDOM.render(
  <Select labelInValue defaultValue={{ key: 'lucy' }} style={{ width: 120 }} onChange={handleChange}>
    <Option value="jack">Jack (100)</Option>
    <Option value="lucy">Lucy (101)</Option>
  </Select>
, mountNode);
```
此时每一个Option的value为我们需要的值，最终会作为`key`传入到onChange方法中。而Option中的文本会被原样传入到onChange方法作为label。所以onChange方法拿到的是key和label，而key为最终需要传递给服务端的数据。比如我的例子(需要传id到服务端):
```js
 <Option key={index}  name={data.positionTag + ""} value={data.id+""}>
     {data.positionTag}
</Option>
```
此时上传到上级组件的key就是我们需要的资源位id。下面是一个正常的设置(可以搜索，属性之间可能会干扰，下面的例子如果指定了mode='combox'会异常的):
```js
  {this.props.getFieldDecorator("positionId", {
      initialValue: defaultBasicInfo
    })(
    <Select
      showSearch
      onSelect={this.onSelect}
      //必须是false
      labelInValue={true}
      onSearch={this.handleResourcePositionChange}
    >
      {this.state.options}
    </Select>
    )}
>
```
在componentDidMount中所有的options已经被挂载完成，此时在defaultBasicInfo这个默认值中只要设置默认的key即可:
```js
const defaultBasicInfo = {
      key:positionId+""
    };
```

### antd的getFieldDecorator引入的问题
getFieldDecorator包装过的组件`不能使用key来卸载组件`，因为getFieldDecorator会一直保持对该组件的引用。比如下面的例子:
```js
const randomKeys = [];
export function generateRandomKey() {
  let key = Math.random().toString().substring(2);
  while (randomKeys.includes(key)) {
    key = Math.random().toString().substring(2);
  }
  return key;
}
//下面是组件的一个字段
{getFieldDecorator("exposureType", {
    initialValue: 0
  })(<SingleAll key={generateRandomKey()} {...descriptorForm} />)}
```
如果这个组件被多次渲染，虽然每次的key都是变化的，但是组件提交数据的时候一直拿着的是第一个key对应的React组件数据。而且你还要知道，虽然组件每次被重新渲染的时候defaultValue都是不一样的，但是实际的值`永远`是第一次的defaultValue的值。这就是组件存在多次render时候出现的defaultValue的`僵尸值`,比如下面的例子：
```js
 {getFieldDecorator("taskMaterialList", {
    initialValue: this.state.taskMaterialList
  })(<MaterialSelect  {...descriptorForm} />)}
```
而且还会存在一种情况，如果写了一个自定义的表单控件(需要通过`onChange`方法通知外层Form该组件的值已经发生变化)，当外层组件被多次渲染的时候肯定会走自定义表单控件的componentDidMount和componentWillReceiveProps方法。那么此时，我们可能需要将表单的defaultValue通知给外层的Form，所以需要在componentDidMount和componentWillReceiveProps方法中调用this.props.onChange方法，但是在自定义表单控件中调用onChange又会导致外层组件被重新渲染(出现死循环)。而解决的方法就是如下:
```js
 <Col span={24}>
  <MaterialSelect {...descriptorForm} key={key} submitTaskData={this.props.submitTaskData} defaultTaskMaterialList={defaultTaskMaterialList}/>
</Col>
```
即通过外层传入一个新的函数submitTaskData，在componentDidMount和componentWillReceiveProps方法中调用该方法，而不是调用this.props.onChange(即不要在这两个方法中调用onChange)!总之:

<pre>
1.不要以为可以用getFieldDecorator给组件添加一个不同的key从而让他渲染，进而可以使得它重新渲染，此时你会发现所有提交的数据都是undefined。除非你手动调用onchange！
2.不要以为可以给组件一个全新的key，进而使得它每次都走componentDidMount方法。这样initialValue这个Form.Item就会重新求值，进而得到一个新的渲染好的Form.Item。其实并不会，而且你会得到undefined!
3.如果确实存在多次渲染走了ComponentWillReceiveProps使得initialValue或者defaultValue出现僵尸情况，那么`唯一的方法`就是通过给组件一个唯一的每次都不同的Key，然后在componentDidMount方法中调用我们自己的方法，比如submitTaskData将数据通知给上层组件(注意不是onChange方法)。
4.如果仅仅是弹窗页面出现的僵尸问题可以通过resetFields方法清空。即在关闭弹窗的时候调用this.props.form.resetFields()清空数据
5.简单的也可以通过三目运算符来卸载掉部分getFieldsDecorator装饰过的FormItem
</pre>

第一种情况为:
```js
  <Col span={14}>
    {getFieldDecorator("exposureType", {
      initialValue: !!exposureType
    })(<SingleAll key={generateUniqueKey()} {...descriptorForm} />)}
  </Col>
```

第二种情况:
```js
<Row className={styles.rowContainer}>
    <Col span={20}>
  // 全新的唯一的key要求重新渲染
        <ExposeCrowd {...descriptorForm} key={"crowd_"+key}  exposureCrowd={exposureCrowd} submitCrowData={this.props.submitCrowData}/>
    </Col>
  </Row>
 //ExposeCrowd组件的内容
{this.props.getFieldDecorator("contentFilter", {
    initialValue: this.state.contentFilter
  })()
}
```
### antd组件可以通过自定义属性传递到回调函数
比如下面的例子就使用了otherInfo来传递属性到Select的回调函数中:
```js
//(1)onSelect方法中可以通过options.props.rowData来获取到封装的值
onSelect = (value,options) => {
    const [businessKey, terminal, dimensionType] = options.props.otherInfo.split(":");
}
const options = dataList.map((data, index) => {
    const value =
    data.businessKey +
    ":" +
    data.terminal +
    ":" +
    data.deliveryDimension;
    return (
    //(2)otherInfo表示我们需要传递到onSelect方法中的值
    <Option key={index} otherInfo={value}>
      {data.positionTag}
   </Option>
```

### antd组件resetFields将字段设置为initialValue
```js
this.props.resetFields(['pvUppper','uvUpper']);
//比如修改了某一个属性需要重置其他的字段的使用用
```

### getFieldDecorator包裹的Select元素动态产生Option的问题
<pre>
Warning: flattenChildren(...): Encountered two children with the same key, `.$undefined`. Child keys must be unique; when two children share a key, only the first child will be used.
    in ul (created by DOMWrap)
    in DOMWrap (created by Menu)
    in Menu (created by DropdownMenu)
    in div (created by DropdownMenu)
    in DropdownMenu (created by SelectTrigger)
    in LazyRenderBox (created by PopupInner)
    in div (created by PopupInner)
    in PopupInner (created by Popup)
    in Align (created by Popup)
    in AnimateChild (created by Animate)
    in Animate (created by Popup)
    in div (created by Popup)
    in Popup
</pre>
因为必须有下面对data的修改:
```js
  onSelect = value => {
    this.props.resetFields(['contentFilter']);
    this.setState({
      deliveryDimension: value,
      data:[]
    });
  };
  //其中render方法有如下代码
 <Col span={10}>
    {this.props.getFieldDecorator("contentFilter", {
      initialValue: this.state.contentFilter
    })(
      <Select
        mode="multiple"
        optionFilterProp={"name"}
        placeholder="请选择"
        labelInValue={true}
        onSearch={this.onSearch}
        onSelect={this.onContentFilterSelect}
        onDeselect={this.onDeselect}
      >
        {this.state.data.map((data, index) => {
          //注意：这里必须默认有key否则都是undefined
          const key =
            this.state.deliveryDimension == 2
              ? data.showLongId || "key2_"+index
              : data.videoLongId || "key_"+index;
             
          const name =
            this.state.deliveryDimension == 2
              ? data.showName
              : data.userName;
          const value =
            this.state.deliveryDimension == 2
              ? data.showLongId + ""
              : data.videoLongId + "";
          return (
            <Option key={key} name={name} value={value}>
              {name}
            </Option>
          );
        })}
      </Select>
    )}
  </Col>
```
有可能的原因是:getFieldDecorator造成的问题

### antd的defaultValue问题
当defaultValue设置的时候，同时组件更新了多次，即调用了componentWillReceiveProps，此时defaultValue永远是第一次渲染的值，所以请使用value+onChange替换掉defaultValue的方式:
```js
 <InputNumber
    onChange={this.frequencyChange}
    value={
      this.state.exposureFrequencyType.exposureFrequency
    }
    style={{ marginRight: "10px", marginLeft: "10px" }}
  />次
```
如果使用了getFieldDecorator,那么可以使用下面的方式来完成

### antd的二级表格无法滚动
下面是expandRow的设置，必须设置了style和width才行，否则无法正常滚动。
```js
 constructor(props) {
    super(props);
    this.clientWidth = "1200px";
  }
  componentDidMount() {
    this.clientWidth = document.body.clientWidth + 1000 + "px" || "1200px";
    // 更新clientWidth,需要根据实际列的宽度进行调整
  }
 expandedRowRender = data => {
    const { positionExposureList, taskName } = data;
    const columns = [
      {
        title: "列1",
        width: 100,
        fixed: "left",
        dataIndex: "id",
        key: "id"
      }
    ];
    return (
      <Table
        rowKey={"id"}
        columns={columns}
        style={{ width: "1200px" }}
        scroll={{ x: this.clientWidth }}
        dataSource={positionExposureList}
        pagination={false}
      />
    );
  };
```
下面是官方文档对于scroll.x的具体说明:
<pre>
1.若列头与内容不对齐或出现列重复，请指定列的宽度 width。
2.建议指定 scroll.x 为大于表格宽度的固定值或百分比。注意，且非固定列宽度之和不要超过scroll.x。
</pre>

