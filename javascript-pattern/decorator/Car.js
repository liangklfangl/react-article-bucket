var Car = function() {
    console.log('装配(assemble)：组建车架，添加主要部件');
}

// 装饰者也需要实现这些方法，遵守Car的接口
Car.prototype = {
    start: function() {
        console.log('伴随着引擎的轰鸣声，车子发动了！');
    },
    drive: function() {
        console.log('走起!');
    },
    getPrice: function() {
        return 11000.00;
    }
}
