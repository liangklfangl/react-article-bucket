### 1.验证码使用rax-button老是折行
```js
 <Touchable style={styles.countDownBox}>
    <Button>
      {this.state.isCountingDown &&
        this.state.currentCountingDownNum}秒后重新获取!
    </Button>
</Touchable>
```
此时动态产生的this.state.currentCountingDownNum将会和后面的"秒后重新获取!"文案分布在两行，可以采用rax-text来替换rax-button,同时去掉Touchable。
```js
<Text>
    {this.state.isCountingDown &&
      this.state.currentCountingDownNum}秒后重新获取!
<\/Text>
```

### 2.rax-modal不能指定key
即你指定了key，而且两次的key不一样的情况下，遇到一个问题:上一次visible为false，后一次visible为true,但是弹窗就是没有展示。看到rax-modal的源码:
```js
componentWillReceiveProps(nextProps) {
    if (
      nextProps.visible != this.props.visible &&
      nextProps.visible != this.state.visible
    ) {
      this.toggle(nextProps.visible);
    }
  }
```
应该是后面的判断导致的nextProps.visible != this.state.visible。本次直接不指定key！

### 3.rax-toast不做节流的问题
rax-toast本身不做节流，即节流并不在内部实现，同时也没有开放出API提供Toast的隐藏功能，所以可以采用如下通用的节流方案来完成:
```js
 const HEART_BEAT = 300;
  /**
   * 节流显示toast
   */
  showToast = text => {
    this.timer && clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      Toast.show(text);
    }, HEART_BEAT);
  };
```
