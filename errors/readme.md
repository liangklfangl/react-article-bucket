#### 1.url-loader找不到的问题
在css中通过下面的方式引入字体文件也会使用url-loader加载:
```js
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1479085947184'); /* IE9*/
  src: url('iconfont.eot?t=1479085947184#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('iconfont.woff?t=1479085947184') format('woff'), /* chrome, firefox */
  url('iconfont.ttf?t=1479085947184') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+*/
  url('iconfont.svg?t=1479085947184#iconfont') format('svg'); /* iOS 4.1- */
}
```
所以，请确保你的webapck配置可以处理此种类型的字体文件，即添加特定的loader，如果还是有问题，那么请保证在loader配置中使用require.resolve:
```js
{
    test: /\.xyz$/,
    loader: require.resolve("file-loader")
}
```
详细信息可以[点击这里](https://github.com/webpack/webpack/issues/111)
