
#### 前言
该部分主要讲述了React16.x的部分功能，以后如果用到会及时补充。欢迎star,issue。


#### 1.Context.Consumer和Context.必须是同一个文件
首先将Context抽取到一个单独文件context.js中:
```js
import React from "react";
const ThemeContext = React.createContext('mode');
export default ThemeContext;
```
下面是Context.Consumer的使用:

```js
import React from "react";
import ThemeContext from "../context";
class Search extends React.Component {
  render() {
    return (
      <ThemeContext.Consumer>
        {context => {
          return (
            <a
            >
              {this.props.children ? this.props.children : "搜索"}
            </a>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
export default Search;
```
下面是Theme.Provider的使用:
```js
import React from "react";
import ThemeContext from "../context";
<ThemeContext.Provider
value={{ mode: this.state.mode }}
>
<div
    style={{
    display: "inline-block",
    border: "2px solid #ddd",
    width: "100%"
    }}
    key={"wrapper__" + index}
    onClick={() => {
    this.setCurrentElment(component);
    }}
>
    {this.getRealComponent(component, index)}
    </div>
</ThemeContext.Provider>
```



参考资料:

[React 16.3新的Context API真的那么好吗？](https://blog.csdn.net/qq_33150267/article/details/79823993)