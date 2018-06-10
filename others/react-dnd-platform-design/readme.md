
#### 前言
可视化搭建系统的平台设计

#### 主要消息设计模式
(1)采用事件通信，即**EventEmitter抛出一个事件+组件功能(接受到消息做的事情)**=>可视化搭建的模式。每一个组件都实现EventEmitter接口，能够接受外界抛出的事件。同时也能够往外抛出事件。

#### 具体的数据交互逻辑
(1)定义事件类型(点击某一个按钮是查询;点击编辑是查询接口;点击下线是查询接口)，这些类型的具体操作如何定义?页面自定义隐藏逻辑如何实现(比如poplayer隐藏了很多字段)?

(2)抛出的消息
```js
emittedMessage = {
    messages:[{
         messageName:"component.query",
         //告诉消息接受者消息名称
         url:"/postMessage/query",
         //告诉消息接受者走的相应接口
         query:{},
         //告诉消息接受者查询参数;Table和Modal都需要
         edit:false
         // 告诉消息接受者是否是编辑状态，编辑状态等保存需要ID等等与添加状态不同
    }]  
}
```

(3)组件接受的消息定义
```js
receivedMessage = {
  messages:[
    {
     messageName:"component.query",
     // 接受消息的名称
     disabled:['name','sex']
     // 那些字段不能编辑
    }
  ]
}
```

(5)UI渲染的数据配置模式
```js
// 1.根据配置来渲染不同的页面，比如左侧菜单栏跳转URL和菜单项配置等等
// 2.右侧搭建的就类似于一个新的页面
```
