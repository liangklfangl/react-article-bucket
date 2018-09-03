const scriptRegex = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gm;
//detail:https://stackoverflow.com/questions/1441463/how-to-get-regex-to-match-multiple-script-tags
function escapeChars(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/'/g, '&acute;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/\|/g, '&brvbar;');
    return str;
}
// 驼峰转换下划线
export function toLine(name) {
  return name.replace(/([A-Z])/g,"_$1").toLowerCase();
}


//js判断变量真实数据类型
export function type(obj){
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  "Boolean Number String Function Array Date RegExp Object Error".split(" ").forEach(type=>{
     class2type[ "[object " + type + "]" ] = type.toLowerCase();
  });
  if ( obj == null ) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function" ?
  class2type[ toString.call(obj) ] || "object" :
  typeof obj;
}

/**
 * [encodeScript description]
 * @return {[type]} [description]
 */
export function encodeScript(str){
  return str.replace(scriptRegex,function(matched,$1,$2,$3){
   const replacedStr = escapeChars($1)+$2+escapeChars($3)
   return replacedStr;
  });
}


/**
 * { item_description }
 */
export function getQueryString = (name,isSpa) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
      results = regex.exec(isSpa ? location.hash :window.location.search.substr(1));
    return results == null ? "" : decodeURIComponent(results[1]);
  };

/**
 * { function_description }
 *
 * @param      {string}            x       { parameter_description }
 * @param      {string}            y       { parameter_description }
 * @return     {(boolean|string)}  { description_of_the_return_value }
 */
export function compare(x, y) {
    let p;
    if (typeof x === "number" && typeof y === "number" && isNaN(x) && isNaN(y)) {
      return true;
    }
    if (x === y) {
      return true;
    }
    if (typeof x === "function" && typeof y === "function") {
      if (
        (x instanceof RegExp && y instanceof RegExp) ||
        (x instanceof String || y instanceof String) ||
        (x instanceof Number || y instanceof Number)
      ) {
        return x.toString() === y.toString();
      } else {
        return false;
      }
    }

    if (x instanceof Date && y instanceof Date) {
      return x.getTime() === y.getTime();
    }

    if (!(x instanceof Object && y instanceof Object)) {
      return false;
    }
    if (x.prototype !== y.prototype) {
      return false;
    }
    if (x.constructor !== y.constructor) {
      return false;
    }

    for (p in y) {
      if (!x.hasOwnProperty(p)) {
        return false;
      }
    }

    for (p in x) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      if (typeof y[p] !== typeof x[p]) {
        return false;
      }

      if (!compare(x[p], y[p])) {
        return false;
      }
    }

    return true;
  }

/**
 * 深度克隆一个方法
 *
 * @param      {<type>}  obj     The object
 * @return     {Date}    { description_of_the_return_value }
 */
export function deepCopy(obj){
    const DATE_STRING ="[object Date]";
    if(Array.prototype.toString.call(obj)==DATE_STRING){
        return new Date(JSON.parse(JSON.stringify(obj)));
    }else{
      return JSON.parse(JSON.stringify(obj));
    }
}

/**
 * 产生唯一的key
 *
 * @type       {Array}
 */
const randomKeys = [];
export default function generateRandomKey() {
  let key = Math.random().toString().substring(2);
  while (randomKeys.includes(key)) {
    key = Math.random().toString().substring(2);
  }
  return key;
}

/**
* 转化为驼峰
**/
function toHump(name) {
    return name.replace(/\_(\w)/g, function(all, letter) {
        return letter.toUpperCase();
    });
}

/**
 *
 * @param {*} arr
 * @param {*} prop
 * 去重对象数组
 */
export function uniqueBy(arr, prop) {
  const res = new Map();
  return arr.filter(a => !res.has(a[prop]) && res.set(a[prop], 1));
}

/**
 * 递归获取第一个叶子节点
 */
export function getFirstItemRecersively(array,key) {
    let current = array[0] && array[0][key], focusedRace = {};
    while (current) {
        focusedRace = current && current[0];
        current = current[0] && current[0][key];
    }
    return focusedRace;
},

/**
* 反解密实体函数
*/
export function decodeHTMLEntities(text) {
    if (!text) {
        return '';
    }
    var entities = {
        'amp': '&',
        'apos': '\'',
        '#x27': '\'',
        '#x2F': '/',
        '#39': '\'',
        '#47': '/',
        'lt': '<',
        'gt': '>',
        'nbsp': ' ',
        'quot': '"'
    }
    return text.replace(/&([^;]+);/gm, function(match, entity) {
        return entities[entity] || match
    })
}

/**
 * 判断两个对象是否相同
 */
export function isObjEqual(obj1, obj2) {
  if (obj1 === obj2) {
    return true
  }
  else {
    const keys1 = Object.getOwnPropertyNames(obj1)
    const keys2 = Object.getOwnPropertyNames(obj2)
    if (keys1.length !== keys2.length) {
      return false
    }
    for (const key of keys1) {
      if (obj1[key] !== obj2[key]) {
        return false
      }
    }
    return true
  }
}

export function isEmptyObject( obj ) {
    var name;
    for ( name in obj ) {
        return false;
    }
    return true;
}


/**
 * 默认升序排列
 */
export function compare(property,asc=true) {
    return function(obj1, obj2) {
        var value1 = obj1[property];
        var value2 = obj2[property];
        return asc ? value1 - value2 : value2 - value1;
    }
}
