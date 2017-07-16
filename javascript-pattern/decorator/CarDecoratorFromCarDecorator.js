var PowerLocksDecorator = function(car) {
    // 这是JavaScript里调用父类构造函数的方式
    CarDecorator.call(this, car);
    console.log('装配：添加动力锁');
}
PowerLocksDecorator.prototype = new CarDecorator();
PowerLocksDecorator.prototype.drive = function() {
    // 你可以这么写
    this.car.drive();
    // 或者你可以调用父类的drive方法：
    // CarDecorator.prototype.drive.call(this);
    console.log('车门自动上锁');
}


var PowerWindowsDecorator = function(car) {
    CarDecorator.call(this, car);
    console.log('装配：添加动力表盘');
}
PowerWindowsDecorator.prototype = new CarDecorator();

var ACDecorator = function(car) {
    CarDecorator.call(this, car);
    console.log('装配：添加空调');
}
ACDecorator.prototype = new CarDecorator();
ACDecorator.prototype.start = function() {
    this.car.start();
    console.log('冷风吹起来');
}
