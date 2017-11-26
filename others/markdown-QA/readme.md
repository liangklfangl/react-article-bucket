#### 1.html格式的table如何转化为markdown格式
解答:可以采用[to-markdown](https://github.com/domchristie/to-markdown),只需要下面的一句代码就可以了:
```js
//其中tableHtml是我们的html格式的table，而gfm表明符合github标准的markdown
const markdownTable = toMarkdown(tableHtml, { gfm: true });
```
其中gfm(github flavor markdown)表明这是[GitHub 风格的 Markdown 正式规范](https://linux.cn/article-8399-1.html)

#### 2.获取一个markdown文件中所有的代码块
```js
const commonmark = require("commonmark");
const reader = new commonmark.Parser();
const parsed = reader.parse("");
//parse方法传入你需要解析的字符串
const parsedJSON = {}；
const walker = parsed.walker();
   while ((event = walker.next())) {
    node = event.node;
     if (event.entering && node.type === "code_block") {
       //通过node的_info属性
      if (node._info === "css") {
        parsedJSON.css = node.literal;
      } else if (node._info === "html") {
        parsedJSON.html = node.literal;
      } else if (node._info === "javascript" || node._info === "js") {
        parsedJSON.js = node.literal;
      }
    }
  }
```
具体使用你可以参考[commonmark](https://github.com/commonmark/commonmark.js)，commonmark其实让markdown在规范道路上更近了一步，而[`GFM`](https://qkldx.net/topic/576/github-%E9%A3%8E%E6%A0%BC%E7%9A%84-markdown-%E6%AD%A3%E5%BC%8F%E8%A7%84%E8%8C%83-%E5%8F%91%E5%B8%83)又是基于commonmark的，当评估GFM规范 的时候，你可以清楚的知道哪些是GFM特定规范的补充内容，因为它们都高亮显示了。并且你也会看到原有规范的所有部分都保持原样，因此，GFM 规范能够与任何其他的实现`保持兼容`。我们是在现存的CommonMark规范中来完成这一项工作的，同时还特意关注以确保我们的扩展是原有规范的一个严格且可选的超集。如果有疑问自行google。

#### 3.解决cheerio调用load方法中文乱码的问题
解决：只需要在调用load方法时候传入一个参数就可以了。
```js
  const $ = cheerio.load(marked(contentParse), {
    decodeEntities: false
    //参数
  });
```

#### 4.link和script标签在html页面原样展示
很多情况下，我们有一个字符串，但是我们需要将里面的"<script/>"标签内容原样展示，这时候就需要对我们的标签进行转义，此时你可以参考我的[转义字符串中的script标签](https://github.com/liangklfangl/string.protype)。此时我们可以将转义后的字符串转化为markdown格式:
```js
var scriptRegex = /(<script\b[^>]*>)([\s\S]*?)(<\/script>)/gm;
var linkRegex = /(<link\b[^>]*>)([\s\S]*?)(<\/link>)/gm;
/**
 * 转义script标签防止被解
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
function escapeChars(str) {
  str = str.replace(/&/g, '&amp;');
  str = str.replace(/</g, '&lt;');
  str = str.replace(/>/g, '&gt;');
  str = str.replace(/'/g, '&acute;');
  str = str.replace(/"/g, '&quot;');
  str = str.replace(/\|/g, '&brvbar;');
  return str;
}

  var toMarkdown = require("to-markdown");
  var descriptionContent = encodeScript($(whenUse).nextUntil("h2").html());
  //html片段并转义script标签
  var readme = "<p>" + descriptionFirst.html() + "</p><h2>" + whenUse.html() + "</h2>" + descriptionContent;
  toMarkdown(readme, { gfm: true });
  //to-markdown将我们的html转化为markdown，此时我们转义后的script又回到了script标签了
```
此时[react-markdown](https://github.com/rexxars/react-markdown)就可以原样解析出来了。当然，我们的link标签也是需要编码的:
```js
function encodeLink(str){
  return str.replace(linkRegex,function(matched,$1,$2,$3){
   const replacedStr = escapeChars($1)+$2+escapeChars($3)
   return replacedStr;
  });
}
```






参考资料:

[如何看待尝试标准化并取代 Markdown 的 CommonMark ？](https://www.zhihu.com/question/25417178/answer/30765483)

[通用标注(CommonMark)](http://www.commonmark.cn/w/)

[《GitHub 风格的 Markdown 正式规范》发布](https://qkldx.net/topic/576/github-%E9%A3%8E%E6%A0%BC%E7%9A%84-markdown-%E6%AD%A3%E5%BC%8F%E8%A7%84%E8%8C%83-%E5%8F%91%E5%B8%83)
