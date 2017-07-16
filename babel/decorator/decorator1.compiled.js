"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _desc, _value, _class;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object['ke' + 'ys'](descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;

  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }

  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);

  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }

  if (desc.initializer === void 0) {
    Object['define' + 'Property'](target, property, desc);
    desc = null;
  }

  return desc;
}

function decorateArmour(target, key, descriptor) {
  console.log("target====", target.constructor);
  //防御力:undefined,攻击力:undefined,血量:undefined
   console.log("key====",key);
  //init
    console.log("descriptor====",descriptor);
  // { value: [Function: init],
  // writable: true,
  // enumerable: false,
  // configurable: true }
  var method = descriptor.value;
  var moreDef = 100;
  var ret = void 0;
  descriptor.value = function () {
    console.log('arguments====',arguments);
    // { '0': 2, '1': 3, '2': 3 }
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    args[0] += moreDef;
    //操作数组中的第一个元素
    ret = method.apply(target, args);
    //执行以前的函数并传入新的参数就可以了
    return ret;
  };
  return descriptor;
}

var Man = (_class = function () {
  function Man() {
    var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2;
    var atk = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
    var hp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 3;

    _classCallCheck(this, Man);

    this.init(def, atk, hp);
  }

  _createClass(Man, [{
    key: "init",
    value: function init(def, atk, hp) {
      this.def = def; // 防御值
      this.atk = atk; // 攻击力
      this.hp = hp; // 血量
    }
  }, {
    key: "toString",
    value: function toString() {
      return "\u9632\u5FA1\u529B:" + this.def + ",\u653B\u51FB\u529B:" + this.atk + ",\u8840\u91CF:" + this.hp;
    }
  }]);

  return Man;
}(), (_applyDecoratedDescriptor(_class.prototype, "init", [decorateArmour], Object.getOwnPropertyDescriptor(_class.prototype, "init"), _class.prototype)), _class);


var tony = new Man();

console.log("\u5F53\u524D\u72B6\u6001 ===> " + tony);
// 输出：当前状态 ===> 防御力:102,攻击力:3,血量:3

