// var React = require('react');
// var DOM = React.DOM;
// var table = DOM.table, tr = DOM.tr, td = DOM.td;
// module.exports = React.createClass({
//     render: function () {
//         return table({
//             //这里的Table组件接收到的props如果修改了那么组件就会重新渲染
//             //state也是一样的，这里直接调用了tr方法，第一个参数是属性，第二个是
//             //我们的子元素
//                 children: this.props.datas.map(function (data) {
//                     //为我们的每一个tr都添加一个"tr"的className属性
//                     return tr({className:"tr"},
//                         td(null, data.name),
//                         td(null, data.age),
//                         td(null, data.gender)
//                     );
//                 })
//             });
//     }
// });
/*-------------(1)上面的数据是固定的，下面服务器会自动拉取-----------*/
// var React = require('react');
// var ReactDOM = require('react-dom');

// var DOM = React.DOM;
// var table = DOM.table, tr = DOM.tr, td = DOM.td;

// var Data = require('./data');

// module.exports = React.createClass({
//     render: function () {
//         return table({
//                 children: this.props.datas.map(function (data) {
//                     return tr(null,
//                         td(null, data.name),
//                         td(null, data.age),
//                         td(null, data.gender)
//                     );
//                 })
//             });
//     },
//     //我们的客户端通过该方法可以每隔3s从服务端获取数据，并调用setState来更新组件
//     //状态，不过服务端是不可以的
//     componentDidMount: function () {
//         setInterval(function () {
//             Data.fetch('http://datas.url.com').then(function (datas) {
//                 this.setProps({
//                     datas: datas
//                 });
//             });
//         }, 3000)
//     }
// });
/*-------------(2)上面的数据是自动拉取的，对于服务端渲染不适用，因为componentDidMount
在渲染之前没有执行，所以render的时候没有数据。而且最重要的是componentDidMount在服务端
渲染的时候根本不会执行
-----------*/

var React = require('react');
var DOM = React.DOM;
var table = DOM.table, tr = DOM.tr, td = DOM.td;
var Data = require('./data');
module.exports = React.createClass({
    statics: {
        //获取数据在实际生产环境中是个异步过程，所以我们的代码也需要是异步的
        fetchData: function (callback) {
            Data.fetch().then(function (datas) {
                callback.call(null, datas);
            });
        }
    },
    render: function () {
        return table({
                children: this.props.datas.map(function (data) {
                    return tr(null,
                        td(null, data.name),
                        td(null, data.age),
                        td(null, data.gender)
                    );
                })
            });
    },
    componentDidMount: function () {
        setInterval(function () {
            // 组件内部调用statics方法时，使用this.constructor.xxx
            // 客户端在componentDidMount中获取数据，并调用setState修改状态要求
            // 组件重新渲染
            this.constructor.fetchData(function (datas) {
                this.setProps({
                    datas: datas
                });
            });
        }, 3000);
    }
});