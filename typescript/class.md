### 备注
该部分只列举那些稍微难以理解的typescript的class相关内容，详细内容可以参考[TypeScript官网](http://www.typescriptlang.org/docs/handbook/classes.html)。

### 1.public修饰符
在typescript中所有的成员变量和方法默认是public的。所以下面的代码是可以省略public的:
```js
class Animal {
    public name: string;
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```

### 2.private修饰符
```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
new Animal("Cat").name; // Error: 'name' is private;
```
上面的代码和java一样，不能访问name变量，必须通过public的get/set方法来完成。这里可能牵涉到
比较两种类型的兼容问题，在typescript中不管来源如何，**如果两种类型的所有成员都兼容，那么两种类型就是兼容的**。但是对于比较两种有private和protected的成员的类型来说，需要特殊考虑。如果一种类型有private，另一种类型也必须有private，而且两者必须来自于相同的定义。protected的类型也是同样的道理:
```js
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
class Rhino extends Animal {
    constructor() { super("Rhino"); }
}
class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");
animal = rhino;
animal = employee; // Error: 'Animal' and 'Employee' are not compatible
```
上面的animal和rhino被认为是兼容的，因为两者共享的是来自于Animal的name。而animal和employee却不是这样。所以赋值会抛出错误。

### 3.protected修饰符
protected和private大多数情况下都是一致的，区别在于:protected修饰的成员变量可以在**子类中访问**。
```js
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}
class Employee extends Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }
    // Employee是Person的子类，所以可以通过this访问父类protected的成员变量
    // 而对于private是不允许的
    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let howard = new Employee("Howard", "Sales");
console.log(howard.getElevatorPitch());
console.log(howard.name); // error
```
所以protected和private的不同之处在于父子关系的情况下子级是否可以访问父级protected修饰的变量。注意:**constructor也可以被修饰为protected，这意味着class不能在包含它的class体之外实例化，但是可以继承。**
```js
class Person {
    protected name: string;
    protected constructor(theName: string) { this.name = theName; }
}
// Employee can extend Person
// 构造函数声明为protected，可以被继承
class Employee extends Person {
    private department: string;
    constructor(name: string, department: string) {
        super(name);
        this.department = department;
    }
    // 继承依然可以通过this访问，上面例子已经说明了
    public getElevatorPitch() {
        return `Hello, my name is ${this.name} and I work in ${this.department}.`;
    }
}
let howard = new Employee("Howard", "Sales");
let john = new Person("John"); 
// Error: The 'Person' constructor is protected
```

### 4.readonly修饰符
通过readonly修饰符可以将某一个属性修饰为只读的。但是**readonly属性必须在声明的时候或者构造函数中被实例化**。
```js
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        // readonly是在外部不能直接赋值
        // 实例化以后就不能改变了
        this.name = theName;
    }
}
let dad = new Octopus("Man with the 8 strong legs");
dad.name = "Man with the 3-piece suit"; 
// error! name is readonly.
```
上面的readonly属性也可以直接作用到构造函数里面:
```js
class Octopus {
    readonly numberOfLegs: number = 8;
    constructor(readonly name: string) {
    }
}
```
构造函数变量除了可以通过readonly修饰外，还可以同时使用public,protected,private等，其和public,protected,private成员变量的效果是一致的。

### 5.Accessors访问器
TypeScript支持通过getter/setter拦截对于成员变量访问的精确控制。
```js
class Employee {
    fullName: string;
}
let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```
上面的这种方式简单粗暴，无法有效控制对于变量的任意setter，使用者可以在任何地方任何时候随意修改它。可以通过如下方式来完成控制:
```js
let passcode = "secret passcode";
class Employee {
    private _fullName: string;
    get fullName(): string {
        return this._fullName;
    }
    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}
let employee = new Employee();
employee.fullName = "Bob Smith";
if (employee.fullName) {
    console.log(employee.fullName);
}
```
对于访问器有以下注意事项:
> (1)你需要将处理器的compiler设置为输出ECMAScript 5的代码格式。不会向下兼容ECMAScript 3
> 
> (2)对于那些没有set只有get的处理器会被认为是只读的。

### 6.Static静态变量
Static变量或者方法存在于类上面而不是实例上面。
```js
class Grid {
    static origin = {x: 0, y: 0};
    // 1.默认是public实例可以直接访问
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        // 2.实例访问静态变量通过"类名.xxx"
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}
let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale
console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));
```

### 7.Abstract Classes抽象类
抽象类是所有其他的类的基类，而且不能直接实例化，和interface接口不一样的是，抽象类可以明确指定需要实现的细节。abstract关键字既能定义类也可以作用于类的方法:
```js
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log("roaming the earth...");
    }
}
```
对于**抽象类中的抽象方法在派生类中必须实现**。抽象方法和interface接口定义的语法类似，两者都是仅仅定义一个签名而没有具体的方法体。但是，**抽象方法必须有abstract关键字，同时也可以有[访问控制修饰符](https://baike.baidu.com/item/Access%20modifier/5155786)**。
```js
abstract class Department {
    constructor(public name: string) {
    }
    printName(): void {
        console.log("Department name: " + this.name);
    }
    abstract printMeeting(): void; 
    // must be implemented in derived classes
    // 派生类必须实现它
}

class AccountingDepartment extends Department {
    constructor() {
        super("Accounting and Auditing"); 
        // constructors in derived classes must call super()
    }
    printMeeting(): void {
        console.log("The Accounting Department meets each Monday at 10am.");
    }
    generateReports(): void {
        console.log("Generating accounting reports...");
    }
}
let department: Department;
 // ok to create a reference to an abstract type
 // 抽象类型可以创建一个引用
department = new Department(); 
// error: cannot create an instance of an abstract class
// 抽象类不能直接实例化
department = new AccountingDepartment(); 
// ok to create and assign a non-abstract subclass
// 抽象类类型可以赋值为派生类的实例引用
department.printName();
department.printMeeting();
department.generateReports();
 // error: method doesn't exist on declared abstract type
 // 注意:该方法不存在于声明的抽象类上，无法调用
```
更多高级内容查看[官网阅读](http://www.typescriptlang.org/docs/handbook/classes.html)。

