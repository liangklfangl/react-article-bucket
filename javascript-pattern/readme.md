### 1.装饰者模式
这个模式允许我们不通过子类继承的方式给对象(即*Car*)添加新功能。相反我们用另一个已经添加了功能的并有相同接口的对象来装饰（包裹）它。比如我们的Car对象，我们提供了具有*同样接口*的CarDecorator对象来进行装饰，以后如果需要为Car添加不同的功能，我们就可以通过*继承CarDecorator而不是继承Car*来进行。这样，我们不会写出下面的代码:

```js
/ 父类
var Car = function() {...};
// 有不同功能的子类，通过继承Car来实现
var CarWithPowerLocks = function() {...};
var CarWithPowerWindows = function() {...};
var CarWithPowerLocksAndPowerWindows = function() {...};
var CarWithAC = function() {...};
var CarWithACAndPowerLocks = function() {...};
var CarWithACAndPowerWindows = function() {...};
var CarWithACAndPowerLocksAndPowerWindows = function() {...};
```
即为了给我们的Car添加不同的功能，我们都需要重新定义一个新的class，功能不多的情况下还好，一但功能开始增加，它就会变成你的恶梦。因此，我们强烈推荐使用装饰者模式。装饰者对象有如下的特点:

（1） 装饰对象和真实对象有相同的接口。这样客户端对象就能*以和真实对象相同的方式和装饰对象交互*

（2） 装饰对象包含一个真实对象的引用（reference）,即在装饰对象中我们this.car=car

（3） 装饰对象接受所有来自客户端的请求。*它把这些请求转发给真实的对象*，即调用真实对象的方法

（4） 装饰对象可以在转发这些请求以前或以后增加一些附加功能。这样就确保了在运行时，不用修改给定对象的结构就可以在外部增加附加功能。在面向对象的设计中，通常是通过继承来实现对给定类的功能扩展

我们的装饰者模式适合以下的情况:

(1). 需要扩展一个类的功能，比如添加方法，或给一个类*添加附加职责*

(2). 需要动态的给一个对象添加功能，这些功能可以再动态的撤销。即不会影响最终的Car对象功能

(3). 需要增加由一些基本功能的排列组合而产生的非常大量的功能，从而使继承关系变的不现实。

(4). 当*不能采用生成子类的方法*进行扩充时。一种情况是，可能有大量*独立的扩展*，为支持每一种组合将产生大量的子类，使得子类数目呈爆炸性增长。另一种情况可能是因为类定义被隐藏，或类定义不能用于生成子类。

具体的代码示例，你可以[点击这里](./decorator)。



参考资料:

[【译】JavaScript设计模式：装饰者模式](http://www.codingserf.com/index.php/2015/05/javascript-design-patterns-decorator/)

[ES7 Decorator 装饰者模式](http://taobaofed.org/blog/2015/11/16/es7-decorator/)

