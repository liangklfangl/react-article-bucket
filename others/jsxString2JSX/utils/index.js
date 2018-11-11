import htmlComponents from "./htmlComponentType";
import React from "react";
import { message } from "antd";
const randomKeys = [];
/**
 * deserialize
 * https://github.com/yahoo/serialize-javascript
 */
export function deserialize(serializedJavascript, text, record, index) {
  let evaledValue = "";
  try {
    return eval("(" + serializedJavascript + ")");
  } catch (e) {}
}
/**
 * eval
 */
function globalEval(data) {
  return (window.execScript ||
    function(data) {
      window["eval"].call(window, data);
    })(data);
}
/**
 * random key
 */
export function generateRandomKey() {
  let key = Math.random()
    .toString()
    .substring(2);
  while (randomKeys.includes(key)) {
    key = Math.random()
      .toString()
      .substring(2);
  }
  return key;
}

/**
 * jsxArray:items with jsx funtion to search
 * closureCodeBox:Each jsx function closure code to insert
 */
export function reflectJSXRender(jsxArray, closureCodeBox = []) {
  let currentJSXIdx = 0;
  jsxArray.forEach((el, idx) => {
    Object.keys(el).map(key => {
      if (type(el[key]) == "function") {
        const renderHandle = el[key];
        el[key] = function(text, record, index) {
          const jsxObject = renderHandle();
          const localeJSXCode =
            closureCodeBox[currentJSXIdx] &&
            closureCodeBox[currentJSXIdx].trim()
              ? closureCodeBox[currentJSXIdx]
              : null;
          currentJSXIdx++;
          const flatternedJsx = flatternChildren(
            jsxObject,
            text,
            record,
            index,
            localeJSXCode
          );
          return flatternedJsx;
        };
      }
    });
  });
  return jsxArray;
}
/**
 * augmented typeof util function
 */
export function type(obj) {
  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  "Boolean Number String Function Array Date RegExp Object Error"
    .split(" ")
    .forEach(type => {
      class2type["[object " + type + "]"] = type.toLowerCase();
    });
  if (obj == null) {
    return obj + "";
  }
  return typeof obj === "object" || typeof obj === "function"
    ? class2type[toString.call(obj)] || "object"
    : typeof obj;
}

/**
   * strip quotes
   */
function stripEndQuotes(s) {
  let t = s.length;
  const regex = /^["']|["']$/g;
  if (regex.test(s)) {
    if (s.charAt(0) == "'") s = s.substring(1, t--);
    if (s.charAt(--t) == "'") s = s.substring(0, t);
  }
  return s;
}

/**
   * jsxNode => props
   */
function generateJSXProps(jsxProps = {}, text, record, index) {
  const props = {};
  Object.keys(jsxProps).forEach(key => {
    const keyValue = jsxProps[key];
    if (keyValue && isJSXType(keyValue.type)) {
      const { nodeValue } = keyValue;
      // deserialize must have record in scope
      props[key] = deserialize(stripEndQuotes(nodeValue), text, record, index);
    }
  });
  return props;
}
/**
   * whether is jsx Node
   */
function isJSXType(type) {
  return type == "#jsx";
}

/**
   * Transform jsxObject => jsx
   */
function flatternChildren(jsxObject, text, record, index, jsxcode) {
  try {
    if (jsxcode && jsxcode.trim()) {
      globalEval(jsxcode);
    }
    let { type: Type, props, children, nodeValue } = jsxObject;
    let ComponentType,
      htmlType,
      isJSX = false;
    if (!htmlComponents[Type]) {
      if (isJSXType(Type)) {
        // 如果类型为#jsx类型
        isJSX = true;
      } else {
        // 此时要找到具体的参数类型
        Type = require("../../index")[Type];
        if (Type) {
          Type = eval(Type);
        }
      }
    } else {
      Type = htmlComponents[Type].name;
    }

    return isJSX ? (
      <span>{nodeValue ? eval(nodeValue) : null}</span>
    ) : (
      <Type
        {...generateJSXProps(props, text, record, index)}
        key={generateRandomKey()}
      >
        {children ? (
          children.map(el => {
            return flatternChildren(el, text, record, index);
          })
        ) : (
          <Type {...generateJSXProps(props, text, record, index)}>
            {nodeValue}
          </Type>
        )}
      </Type>
    );
  } catch (e) {
    console.log("报错了", e);
    // message.error(`${e.message}`);
  }
}
