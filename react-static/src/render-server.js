/*----(1)下面的组件用于服务端渲染的时候是通过写死prop给组件的----*/

// // 与客户端require('react-dom')略有不同
// var React = require('react');

// // 与客户端require('react-dom')略有不同
// var ReactDOMServer = require('react-dom/server');

// // table类
// var Table = require('./Table');
// // table实例
// var table = React.createFactory(Table);
// const datas = require("./data.js");
// module.exports = function () {
//     return ReactDOMServer.renderToString(table({datas: datas}));
// };
/*-----(2)下面的组件用于服务端渲染的时候是调用组件的static方法完成，而客户端使用componentDidMount周期函数-----*/
var React = require('react');
var ReactDOMServer = require('react-dom/server');
// table类
var Table = require('./Table');
// table实例
var table = React.createFactory(Table);
module.exports = function (callback) {
	//在客户端调用Data.fetch时，是发起ajax请求，而在服务端调用Data.fetch时，
	//有可能是通过UDP协议从其他数据服务器获取数据、查询数据库等实现
    Table.fetchData(function (datas) {
        var html = ReactDOMServer.renderToString(table({datas: datas}));
        callback.call(null, html);
    });
};