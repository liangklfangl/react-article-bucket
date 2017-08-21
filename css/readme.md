#### 简要说明
这个文章我主要会写一些CSS开发中的常用技巧，通过这些技巧不仅能够提升代码的优雅度，同时对于CSS本身的学习也是很好的参考资料。

问题1：如何实现两行省略号

```css
 .block-with-text {
    overflow: hidden;
    position: relative;
    line-height: 1.2em;
    /* max-height = line-height (1.2) * (3) 设置三行行高 */
    max-height: 3.6em;
    text-align: justify;
    /*省略号到右边距的位置 */
    margin-right: 15px;
     /*给省略号的宽度留位置,三个点的宽度大概14px, 最好不要小于这个宽度*/
    padding-right: 15px;
}
/*创建省略号*/
.block-with-text:before {
    content: '...';
    position: absolute;
    /* 省略号的显示位置定位在右下方*/
    right: 0;
    bottom: 0;
}
/*遮盖省略号*/
.block-with-text:after {
    content: '';
    position: absolute;
    /*设置遮盖省略号的位置 */
    right: 0;
    /*设置遮盖省的大小 */
    width: 1em;
    height: 1em;
    margin-top: 0.2em;
    /*设置遮盖省略号的背景颜色，这个要和背景颜色一致 */
    background: white;
}
```
其主要是通过max-height和line-height来决定的。



参考资料:

[多行文本溢出显示省略号 #15](https://github.com/ShuyunXIANFESchool/FE-problem-collection/issues/15)
