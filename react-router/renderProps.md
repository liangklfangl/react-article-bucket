# react-router-renderProps
renderProps of match method of react router 

最近在学习服务端渲染，之前一直不明白match方法中的renderProps，所以现在打印了log，查看了内部的结构
### 1.match方法
```js
match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {})
```
知道服务器端渲染的都知道这个match方法，我这里不再班门弄斧

### 2.renderProps属性
首先我给出我自己配置的React-router：

```js
{
   path:"/",
   component : App,
   IndexRoute:{
     component : Home
   },
   childRoutes:[
     {
       component : Home,
       path:"home"
     }
    ]
 }
```
下面是完整的renderProps属性，其中renderProps包含routes,params,location,components,router,matchContext属性。

```js
 { 
    //renderProps包含routes对象
    routes:
    [ { path: '/',
        component: [Function: App],
        IndexRoute: [Object],
        childRoutes: [Object]
     },
      { component: [Function: Home], path: 'home' } 
    ],
   //renderProps包含params对象
   params: {},
   // renderProps包含location对象
   location:
    { pathname: '/home',
      search: '',
      hash: '',
      state: undefined,
      action: 'POP',
      key: '34hg49',
      query: {}
     },
    // renderProps包含components对象
   components: [ [Function: App], [Function: Home] ],
   // renderProps包含router对象
   router:
    { getCurrentLocation: [Function: getCurrentLocation],
      listenBefore: [Function: listenBefore],
      listen: [Function: listen],
      transitionTo: [Function: transitionTo],
      push: [Function: push],
      replace: [Function: replace],
      go: [Function: go],
      goBack: [Function: goBack],
      goForward: [Function: goForward],
      createKey: [Function: createKey],
      createPath: [Function: createPath],
      createHref: [Function: createHref],
      createLocation: [Function: createLocation],
      canGo: [Function: canGo],
      unsubscribe: [Function: unsubscribe],
      setRouteLeaveHook: [Function: listenBeforeLeavingRoute],
      isActive: [Function: isActive],
      location:
       { pathname: '/home',
         search: '',
         hash: '',
         state: undefined,
         action: 'POP',
         key: '34hg49',
         query: {} 
     },
      params: {},
      routes: [ [Object], [Object] ] 
      },
   // renderProps包含matchContext对象
   matchContext:
    { transitionManager:
       { isActive: [Function: isActive],
         match: [Function: match],
         listenBeforeLeavingRoute: [Function: listenBeforeLeavingRoute],
         listen: [Function: listen] },
      router:
       { getCurrentLocation: [Function: getCurrentLocation],
         listenBefore: [Function: listenBefore],
         listen: [Function: listen],
         transitionTo: [Function: transitionTo],
         push: [Function: push],
         replace: [Function: replace],
         go: [Function: go],
         goBack: [Function: goBack],
         goForward: [Function: goForward],
         createKey: [Function: createKey],
         createPath: [Function: createPath],
         createHref: [Function: createHref],
         createLocation: [Function: createLocation],
         canGo: [Function: canGo],
         unsubscribe: [Function: unsubscribe],
         setRouteLeaveHook: [Function: listenBeforeLeavingRoute],
         isActive: [Function: isActive],
         location: [Object],
         params: {},
         routes: [Object] 
     }
   } 
 }
```
我相信，当你了解了renderProps的内部结构以后，你能够更好的理解网上的关于react-router服务器渲染的例子了。如果觉得有用别忘了star哦~~~~

### 3.renderToString返回的一个内容
```html
<!-- 1.HTML元素最顶级具有data-react-checksum属性计算hash
 res.send('<!doctype html>\n' +
          renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}/>));
      });
 -->
<html lang="en-us" data-reactroot="" data-reactid="1" data-react-checksum="350097657">
 <head data-reactid="2"> 
  <title data-react-helmet="true" data-reactid="3">Widgets</title> 
  <link rel="shortcut icon" href="/favicon.ico" data-reactid="4" /> 
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css" data-reactid="5" /> 
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Work+Sans:400,500" data-reactid="6" /> 
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/violet/0.0.1/violet.min.css" data-reactid="7" /> 
  <meta name="viewport" content="width=device-width, initial-scale=1" data-reactid="8" /> 
 </head> 
 <body data-reactid="9"> 
  <div id="content" data-reactid="10"> 
  <!--2.我们的Header+Footer+Content的容器具有data-react-checksum的hash值。其渲染的部分为如下的内容:
   <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
  -->
   <div class="container" data-reactroot="" data-reactid="1" data-react-checksum="1912308161"> 
    <div class="header" data-reactid="2"> 
     <nav class="navbar navbar-inverse" data-reactid="3"> 
      <div class="container" data-reactid="4"> 
       <div class="navbar-header" data-reactid="5"> 
        <a href="#" class="navbar-brand" data-reactid="6">React全家桶实例</a> 
        <button type="button" class="navbar-toggle collapsed" data-reactid="7"> <span class="sr-only" data-reactid="8">Toggle navigation</span> <span class="icon-bar" data-reactid="9"></span> <span class="icon-bar" data-reactid="10"></span> <span class="icon-bar" data-reactid="11"></span> </button> 
       </div> 
       <div class="navbar-collapse collapse" data-reactid="12"> 
        <ul class="nav navbar-nav" data-reactid="13"> 
         <li role="presentation" class="" data-reactid="14"> <a href="#" role="button" data-reactid="15">聊天</a> </li> 
         <li role="presentation" class="active" data-reactid="16"> <a href="/widget" action="push" data-reactid="17">Widget</a> </li> 
         <li role="presentation" class="" data-reactid="18"> <a href="#" role="button" data-reactid="19">Survey</a> </li> 
         <li role="presentation" class="" data-reactid="20"> <a href="#" role="button" data-reactid="21">关于我们</a> </li> 
         <li role="presentation" class="" data-reactid="22"> <a href="/login" action="push" data-reactid="23">登录</a> </li> 
         <li role="presentation" class="" data-reactid="24"> <a href="/pagination" action="push" data-reactid="25">分页</a> </li> 
         <li class="dropdown" data-reactid="26"> <a id="basic-nav-dropdown" role="button" class="dropdown-toggle" aria-haspopup="true" aria-expanded="false" href="#" data-reactid="27">
           <!-- react-text: 28 -->更多
           <!-- /react-text -->
           <!-- react-text: 29 --> 
           <!-- /react-text --><span class="caret" data-reactid="30"></span> </a> 
          <ul role="menu" class="dropdown-menu" aria-labelledby="basic-nav-dropdown" data-reactid="31"> 
           <li role="presentation" class="" data-reactid="32"><a role="menuitem" tabindex="-1" href="#" data-reactid="33">Action</a> </li> 
           <li role="presentation" class="" data-reactid="34"><a role="menuitem" tabindex="-1" href="#" data-reactid="35">Another action</a> </li> 
           <li role="presentation" class="" data-reactid="36"> <a role="menuitem" tabindex="-1" href="#" data-reactid="37">Something else here</a> </li> 
           <li role="separator" class="divider" data-reactid="38"></li>
           <li role="presentation" class="" data-reactid="39"><a role="menuitem" tabindex="-1" href="#" data-reactid="40">Separated link</a></li> 
          </ul> </li> 
        </ul> 
        <ul class="nav navbar-nav navbar-right" data-reactid="41"> 
         <li role="presentation" class="" data-reactid="42"> <a href="#" role="button" data-reactid="43">Link Right</a> </li> 
         <li role="presentation" class="" data-reactid="44"> <a href="#" role="button" data-reactid="45">Link Right</a> </li> 
        </ul> 
       </div> 
      </div> 
     </nav> 
    </div> 
    <div data-reactid="46">
     <!-- react-empty: 47 --> 
     <table class="table table-striped" data-reactid="48"> 
      <thead data-reactid="49"> 
       <tr data-reactid="50"> 
        <th data-reactid="51">ID</th> 
        <th data-reactid="52">颜色</th> 
        <th data-reactid="53">Sprockets</th> 
        <th data-reactid="54">所有者</th> 
        <th data-reactid="55"></th> 
       </tr> 
      </thead> 
      <tbody data-reactid="56"> 
       <tr data-reactid="57"> 
        <td data-reactid="58">1</td> 
        <td data-reactid="59">Red</td> 
        <td data-reactid="60">7</td> 
        <td data-reactid="61">John</td> 
        <td data-reactid="62"> <button class="btn btn-primary" data-reactid="63"> <i class="fa fa-pencil" data-reactid="64"></i>
          <!-- react-text: 65 --> 编辑
          <!-- /react-text --> </button> 
         <div data-reactid="66"> 
          <div style="color:rgba(0, 0, 0, 0.87);background-color:#ffffff;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0, 0, 0, 0.12),
[1]          0 1px 4px rgba(0, 0, 0, 0.12);border-radius:2px;display:inline-block;min-width:88px;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-box-sizing:border-box;" data-reactid="67"> 
           <button style="border:10px;box-sizing:border-box;display:inline-block;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;position:relative;z-index:1;height:36px;line-height:36px;width:100%;border-radius:2px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;background-color:#ffffff;text-align:center;mui-prepared:;-moz-box-sizing:border-box;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" tabindex="0" type="button" data-reactid="68"> 
            <div data-reactid="69"> 
             <div style="height:36px;border-radius:2px;background-color:;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;top:0;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" data-reactid="70">
              <span style="position:relative;opacity:1;font-size:14px;letter-spacing:0;text-transform:uppercase;font-weight:500;margin:0;user-select:none;padding-left:16px;padding-right:16px;color:rgba(0, 0, 0, 0.87);mui-prepared:;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;" data-reactid="71">Modal Dialog</span>
             </div>
            </div></button>
          </div>
          <!-- react-empty: 72 -->
         </div></td>
       </tr>
       <tr data-reactid="73">
        <td data-reactid="74">2</td>
        <td data-reactid="75">Taupe</td>
        <td data-reactid="76">1</td>
        <td data-reactid="77">George</td>
        <td data-reactid="78"><button class="btn btn-primary" data-reactid="79"><i class="fa fa-pencil" data-reactid="80"></i>
          <!-- react-text: 81 --> 编辑
          <!-- /react-text --></button>
         <div data-reactid="82">
          <div style="color:rgba(0, 0, 0, 0.87);background-color:#ffffff;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0, 0, 0, 0.12),
[1]          0 1px 4px rgba(0, 0, 0, 0.12);border-radius:2px;display:inline-block;min-width:88px;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-box-sizing:border-box;" data-reactid="83">
           <button style="border:10px;box-sizing:border-box;display:inline-block;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;position:relative;z-index:1;height:36px;line-height:36px;width:100%;border-radius:2px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;background-color:#ffffff;text-align:center;mui-prepared:;-moz-box-sizing:border-box;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" tabindex="0" type="button" data-reactid="84">
            <div data-reactid="85">
             <div style="height:36px;border-radius:2px;background-color:;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;top:0;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" data-reactid="86">
              <span style="position:relative;opacity:1;font-size:14px;letter-spacing:0;text-transform:uppercase;font-weight:500;margin:0;user-select:none;padding-left:16px;padding-right:16px;color:rgba(0, 0, 0, 0.87);mui-prepared:;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;" data-reactid="87">Modal Dialog</span>
             </div>
            </div></button>
          </div>
          <!-- react-empty: 88 -->
         </div></td>
       </tr>
       <tr data-reactid="89">
        <td data-reactid="90">3</td>
        <td data-reactid="91">Green</td>
        <td data-reactid="92">8</td>
        <td data-reactid="93">Ringo</td>
        <td data-reactid="94"><button class="btn btn-primary" data-reactid="95"><i class="fa fa-pencil" data-reactid="96"></i>
          <!-- react-text: 97 --> 编辑
          <!-- /react-text --></button>
         <div data-reactid="98">
          <div style="color:rgba(0, 0, 0, 0.87);background-color:#ffffff;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0, 0, 0, 0.12),
[1]          0 1px 4px rgba(0, 0, 0, 0.12);border-radius:2px;display:inline-block;min-width:88px;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-box-sizing:border-box;" data-reactid="99">
           <button style="border:10px;box-sizing:border-box;display:inline-block;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;position:relative;z-index:1;height:36px;line-height:36px;width:100%;border-radius:2px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;background-color:#ffffff;text-align:center;mui-prepared:;-moz-box-sizing:border-box;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" tabindex="0" type="button" data-reactid="100">
            <div data-reactid="101">
             <div style="height:36px;border-radius:2px;background-color:;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;top:0;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" data-reactid="102">
              <span style="position:relative;opacity:1;font-size:14px;letter-spacing:0;text-transform:uppercase;font-weight:500;margin:0;user-select:none;padding-left:16px;padding-right:16px;color:rgba(0, 0, 0, 0.87);mui-prepared:;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;" data-reactid="103">Modal Dialog</span>
             </div>
            </div></button>
          </div>
          <!-- react-empty: 104 -->
         </div></td>
       </tr>
       <tr data-reactid="105">
        <td data-reactid="106">4</td>
        <td data-reactid="107">Blue</td>
        <td data-reactid="108">2</td>
        <td data-reactid="109">Paul</td>
        <td data-reactid="110"><button class="btn btn-primary" data-reactid="111"><i class="fa fa-pencil" data-reactid="112"></i>
          <!-- react-text: 113 --> 编辑
          <!-- /react-text --></button>
         <div data-reactid="114">
          <div style="color:rgba(0, 0, 0, 0.87);background-color:#ffffff;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;box-sizing:border-box;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0,0,0,0);box-shadow:0 1px 6px rgba(0, 0, 0, 0.12),
[1]          0 1px 4px rgba(0, 0, 0, 0.12);border-radius:2px;display:inline-block;min-width:88px;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-box-sizing:border-box;" data-reactid="115">
           <button style="border:10px;box-sizing:border-box;display:inline-block;font-family:Roboto, sans-serif;-webkit-tap-highlight-color:rgba(0, 0, 0, 0);cursor:pointer;text-decoration:none;margin:0;padding:0;outline:none;font-size:inherit;font-weight:inherit;position:relative;z-index:1;height:36px;line-height:36px;width:100%;border-radius:2px;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;background-color:#ffffff;text-align:center;mui-prepared:;-moz-box-sizing:border-box;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" tabindex="0" type="button" data-reactid="116">
            <div data-reactid="117">
             <div style="height:36px;border-radius:2px;background-color:;transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;top:0;mui-prepared:;-webkit-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;-moz-transition:all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;" data-reactid="118">
              <span style="position:relative;opacity:1;font-size:14px;letter-spacing:0;text-transform:uppercase;font-weight:500;margin:0;user-select:none;padding-left:16px;padding-right:16px;color:rgba(0, 0, 0, 0.87);mui-prepared:;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;" data-reactid="119">Modal Dialog</span>
             </div>
            </div></button>
          </div>
          <!-- react-empty: 120 -->
         </div></td>
       </tr>
      </tbody>
     </table>
     <button data-reactid="121">加载widget</button>
    </div>
    <div class="footer" data-reactid="122">
     Footer
    </div>
   </div>
  </div>
  <script charset="UTF-8" data-reactid="11">
   window.__data = {
    //routing来自于combineReducer的react-router
    "routing": {
        "locationBeforeTransitions": {
            "pathname": "\u002Fwidget",
            "search": "",
            "hash": "",
            "action": "POP",
            "key": null,
            "query": {}
        }
    },
     //reduxAsyncConnect来自于combineReducer
    "reduxAsyncConnect": {
        "loaded": true
    },
    //auth来自于combineReducer
    "auth": {
        "loaded": true,
        "loading": false,
        "user": null
    },
    //form来自于combineReducer中的redux-form
    "form": {},
    //multireducer来自于combineReducer
    "multireducer": {
        "counter1": {
            "count": 0
        },
        "counter2": {
            "count": 0
        },
        "counter3": {
            "count": 0
        }
    },
   //info来自于combineReducer
    "info": {
        "loaded": true,
        "loading": false,
        "data": {
            "message": "This came from the api server",
            "time": 1496386316261
        }
    },
     //connect来自于combineReducer
    "connect": {
        "connected": false
    },
    //recipeGrid来自于combineReducer的violet-paginator
    "recipeGrid": {
        "removing": [],
        "loadError": null,
        "sortReverse": false,
        "updating": [],
        "requestId": null,
        "totalCount": 0,
        "page": 1,
        "pageSize": 15,
        "isLoading": false,
        "initialized": false,
        "results": [],
        "stale": false,
        "massUpdating": [],
        "filters": {},
        "sort": ""
    },
     //widgets来自于combineReducer
    "widgets": {
        "loaded": true,
        "editing": {},
        "saveError": {},
        "loading": false,
        "data": [{
            "id": 1,
            "color": "Red",
            "sprocketCount": 7,
            "owner": "John"
        },
        {
            "id": 2,
            "color": "Taupe",
            "sprocketCount": 1,
            "owner": "George"
        },
        {
            "id": 3,
            "color": "Green",
            "sprocketCount": 8,
            "owner": "Ringo"
        },
        {
            "id": 4,
            "color": "Blue",
            "sprocketCount": 2,
            "owner": "Paul"
        }],
        "error": null
    }
};
  </script>
  <script src="http://localhost:8091/dist/main-3dbb874c116423a8ee43.js" charset="UTF-8" data-reactid="12"></script> 
 </body>
</html>
```
你可以查看[react-universal-bucket这个例子](https://github.com/liangklfangl/react-universal-bucket)。上面是renderToString输出的内容，你要学会关注*data-react-checksum*和*data-reactid*和*window.__data*

### 4.renderToString的真实作用
#### 4.1 renderToString本身是静态的
之所以说renderToString是静态的，是因为其如果仅仅是调用它来渲染组件树那么其只是一个模版语言而已。React提供了一个API用于将虚拟DOM树在服务端环境下进行渲染，这个API是ReactDom/server中的renderToString。这个方法接受一个虚拟DOM树，并*返回一个渲染后的HTML字符串*，例如我有一个根级组件Root，我便可以使用下列语句得到结果：
```js
import {renderToString} from 'ReactDom/server';
const markup = renderToString(
    <Root />
);
```
markup即为渲染后的结果。renderToString这个方法是服务端渲染的基础，但如果只是单纯这样使用，那么基本等于将React作为一个复杂很多的*模板语言*来写而已，因为*这个渲染并不会理会任何的ajax请求(没有请求也就是说在渲染我们组件之前无法自定义组件需要的数据，这是硬伤!!可以使用下文的redux的Provider将store中的数据传递给我们的组件来解决)，同时也不会根据url来做任何路由，它只会在第一次render方法调用后结束*。这也就是说render方法之后的所有生命周期函数都不会被触发，在一次服务端渲染中，*只有constructor、componentWillMount和render会被各触发一次，并且在期间使用setState也是没有意义的*。

这显然不是我们期望的，为了愉快得满足我们的须有，这里有两个问题需要解决：
<pre>
(1)路由(使用react-router来监听location变化从而重新渲染组件，此处不做讲解)。
(2)ajax请求(而不是将React作为一个模板语言，先发送ajax请求获取到store状态再渲染组件树，redux-async-connect完成或者中间件自己处理)。
</pre>

#### 4.2 renderToString结合redux处理ajax请求
(1)通过redux-async-connect来处理ajax请求并自动渲染

由于服务端渲染只会走一遍生命周期，并且在第一次render后便会停止，所以想要真正渲染出最终的页面，我们必须在第一次渲染前就将状态准备好。这也就是说，我们必须要有一次超前的ajax请求实现获取状态，然后来根据这个状态渲染我们最终的组件树：

```js
function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}\/>));
}
//这里的match方法是在express的中间件中处理
match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
      //重定向要添加pathname+search
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      //loadOnServer和ReduxAsyncConnect来自于redux-async-connect库
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
            //这里不是 <RouterContext {...renderProps} />
            //https://zhuanlan.zhihu.com/p/22875338
          <\/Provider>
        );
        res.status(200);
        global.navigator = {userAgent: req.headers['user-agent']};
        res.send('<!doctype html>\n' +
          renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store}\/>));
         //component表示要渲染为html字符串的组件树，store来自于redux
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}
```
在Provider中我们提供了一个store属性，我们看看Html组件的处理逻辑你就明白了:

```js
import React, {Component, PropTypes} from 'react';
import {renderToString} from 'react-dom/server';
import serialize from 'serialize-javascript';
// https://github.com/liangklfang/serialize-javascript
import Helmet from 'react-helmet';
export default class Html extends Component {
  render() {
    const {assets, component, store} = this.props;
    const content = component ? renderToString(component) : '';
    //我们的component属性表示最外层组件为Provider,其会接收redux的store作为参数
    const head = Helmet.rewind();
    return (
      <html lang="en-us">
        <head>
          {Object.keys(assets.styles).map((style, key) =>
            <link href={assets.styles[style]} key={key} media="screen, projection"
                  rel="stylesheet" type="text/css" charSet="UTF-8"/>
          )}
        </head>
        <body>
          <div id="content" dangerouslySetInnerHTML={{__html: content}}/>
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())};`}} charSet="UTF-8"/>
          //返回服务端store的状态
          <script src={assets.javascript.main} charSet="UTF-8"/>
        </body>
      </html>
    );
  }
}
```
我们的组件接收的component属性为组件树，该组件树会被渲染为html字符串。而我们的store属性来自于我们的redux中的store，我们会调用*store.getState()*将当前的store的状态返回给客户端。此时客户端就有了渲染页面的所有数据了，通过window.__data就可以获取到服务端渲染的store的状态,从而服务端和客户端的store状态就同步了。同时我们要注意上面的这段代码:

```js
   const content = component ? renderToString(component) : '';
```
下面是我们的要渲染的component组件树内容:

```js
 const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
            //这里不是 <RouterContext {...renderProps} />
            //https://zhuanlan.zhihu.com/p/22875338
          <\/Provider>
    );
```
很显然，我们的Provider将store放到了context中，从而所有的下级组件都能获取到该context中的store。文章一开头就说了renderProps的签名了,该属性传入了ReduxAsyncConnect，其包含了*routes,params,location,components,router,matchContext等*，这样我们就可以根据我们自己的数据来渲染组件了(ReduxAsyncConnect本身就是处理ajax异步请求，保证数据加载完成再进行渲染)。上面给出的例子中所有的ajax请求是通过ReduxAsyncConnect自动完成了，如下:

```js
import { asyncConnect } from 'redux-async-connect';
@asyncConnect([{
  deferred: true,
  promise:({store:{dispatch,getState}}) =>{
   //判断我们的state中是否有widget,同时loaded属性是否是true，如果为true表示加载过一次数据
   //否则我们手动加载数据。但是是在页面发生跳转之后才加载数据
    if(!isLoaded(getState())){
      return dispatch(loadWidgets());
      //注意这里必须要返回return，因为这是对dispatch进行增强的逻辑，所以必须有return才可以
    }
  }
}])
```
(2)手动处理ajax请求来设置store的初始状态

但是我们也可以自己来处理ajax请求，请看下面的例子(来自于参考文献中文章):

```js
//在中间件中处理就可以了，拦截特定的请求
function serverSideRender(req, res) {
    request.get(url)
    .then(response => normalRender(res, response))
    .catch(err => render500(res, err))
}
```
在自己定义的normalRender这个方法里，我们可以通过Redux提供的createStore方法的第二个参数来进行创建带有初始状态的store，然后将这个状态送入根组件，并执行后续的渲染：

```js
function normalRender(res, response) {
    // 假设response的响应体中就包含了所有状态信息
    const initState = response.body;
    const store = createStore(reducers, initState);
    //发送ajax请求得到的数据(服务器端自动完成ajax请求)
    const markup = renderToString(
        <Provider store={store}>
            <APP />
        <\/Provider>
    );
    // 将markup和最终的state塞到模板内渲染，这个模板取决于使用的模板引擎，也可以直接字符串替换。也就是将我们的服务端store状态发送到客户端，保证store的状态同步
    return res.render(template, {
        markup,
        finalState: store.getState().toJSON()
    });
}
```
这个方法以响应结果为初始化状态渲染DOM，并将渲染后的结果塞入模板，值得注意的是，渲染参数里面有个finalState，这是初次渲染后、store的最终状态，我们需要将其序列化后强制写到返回的HTML的script标签中，将其赋予一个、例如叫initState的变量中，这样最终返回的HTML结构如下：

```js
<html>
    <head>
        ......
        <script>window.initState = {{finalState}}</script>
    </head>
    <body>
        <div id="react-container"><div>{{markup}}</div></div>
    </body>
</html>
```
window.initState便拥有了我们服务端渲染后的状态，如此，客户端便有了一个途径来根据这个状态来*初始化客户端的store*，并接续接下来的操作，这实质上是完成了服务端和客户端之间状态的对接。




参考资料：

[【React/Redux】深入理解React服务端渲染](https://zhuanlan.zhihu.com/p/22875338)

[【React/Redux/Router/Immutable】React最佳实践的正确食用姿势](https://zhuanlan.zhihu.com/p/22874997)

[server-rendering](https://github.com/liangklfang/BlogReworkPro)
