[![GitHub
version](https://badge.fury.io/gh/HubSpot%2Ftether.svg)](https://github.com/liangklfangl/high-order-reducer)
### 1.高阶reducer的定义
高阶reducer指的是一个函数，该函数接收一个reducer函数作为参数或者返回一个reducer函数作为函数的返回值。高阶reducer也可以被看做为一个reducer工厂，combineReducers是高阶reducer一个典型的例子。我们可以使用高阶reducer函数来创建一个符合自己要求的reducer的函数。

### 2.为什么要高阶reducer函数
当应用功能变大的时候，在reducer函数中那些通用的逻辑就会出现重复。你会发现很多reducer都是处理同样的逻辑，只是处理的数据不同而已，所以我们就会想着如何重复使用reducer函数中那些通用的逻辑，从而减小应用的代码。同时，有时候你想要在store中处理特定类型数据的多个"实例"(如下面的counter函数需要用于多个地方)。然而,redux的全局store采用了一些权衡:虽然，我们可以很容易跟踪整个应用的state状态(for循环，所有的reducer都执行了一遍)，但是，很难针对特定的action来更新特定的state的某一部分数据，特别是当你使用combineReducers(因为dispatch的时候，我们采用的是for循环来对[每一个reducer都进行了执行](https://github.com/liangklfangl/redux-createstore))。

例如下面的例子，我们想要跟踪应用中多个counter实例，分别为counterA,counterB,counterC。我们首先定义了counter这个reducer,同时使用了combineReducers来管理状态:
```js
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
const rootReducer = combineReducers({
    counterA : counter,
    counterB : counter,
    counterC : counter
});
```
针对这种情况存在一个问题，因为我们的combineReducer采用的是for循环来对所有的reducer使用相同的action都执行一遍(不知道的请[点击这里](https://github.com/liangklfangl/redux-createstore)，查看combineReducer部分分析)。所以如果我们dispacth({type:"INCREMENT"}),那么，我们上面counterA,counterB,counterC都会执行一遍,而不是执行某一个reducer函数。所以我们需要使用一种机制来保证只有一个reducer会执行，而这种机制就是我们要说的高阶reducer。


### 3.高阶reducer的用法
指定一个reducer的最常用的方式就是使用一个后缀或者前缀来产生一个reducer的action,或者将额外的信息添加到action对象上。下面是几个例子：

#### 3.1 常规高阶reudcer函数
```js
//这是一个高阶reducer，因为它会返回一个reducer函数作为返回值
function createCounterWithNamedType(counterName = '') {
    return function counter(state = 0, action) {
        switch (action.type) {
            case `INCREMENT_${counterName}`:
                return state + 1;
            case `DECREMENT_${counterName}`:
                return state - 1;
            default:
                return state;
        }
    }
}
//这里和上面的高阶reducer是一样的，只是方式不同而已
function createCounterWithNameData(counterName = '') {
    return function counter(state = 0, action) {
        const {name} = action;
        if(name !== counterName) return state;
        //如果是我们关注的counterName名称，那么我们才会通过action的type进行处理
        //否则原样返回state
        switch (action.type) {
            case `INCREMENT`:
                return state + 1;
            case `DECREMENT`:
                return state - 1;
            default:
                return state;
        }
    }
}
```
下面我们可以使用上面任意一个函数来产生我们自己的reducer,然后dispatch一个action，而该action只会影响我们关心的那部分的state的值：
```js
const rootReducer = combineReducers({
    counterA : createCounterWithNamedType('A'),
    counterB : createCounterWithNamedType('B'),
    counterC : createCounterWithNamedType('C'),
});
//redux的dispatch方法会遍历所有的reducer来计算下一个状态
//subscribe用于计算完成后进行回调
store.dispatch({type : 'INCREMENT_B'});
//当你调用store的dispatch的时候我们会遍历上面指定的所有的reducers，然后发现只有
//第二个reducer，即createCounterWithNamedType('B')能够处理，其他reducer原样返回
//state的当前状态。注意：每一个应用只有一个store,combineReducers每一个key负责管理
//store的一部分状态
console.log(store.getState());
// {counterA : 0, counterB : 1, counterC : 0}
// store中只有counterB发生变化
```

#### 3.2 通用高阶reudcer函数
我们也可以通过下面的方式来产生一个更加通用的高阶reducer，该reducer同时接收一个指定的reducer函数以及一个name或者identifier:
```js
function counter(state = 0, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}
//通用reducer工厂函数，接收一个reducer函数和一个name作为参数，返回一个通用reducer
function createNamedWrapperReducer(reducerFunction, reducerName) {
    return (state, action) => {
        const {name} = action;
        //dispatch的这个action必须有一个name属性，用于判断你要执行哪一个reducer
        const isInitializationCall = state === undefined;
        if(name !== reducerName && !isInitializationCall) return state;
        //如果传递的action.name不是该reducerName指定的reducer处理，那么返回当前state
        //否则通过我们的reducer函数来处理。和上面这个例子一样
        return reducerFunction(state, action);    
    }
}
const rootReducer = combineReducers({
    counterA : createNamedWrapperReducer(counter, 'A'),
    counterB : createNamedWrapperReducer(counter, 'B'),
    counterC : createNamedWrapperReducer(counter, 'C'),
});
```
其实上面的这种逻辑已经有一个库实现了，即
[multireducer](https://github.com/erikras/multireducer)。

#### 3.3 含有通用过滤函数的高阶reudcer函数
```js
//和上面不一样的是，这个reducer工厂函数接收的第二个参数是一个函数，而不是一个reducerName，这个函数用于对我们dispatch这个action进行过来
function createFilteredReducer(reducerFunction, reducerPredicate) {
    return (state, action) => {
        const isInitializationCall = state === undefined;
        const shouldRunWrappedReducer = reducerPredicate(action) || isInitializationCall;
        //传入我们的action到reducer的filter函数中，如果返回true,那么我们会执行reducer函数，如果返回false，我们返回当前state状态即可
        return shouldRunWrappedReducer ? reducerFunction(state, action) : state;
    }
}
const rootReducer = combineReducers({
    // check for suffixed strings
    counterA : createFilteredReducer(counter, action => action.type.endsWith('_A')),
    // check for extra data in the action
    counterB : createFilteredReducer(counter, action => action.name === 'B'),
    // respond to all 'INCREMENT' actions, but never 'DECREMENT'
    counterC : createFilteredReducer(counter, action => action.type === 'INCREMENT')
});
```
上面的combineReducers集成的这个rootReducer可以处理的action如下:
```js
store.dispatch({type:"XXX_A"})
//如果你dispatch的这个action.type后缀为_A，那么会通过counter进行处理(注意：这个counter肯定和我们上面的counter有点差异，它会多出很多switch的case，因为这里对我们的action的type有依赖)
//但是这里是type的判断情况，如果是下面的name就不会对switch的case产生影响，因为对type没有影响
store.dispatch({name:"B"})
//此时我们还可以添加type属性来让我们上面的counter产生作用，是DECREMENT/INCREMENT
store.dispatch({type:"INCREMENT"})
```

### 4.高阶reducer的几个通用库
[multireducer](https://github.com/erikras/multireducer)我上面已经说过了，你可以直接去官网查看。很显然，它实现了一种机制，解决我们了第二部分表述的那种dispatch一个action后，所有的reducer都执行了一遍的情况。具体使用[查看API](https://github.com/erikras/multireducer/blob/master/docs/Usage.md)。但是这个库不是我想说的，我想说的是[violet-paginator](https://github.com/sslotsky/violet-paginator)，我是因为看了这个库的用法才深入了解了高阶reducer的内容。
```js
import { createPaginator } from 'violet-paginator';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
 const reducer = combineReducers({
    recipes: createPaginator(config)
  //很显然createPaginator返回值必须是一个reducer函数，这个函数用于对分页处理
  })
```
下面是具体的config内容:
```js
export default {
  listId: 'recipes',
  fetch: mockFetch,
  //会使用这个fetch方法发送请求，毋须用户手动干预
  pageParams: {
    totalCountProp: 'totalCount'
   //服务器通过那个字段来返回我们总的字段个数
   //https://sslotsky.gitbooks.io/violet-paginator/content/v/v2.0.0/single_list_configuration.html
  },
  initialSettings: {
    pageSize: 1
  }
}
```
config中的内容就是为我们的reducer工厂函数(高阶函数)传入了配置信息，所有的操作都会在该工厂函数中完成，其中包括从服务器端获取数据(通过fetch函数来完成获取数据)

其中组件中的用法是:
```js
   <VioletPaginator listId="recipes" />
   <VioletDataTable listId="recipes" />
```
其中我比较纠结的不是如何用的，而是上面配置的listId="recipes"的作用是什么，所以我好奇的看了下内部的实现:
```js
//返回一个字符串
 function actionType(t, id) {
  return `${t}_${id}`
}
export const INITIALIZE_PAGINATOR = '@@violet-paginator/INITIALIZE_PAGINATOR'
//这里只给出了一个actionTypes的值
export default function createPaginator(config) {
  const { initialSettings } = registerPaginator(config)
  const resolve = t => actionType(t, config.listId)
  ////调用resolve得到一个字符串
  return resolveEach(defaultPaginator.merge(initialSettings), {
    [actionTypes.EXPIRE_ALL]: expire,
    [resolve(actionTypes.INITIALIZE_PAGINATOR)]: initialize,
    //resolve调用得到"@@violet-paginator/INITIALIZE_PAGINATOR_recipes"
    [resolve(actionTypes.EXPIRE_PAGINATOR)]: expire
  })
}
```
所以，从这里你大概可以看出来，我们点击了VioletPaginator的时候，listId="recipes"决定过了我们发出的这个action的信息，而且应该是type信息。我们在dispatch的时候，会将所有的combineReducers中的key对应的函数都执行一遍!

### 5.高阶reducer的好处
通过上面的例子你也可以看到，对于counterA,counterB,counterC我们只用提供一个reducer函数即counter,但是我们却可以复用这部分的逻辑。只要我们dispatch的这个action明确指定我们需要改变哪一部分state状态即可，如:
```js
store.dispatch({name:"A",type:"INCREMENT"})
//此时只会改变我们counterA对应的那部分的state的状态，同时将状态的值加1
```
同时高阶组件一个重要的作用在于重构原组件，[React进阶——使用高阶组件（Higher-order Components）优化你的代码](http://www.tuicool.com/articles/JrYjeeq)这篇文章就指出了一个例子，比如你原来有一个NewList组件，现在希望对组件可以接受的props进行更新，一种方法就是在使用这个组件的地方都进行更新得到一个ListAdapter新的组件。
```js
class ListAdapter extends Component {
    mapProps(props) {
        return {/* new props */}
    }
    render() {
        return <NewList {...mapProps(this.props)} />
    }
}
```
如果有十个组件(NewList1,NewList2.....)需要适配呢？如果你不想照着上面写十遍，或许高阶组件可以给你答案
```js
function mapProps(mapFn) {
    return function(Comp) {
        return class extends Component {
            render() {
                return <Comp {...mapFn(this.props)}/>
            }
        }
    } 
}
const ListAdapter = mapProps(mapPropsForNewList)(NewList);
```
对于使用高阶组件的这种情况，我们只是需要考虑对props进行过滤的逻辑，复用性明显改善。同时可以对其他的任意组件，如NewList1，NewList2....等都能够进行适配。所有，当你考虑复用代码逻辑的时候一定要*多想想高阶组件*!!!

上面这个组件本身比较简单，因为它没有牵涉到异步请求的逻辑。比如有一种情况，你需要获取所有的用户列表，图书列表,**列表等等，然后在数据获取完成后来重新渲染组件，此时你也可以考虑高阶组件的方式：
```js
//此时我们只是需要考虑真正的异步请求数据的逻辑，以及对prop进行特别处理的逻辑，而不用管当前是图书列表，还是用户列表等等
function connectPromise({promiseLoader, mapResultToProps}) {
  return Comp=> {
    return class AsyncComponent extends Component {
      constructor(props) {
        super();
        this.state = {
          result: undefined
        }
      }
      componentDidMount() {
        promiseLoader()
          .then(result=> this.setState({result}))
      }
      render() {
        return (
          <Comp {...mapResultToProps(props)} {...this.props}/>
        )
      }
    }
  }
}
const UserList = connectPromise({
    promiseLoader: loadUsers,
    mapResultToProps: result=> ({list: result.userList})
})(List); //List can be a pure component

const BookList = connectPromise({
    promiseLoader: loadBooks,
    mapResultToProps: result=> ({list: result.bookList})
})(List);
```
你应该很容易就看出来了，对于这种列表类型的高阶组件抽象是相当成功的。我们只需要关注重要的代码逻辑，在componentDidMount请求数据结束后我们会自动调用setState来完成组件状态的更新，而*真实的更新的组件却是我们通过自己的业务逻辑来指定的*,可以是BookList,UserList,**List等等。这样具有副作用的高阶组件复用也就完成了。






参考资料：

[Reusing Reducer Logic](http://redux.js.org/docs/recipes/reducers/ReusingReducerLogic.html#customizing-behavior-with-higher-order-reducers)

[multireducer](https://github.com/erikras/multireducer)

[violet-paginator](https://github.com/sslotsky/violet-paginator)

[Reducer 最佳实践，Redux 开发最重要的部分](http://www.jianshu.com/p/938f8121ba0f)

[React进阶——使用高阶组件（Higher-order Components）优化你的代码](http://www.tuicool.com/articles/JrYjeeq)

[深入理解 React 高阶组件,算法级别](https://zhuanlan.zhihu.com/p/24776678?group_id=802649040843051008)
