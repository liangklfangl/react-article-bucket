var React = require('react');
var ReactDOM = require('react-dom');
// table类
var Table = require('./Table');
// 得到一个Table实例
var table = React.createFactory(Table);
// 数据源
var datas = require('./data');
// render方法把react实例渲染到页面中 https://facebook.github.io/react/docs/top-level-api.html#reactdom
ReactDOM.render(
    table({datas: datas}),
    //直接调用table组件的时候，传入一个对象{datas:datas}就是props
    document.getElementById("react-content")
);