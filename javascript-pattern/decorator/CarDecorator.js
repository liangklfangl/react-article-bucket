var CarDecorator = function(car) {
    this.car = car;
}
// CarDecorator实现相同的接口
// 1.这是我们对于Car本身的装饰，我们接受一个Car对象作为装饰器的参数
// 这是基本的装饰器模式，我们后续的装饰器模式都会继承这个基本的装饰器
CarDecorator.prototype = {
    start: function() {
        this.car.start();
    },
    drive: function() {
        this.car.drive();
    },
    getPrice: function() {
        return this.car.getPrice();
    }
}
