#### 1.关于decorator的几个例子
例子1：纯粹的装饰模式(对方法进行装饰)

纯粹的装饰模式指的是不增加对原有类的接口，只是对原有类的方法进行装饰而已。

```js
function decorateArmour(target, key, descriptor) {
  const method = descriptor.value;
  //这里的method指的是init方法
  let moreDef = 100;
  let ret;
  //对我们默认的init方法进行装饰，重新赋值。这里的...args表示我们在调用init方法时候传入的参数，即对参数进行了截获，然后进行处理
  descriptor.value = (...args)=>{
    args[0] += moreDef;
    ret = method.apply(target, args);
    //对截获的参数进行处理，从而继续调用我们的init方法。第一个参数表示this(其值为Man.prototype)，而第二个参数表示传入init方法的参数，而且这个参数已经被装饰过了
    return ret;
  }
  return descriptor;
}

class Man{
  constructor(def = 2,atk = 3,hp = 3){
    this.init(def,atk,hp);
  }
  @decorateArmour
  init(def,atk,hp){
    this.def = def; // 防御值
    this.atk = atk;  // 攻击力
    this.hp = hp;  // 血量
  }
  toString(){
    return `防御力:${this.def},攻击力:${this.atk},血量:${this.hp}`;
  }
}

var tony = new Man();
console.log(`当前状态 ===> ${tony}`);
// 输出：当前状态 ===> 防御力:102,攻击力:3,血量:3
```
这里有几个地方需要注意：

(1)decorateArmour方法中第一个参数target指的是Man这个class的*原型对象*，你可以直接运行"node decorator1.compiled.js"，你会发现我们可以执行输出target.constructor为如下的函数:

```js
function Man() {
    var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
    var atk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var hp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;
    _classCallCheck(this, Man);
    this.init(def, atk, hp);
  }
```

(2)decorator函数中第二个参数表示我们要包装的这个函数的函数名称

(3)decorator函数中第三个参数表示我们要包装的这个函数的描述符，如下所示:

```js
 { value: [Function: init],
  writable: true,
  enumerable: false,
  configurable: true 
}
```
如果我们要对函数进行装饰，其实就是对descriptor.value进行处理而已，因为writable,enumerable,configurable只是对于这个函数的描述，而value才是调用init函数的时候执行的方法。

(4)某一个方法中可以同时经过多个decorator的装饰，而且互不干扰，从而对原类的侵入性非常小


例子2：对类进行装饰
下面的装饰器直接作用于类本身。

```js
function decorateArmour(target, key, descriptor) {
  const method = descriptor.value;
  let moreDef = 100;
  let ret;
  descriptor.value = (...args)=>{
    args[0] += moreDef;
    ret = method.apply(target, args);
    return ret;
  }
  return descriptor;
}
function addFly(canFly){
  return function(target){
    //使用装饰器对类进行装饰，那么我们的target就是类本身
    target.canFly = canFly;
    let extra = canFly ? '(技能加成:飞行能力)' : '';
    let method = target.prototype.toString;
    //获取类的prototype.toString方法，并且对该方法进行装饰
    target.prototype.toString = (...args)=>{
      return method.apply(target.prototype,args) + extra;
    }
    return target;
  }
}

@addFly(true)
class Man{
  constructor(def = 2,atk = 3,hp = 3){
    this.init(def,atk,hp);
  }
  @decorateArmour
  init(def,atk,hp){
    this.def = def;
    // 防御值
    this.atk = atk;
     // 攻击力
    this.hp = hp;
     // 血量
  }
}
var tony = new Man();
console.log(`当前状态 ===> ${tony}`);
```
这里要注意：我们在对类进行装饰的时候传入的target就是类本身，即Man这个函数(babel编译后为一个函数)。











参考资料:

[ES7 Decorator 装饰者模式](http://taobaofed.org/blog/2015/11/16/es7-decorator/)

[【译】JavaScript设计模式：装饰者模式](http://www.codingserf.com/index.php/2015/05/javascript-design-patterns-decorator/)
