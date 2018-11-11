import JSXParser from "./lexureParser";
var rComponent = /^(this|[A-Z])/;
var cacheFns = {};
var cacheStr = {};

function evalJSX(str, obj) {
  var jsx = new innerClass(str);
  var output = jsx.init();
  if (!obj) obj = {};
  var args = "var args0 = arguments[0];";
  //第二个
  // var name = args0["name"]
  for (var i in obj) {
    if (i !== "this") args += "var " + i + ' = args0["' + i + '"];';
  }
  args += "return " + JSON.stringify(output);
  // 真实的返回值
  try {
    var fn;
    if (cacheFns[args]) {
      fn = cacheFns[args];
    } else {
      fn = cacheFns[args] = Function(args);
    }
    //匿名函数anonymous function
    var a = fn.call(obj.this, obj);
    return a;
  } catch (e) {
    console.log(e, args);
  }
}

/**
 * str:解析的jsx文本
 */
function innerClass(str, config) {
  this.input = str;
}

innerClass.prototype = {
  /**
     * 实例化方法
     */
  init: function() {
    if (typeof JSXParser === "function") {
      // 720字符下会做缓存
      var useCache = this.input.length < 720;
      if (useCache && cacheStr[this.input]) {
        return cacheStr[this.input];
      }
      var array = new JSXParser(this.input).parse();
      return array;
    } else {
      throw "必须引入相应的jsx解析器";
    }
  }
};
export default evalJSX;
