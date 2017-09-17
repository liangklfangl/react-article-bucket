#### 1.react,redux的state扁平化设计
建议分为以下三种情况:

(1)如果状态被0个组件依赖或者影响，那么我们认为这个状态不存在，放在redux中是没有用的

(2)如果这个状态只会被1个组件依赖或者影响。对于这种情况，其实如果你把这个状态放在这个组件内部，其它组件根本不会在乎。因为它们不需要，不需要改变它

(3)这个状态被多个组件依赖或者影响。这种情况会比上面两种情况复杂多了。你想象一下，如果我们按照情况 2解决方案来处理这种情况会发生什么问题。某个状态被某个组件所拥有，如果另外一个组件需要需要依赖或者影响这个状态的时候，就需要`依赖那个组件`！举个例子，例如网站的按钮，点击它的时候需要发送 Ajax 请求并且 disabled 掉，并且弹出 loading modal。那么这个 loading 的状态不管放在按钮组件还是loading 组件都不合适，这样做必然会导致另外一个组件的依赖。一旦这种公共状态多起来，组件之间的依赖会极其混乱。

对于非扁平化的设计，我们可能会出现下面的代码:
```js
const nick = getState().articles[0].comments[0].user.nick;
```
这种就是数据嵌套过深的情况，所以我们一般建议如下的非nosql的方式来减少存储数据的冗余，这就是所谓的`范式化`的设计模式，每一个sub-state对应于一个关系型的数据库的表。如下就是扁平化的数据设计模式:
```js
{
  articles: [
   {
      id: 1,
      title: 'React Intro',
      content: 'about react'
   },
   {
      id: 2,
      title: 'Redux intro',
      content: 'about redux'
   }
  ],
  users: [
    {
      id: 'morgan',
      nick: 'Morgan'
    }
  ],
  comments: [
     {
        id: 1,
        userId: 'user_1',
        articleId: 1,
        content: 'Good article'
     }
  ]
}
```
详细查看[这个知乎问答](https://www.zhihu.com/question/50888321)

#### 2.纯react应用中有大量的ajax调用怎么办
如果没有redux，我们很可能遇到大量的ajax调用，然后setState的这种情况，此时我们的代码会非常冗余。而在纯react应用中解决大量的ajax请求的方式就是通过react-refetch来完成。我们先给出下面几个例子：
```js
import React, { Component, PropTypes } from 'react'
import { connect, PromiseState } from 'react-refetch'
import PromiseStateContainer from './PromiseStateContainer'
export default class Profile extends Component {
  render() {
    const { userFetch, likesFetch } = this.props 
    return (
      <PromiseStateContainer
        ps={PromiseState.all([userFetch, likesFetch])}
        //其中我们的ps就是调用PromiseState.all方法后返回的对象
        onFulfillment={([user, likes]) => {
          return (
            <div>
              <User user={user}/>
              <Likes user={user} likes={likes}/>
            </div>
           )
          }
        }
      />
    )
  }
}
connect((props) => ({
  userFetch:  `/users/${props.userId}`,
  likesFetch: `/users/${props.userId}/likes`
}))(Profile)
```
下面给出的就是我们的PromiseContainer的代码
```js
import React, { Component, PropTypes } from 'react'
import { connect, PromiseState } from 'react-refetch'
import LoadingAnimation from './LoadingAnimation'
import ErrorBox from './ErrorBox'
class PromiseStateContainer extends Component {
  static propTypes = {
    ps: PropTypes.instanceOf(PromiseState).isRequired,
    //必须是PromiseState实例对象
    onPending: PropTypes.func,
    onNoResults: PropTypes.func,
    onRejection: PropTypes.func,
    onFulfillment: PropTypes.func.isRequired,
  }
  static defaultProps = {
    onPending: (meta) => <LoadingAnimation/>,
    onNoResults: (value, meta) => <ErrorBox error="No results"/>,
    onRejection: (reason, meta) => <ErrorBox error={reason}\/>,
  }
  render() {
    const { ps, onPending, onNoResults, onRejection, onFulfillment } = this.props;
    //获取我们的Promise.all返回的对象
    if (ps.pending) {
      return onPending(ps.meta)
    } else if (ps.rejected) {
      return onRejection(ps.reason, ps.meta)
    } else if (ps.fulfilled && $.isEmptyObject(ps.value)) {
      return onNoResults(ps.value, ps.meta)
    } else if (ps.fulfilled) {
      return onFulfillment(ps.value, ps.meta)
    } else {
      console.log('invalid promise state', ps)
      return null
    }
  }
}
export default PromiseStateContainer
```
更多内容和配置请参考[react-refetch](https://github.com/heroku/react-refetch)



参考资料:

[reselect](https://github.com/reactjs/reselect)

[ComputingDerivedData](http://cn.redux.js.org/docs/recipes/ComputingDerivedData.html)

[react-refetch](https://github.com/heroku/react-refetch)

[2016 React最佳实践](https://blog.risingstack.com/react-js-best-practices-for-2016/)

[React最佳实践2016中文版](http://www.devstore.cn/essay/essayInfo/7663.html)

[react最佳实践](https://www.zhihu.com/question/36516604)

[normalizr扁平化你的state](https://github.com/paularmstrong/normalizr)
