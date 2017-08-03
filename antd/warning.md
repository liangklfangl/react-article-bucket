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

