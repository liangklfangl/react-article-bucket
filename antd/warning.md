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
