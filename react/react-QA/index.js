import React from "react";
import ReactDOM from "react-dom";
export default class Texst extends React.Component{
 promise = new Promise((resolve,reject)=>{});
 //默认Promise
 makeCancelable = (promise) => {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    //（1）直接为原来的promise添加then方法
    // promise.then(
    //   val => hasCanceled_ ? reject({isCanceled: true}) : resolve(val),
    //   error => hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    // );
    // （2）上面这种模式如果success回调函数抛出了错误，那么第二个error函数是不能捕获到的
    // https://www.tuicool.com/articles/6fqQ3aB
    // promise.then((val) =>
    //   hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
    // );
    // promise.catch((error) =>
    //   hasCanceled_ ? reject({isCanceled: true}) : reject(error)
    // );
    // One of the changes in node 6.6.0 is that all unhandled promise rejections result in a warning. The existing code from @vpontis had separate then and catch calls on the same base promise. Effectively, this creates two promises, one which only handles success, and one which only handles errors. That means that if there is an error, the first promise will be viewed by node as an unhandled promise rejection.
    // （3）在nodejs中上面这种方案相当于创建了两个promise，一个处理success，一个处理error。当抛出错误后，第一个promise将会被看做是unhandled project rejection，从而抛出UnhandledPromiseRejectionWarning。
     promise
      .then((val) =>
        hasCanceled_ ? reject({isCanceled: true}) : resolve(val)
      )
      .catch((error) =>
        hasCanceled_ ? reject({isCanceled: true}) : reject(error)
      );
      // 这种方式
  });
  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
    },
  };
};

/**
 * 如果组件已经卸载就直接将hasCanceled_设置为true
 * any callbacks should be canceled in componentWillUnmount, prior to unmounting.
 * 任何的回调应该在componentWillUnmount中被取消，同时要早于组件被卸载!
 */
 componentWillUnmount(){
   this.promise.cancel();
 }
  /**
   *模拟ajax请求，我们在回调中不是立即setState，而是根据条件判断是否应该使用setState。而是在this.makeCancelable
   *产生的回调then中进行判断
   */
  componentDidMount(){
   this.promise = this.makeCancelable(new Promise((resolve,reject)=>{
       setTimeout(()=>{
        const random = Math.random();
         if(random<0.7){
           resolve('success!');
          //模拟ajax请求成功了
           // this.setState({
           //   name:'覃亮'
           // });
         }else{
           reject('reject!');
          //模拟ajax请求成功了
           // this.setState({
           //   name:'Not found!'
           // });
         }
       },0)
    }))
   //(1)如果成功，那么我setState，否则不做处理，打印组件已经被卸载。
   //此时，我们知道组件并没有被卸载掉，所有可以直接setState
    this.promise.promise.then(() => {
      this.setState({
        name:'覃亮'
      });
      console.log('resolved')
    })
    .catch((reason) => {
      //如果reject就会进入这里的逻辑
      //(2)此时我们知道组件已经被卸载，不再调用this.setState,因为this表示的组件已经被卸载掉了
      //但是，componentDidMount中打印this还是可以获取到组件实例的。在componentWillUnmount组件将会被卸载，因为没有引用他的任何方法
      //   this.setState({
      //   name:'1'
      // });
      // console.log('this--------->',this);
      console.log('组件已经被卸载，不能调用setState', reason.isCanceled)
    });
  }
  render(){
    console.log('render');
    //后面的四次渲染因为是key变化，所以每次组件都是不一样的实例对象，总共执行5次
    return <div>Texst内容</div>
  }
}

//其中Promise可以是如下的类型
///**
//  * 对 fetch 过程的通用包装
//  */
// function fetchW(req, opt) {
//   return fetch(req, opt).then(checkStatus).catch(function (err) {
//     console.error('fetch failed', err); // eslint-disable-line
//   }).then(parseJSON).then(function (data) {
//     return data;
//   });
// }
