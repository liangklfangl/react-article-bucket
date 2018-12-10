### 备注
该部分只列举那些稍微难以理解的typescript的interface相关内容，详细内容可以参考[TypeScript官网](http://www.typescriptlang.org/docs/handbook/interfaces.html)。

### 1.接口基本使用
```js
function printLabel(labelledObj: { label: string }) {
    console.log(labelledObj.label);
}
let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```
下面使用接口来定义一种类型实现同样的功能:
```js
interface LabelledValue {
    label: string;
}
function printLabel(labelledObj: LabelledValue) {
    console.log(labelledObj.label);
}
let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

### 2.接口可选参数
```js
interface SquareConfig {
    color?: string;
    width?: number;
}
// 接受的参数为SquareConfig类型，返回值有{color,area}两个属性值
function createSquare(config: SquareConfig): {color: string; area: number} {
    let newSquare = {color: "white", area: 100};
    if (config.color) {
        newSquare.color = config.color;
    }
    if (config.width) {
        newSquare.area = config.width * config.width;
    }
    return newSquare;
}

let mySquare = createSquare({color: "black"});
```
下面是接口函数定义的例子:
```js
interface SearchFunc {
    (source: string, subString: string): boolean;
}
// 下面是具体实现
let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    let result = source.search(subString);
    return result > -1;
}
```

### 3.Indexable类型
```js
interface StringArray {
    [index: number]: string;
}
let myArray: StringArray;
myArray = ["Bob", "Fred"];
let myStr: string = myArray[0];
```
更多内容请在[官网阅读](http://www.typescriptlang.org/docs/handbook/interfaces.html)。

### 4.Class类型
```js
interface ClockInterface {
    currentTime: Date;
}
class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```
你也可以描述接口中的某一个方法，这个方法将会在class中实现掉，例如下面的例子:
```js
interface ClockInterface {
    currentTime: Date;
    setTime(d: Date);
}
// 实现掉setTime,currentTime
class Clock implements ClockInterface {
    currentTime: Date;
    setTime(d: Date) {
        this.currentTime = d;
    }
    constructor(h: number, m: number) { }
}
```

### 5.静态和实例Class类型区别
在使用class和interface的时候，你需要知道类有两种:**静态的和实例的**。**你可能注意到如果你创建的接口有一个constructor，同时你尝试使用类去继承它，将会抛出错误**:
```js
interface ClockConstructor {
    new (hour: number, minute: number);
    // 构造函数
}
class Clock implements ClockConstructor {
    currentTime: Date;
    constructor(h: number, m: number) { }
}
```
这是因为，当某一个类继承了某个interface，只会检查类的实例化成员，而constructor存在于静态链上，从而不会被检测。下面的例子定义了两个接口，ClockConstructor用于构造函数，而ClockInterface用于实例方法,同时使用了一个构造函数createClock来产生传给它的类型的实例对象:
```js
interface ClockConstructor {
    // 构造函数
    new (hour: number, minute: number): ClockInterface;
}
// 实例方法
interface ClockInterface {
    tick();
}
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}
class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}
let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```
因为createClock的第一个参数类型是ClockConstructor，在createClock(AnalogClock, 7, 32)中将会检测AnalogClock有正确的构造函数签名。

### 6.接口继承
```js
interface Shape {
    color: string;
}
interface Square extends Shape {
    sideLength: number;
}
let square = <Square>{};
// Square类型
square.color = "blue";
square.sideLength = 10;
```
某一个接口也可以继承多个接口:
```js
interface Shape {
    color: string;
}
interface PenStroke {
    penWidth: number;
}
interface Square extends Shape, PenStroke {
    sideLength: number;
}
let square = <Square>{};
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

### 7.复杂类型
下面的接口同时指定函数和属性:
```js
interface Counter {
    (start: number): string;
    // constructor方法
    interval: number;
    // member
    reset(): void;
    // function
}
// 返回Counter类型
function getCounter(): Counter {
    let counter = <Counter>function (start: number) { };
    counter.interval = 123;
    counter.reset = function () { };
    return counter;
}
let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

### 8.接口继承class
当某一个接口继承了class，该接口会继承该类的所有成员，但是不会继承它的实现。包括了该类的private，protected方法和属性。这也就意味着当你创建了这样一个接口(包括private/protected)将只有子类能够实现它。
```js
class Control {
    private state: any;
}
// 接口继承类
interface SelectableControl extends Control {
    select(): void;
}
class Button extends Control implements SelectableControl {
    select() { }
}
class TextBox extends Control {
    select() { }
}
// Error: Property 'state' is missing in type 'Image'.
// Image类没有state属性
class Image implements SelectableControl {
    select() { }
}
class Location {
}
```
更多内容[移步官网](http://www.typescriptlang.org/docs/handbook/interfaces.html)阅读。
