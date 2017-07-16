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
   toString(){
    return `防御力:${this.def},攻击力:${this.atk},血量:${this.hp}`;
  }
}
var tony = new Man();
console.log(`当前状态 ===> ${tony}`);
