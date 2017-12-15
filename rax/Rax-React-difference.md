#### 1.Rax不要求React规定的返回单个元素
Rax编写的组件中，render方法没有React中return a single React element的限制，这个特性在某些特定容器下非常有用，比如Weex，由于Native开发和Web开发的差异，导致很多Web的开发思维如果"沿用到"Native上就会有问题，拿组件层级嵌套和滚动容器来说，想象一个`上层页面`搭建平台，需要搭建出这样一个合理的Weex结构:
```text
<RecyclerView>
  <RecyclerView.Cell></RecyclerView.Cell>
  <RecyclerView.Cell></RecyclerView.Cell>
  <RecyclerView.Cell></RecyclerView.Cell>
</RecyclerView>
```
页面本身是由上层平台(比如rax)搭建而成，意味着`本地组件开发`的时候，很自然地将某个组件写成
```text
<View>
  <A />
  <B />
  <C />
</View>
```
那么到上层平台生成页面，进行wrap的时候，层级就会加深。实际上，我们这里更期望直接返回一个Array。因此，Rax在既需要React DSL，又有跨容器渲染需求的场景中是一个较为不错的技术选型



[Rax与React区别](https://github.com/qddegtya/a-docs/issues/12)

[知乎Rax问答](https://www.zhihu.com/question/54710513)
