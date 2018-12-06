### 备注
该部分只列举那些稍微难以理解的typescript的泛型相关内容，详细内容可以参考[TypeScript官网](http://www.typescriptlang.org/docs/handbook/generics.html)。

### 1.泛型说明
```js
function identity(arg: any): any {
    return arg;
}
```
上面的参数和返回值都是any类型，所以它本身就是一个泛型，但是可以通过更加优雅的方式来完成:
```js
// 1.第一个T表示为identity函数定义的一个类型变量，用于获取用户输入的类型，比如number
// 2.第二个T表示该函数接受的参数
// 3.第三个T表示函数的返回值
function identity<T>(arg: T): T {
    return arg;
}
```
调用泛型的方式有两种，第一种是传入所有的参数，包括参数类型:
```js
let output = identity<string>("myString");  
// type of output will be 'string'
// 注意T是通过<>尖括号指定
```
第二种方式也是最常用的，依赖于编译器根据用户传入的值自动设置类型:
```js
let output = identity("myString");  // type of output will be 'string'
```
但是建议按照第一种方式指定下类型，在复杂情景下并不能保证编译器的自动识别准确性。

### 2.泛型变量
对于上面的例子，直接访问arg.length将会抛出错误，因为arg不一定有length属性，所以可以使用泛型变量:
```js
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  
    // Array has a .length, so no more error
    return arg;
}
```
当然也可以通过如下的方式书写:
```js
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  
    // Array has a .length, so no more error
    return arg;
}
```

### 3.泛型类型
```js
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <T>(arg: T) => T = identity;
```
泛型函数与非泛型函数一样，先写泛型参数，和函数声明一样。我们也可以为泛型参数使用不同的名称:
```js
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: <U>(arg: U) => U = identity;
```
我们甚至可以在调用参数(call signature)中使用泛型:
```js
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: {<T>(arg: T): T} = identity;
```
下面写第一个泛型接口，我们将上例的对象常量移动到接口中:
```js
// 泛型接口
interface GenericIdentityFn {
    <T>(arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn = identity;
```
相似的，可能想要将泛型参数作为接口的参数。这样类型参数将会对所有接口成员可见:
```js
interface GenericIdentityFn<T> {
    (arg: T): T;
}
function identity<T>(arg: T): T {
    return arg;
}
let myIdentity: GenericIdentityFn<number> = identity;
```

### 4.泛型类
泛型类和泛型接口类似，泛型类接受一个泛型的参数,该参数在类名括号内部。
```js
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}
let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
//赋值
myGenericNumber.add = function(x, y) { return x + y; };
// 赋值函数
```
该例子使用的是number类型，其实也可以使用string类型,甚至更复杂的场景:
```js
let stringNumeric = new GenericNumber<string>();
stringNumeric.zeroValue = "";
stringNumeric.add = function(x, y) { return x + y; };
console.log(stringNumeric.add(stringNumeric.zeroValue, "test"));
```
注意:**泛型类的泛型表现在实例上而不是在静态成员上**，因此当使用类的时候，静态成员是不能使用泛型类型的。

### 5.泛型约束
#### 5.1 普通约束
上面length的例子，typescript告诉我们不能假设T有length属性，其实可以采用下面的方式来解决:
```js
interface Lengthwise {
    length: number;
}
function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  
    // Now we know it has a .length property, so no more error
    return arg;
}
```
现在泛型函数已经被约束了，它不再对所有的类型起作用:
```js
loggingIdentity(3);  // Error, number doesn't have a .length property
```
所有需要传入的参数有length参数:
```js
loggingIdentity({length: 10, value: 3});
```

#### 5.2 泛型约束使用Type参数
你可以声明一个类型参数，该参数受另外一个参数的约束:
```js
function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];
}
let x = { a: 1, b: 2, c: 3, d: 4 };
getProperty(x, "a"); // okay
getProperty(x, "m"); 
// error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.
```

#### 5.3 泛型中使用class类型
当使用泛型去创建工厂函数，此时需要依赖于构造函数推断类型:
```js
function create<T>(c: {new(): T; }): T {
    return new c();
}
```
下面是稍微复杂的使用prototype属性去推断和约束构造函数以及实例关系的例子:
```js
class BeeKeeper {
    hasMask: boolean;
}
class ZooKeeper {
    nametag: string;
}
class Animal {
    numLegs: number;
}
class Bee extends Animal {
    keeper: BeeKeeper;
}
class Lion extends Animal {
    keeper: ZooKeeper;
}
// c: A的意思是，c的类型是A，但这个函数的目的不是要求c的类型是A，而是要求c就是A。
// createInstance函数的参数是一个Class，返回值是这个Class的实例。
// https://segmentfault.com/q/1010000014470603
function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}
createInstance(Lion).keeper.nametag;  // typechecks!
createInstance(Bee).keeper.hasMask;   // typechecks!
```
更多内容请[查看官网](http://www.typescriptlang.org/docs/handbook/generics.html)。
