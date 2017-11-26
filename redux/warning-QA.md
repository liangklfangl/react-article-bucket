### 默认state的类型不正确
Warning: Failed prop type: Invalid prop `addProject` of type `boolean` supplied to `withRouter(HomePage)`, expected `object`.
    in withRouter(HomePage) (created by Connect(withRouter(HomePage)))
    in Connect(withRouter(HomePage)) (created by withSaga(Connect(withRouter(HomePage))))
    in withSaga(Connect(withRouter(HomePage))) (created by withReducer(withSaga(Connect(withRouter(HomePage)))))
    in withReducer(withSaga(Connect(withRouter(HomePage)))) (created by IndexPageRoute)
    in div (created by ContentWrap)
    in div (created by Basic)
    in Basic (created by Adapter)
    in Adapter (created by ContentWrap)
    in div (created by ContentWrap)
    in ContentWrap (created by IndexPageRoute)
    in IndexPageRoute (created by Route)
    in Route (created by App)
    in Switch (created by App)
    in div (created by BasicLayout)
    in BasicLayout (created by Adapter)
    in Adapter (created by App)
    in div (created by App)
    in App (created by WrappedApp)
    in Router (created by ConnectedRouter)
    in ConnectedRouter (created by WrappedApp)
    in Provider (created by WrappedApp)
    in WrappedApp

解决方法：请查看你的默认的state:
```js
const initialState = fromJS({
  pageNo: 1,
  pageSize: 10,
  total: 0,
  listData: [],
  startTime: "",
  endTime: "",
  fetchStatus: "",
  filterType: "false",
  subFilterType: "",
  askAdd: false,
  loading: false,
  openEditForm: false
});
```
