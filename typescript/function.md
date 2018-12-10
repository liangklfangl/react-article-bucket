### 备注
该部分只列举那些稍微难以理解的typescript的function相关内容，详细内容可以参考[TypeScript官网](http://www.typescriptlang.org/docs/handbook/functions.html)。

### 1.typescript的function
```js
// myAdd has the full function type
let myAdd = function(x: number, y: number): number { return  x + y; };
// The parameters 'x' and 'y' have the type number
// 函数必须有参数和返回值，宽箭头之前是参数，之后是返回值
let myAdd: (baseValue: number, increment: number) => number =
    function(x, y) { return x + y; };
```

### 2.可选和默认参数
在TypeScript中，每一个参数都被认为是必须的，但是可以是null或者undefined。但是调用函数传入的参数数量必须和函数本身期望的参数数量一致。
```js
function buildName(firstName: string, lastName: string) {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob");                  // error, too few parameters
let result2 = buildName("Bob", "Adams", "Sr.");  // error, too many parameters
let result3 = buildName("Bob", "Adams");         // ah, just right
```
当然你也可以设置一个参数为可选,比如下面的lastName，可以通过**?**修饰:
```js
function buildName(firstName: string, lastName?: string) {
    if (lastName)
        return firstName + " " + lastName;
    else
        return firstName;
}
let result1 = buildName("Bob");                  
// works correctly now
let result2 = buildName("Bob", "Adams", "Sr.");  
// error, too many parameters
let result3 = buildName("Bob", "Adams");
// ah, just right
```
也可以通过如下方式设置默认值,此时用户**不传入或者传入的是null也会被设置为默认值**:
```js
function buildName(firstName: string, lastName = "Smith") {
    return firstName + " " + lastName;
}
let result1 = buildName("Bob");                  
// works correctly now, returns "Bob Smith"
let result2 = buildName("Bob", undefined);      
 // still works, also returns "Bob Smith"
 // 即使用户传入了undefined或者null也会返回默认值~
let result3 = buildName("Bob", "Adams", "Sr.");  
// error, too many parameters
let result4 = buildName("Bob", "Adams");         
// ah, just right
```
所有必选参数后面的默认实例化的参数都被认为是可选的，和可选参数一样，在调用的时候可以忽略。同时，可选参数和默认参数的type被认为和前一个必选参数是一样的:
```js
function buildName(firstName: string, lastName?: string) {
    // ...
}
```
和下面的函数:
```js
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
```
的类型都是如下格式:
```js
(firstName: string, lastName?: string) => string
```

### 3.Rest参数
```js
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}
// 在js中使用arguments
let employeeName = buildName("Joseph", "Samuel", "Lucas", "MacKinzie");
```
也可以通过如下方式书写:
```js
function buildName(firstName: string, ...restOfName: string[]) {
    return firstName + " " + restOfName.join(" ");
}
let buildNameFun: (fname: string, ...rest: string[]) => string = buildName;
// 前面是参数和返回值
```

