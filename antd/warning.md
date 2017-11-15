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
解决方法：首次解析的时候momnent传入了null了，所以下次虽然setState重新渲染了，但是依然是无法得到有效的日期对象的。所以可以做下面的判断即可：

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
