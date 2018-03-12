##### 写在前面的话
最近开始接收vue的项目，所以尝试着写vue代码，把遇到的那些问题记录下来。

##### 1.:value和v-model不能共存
```js
 <input :value="form_msg.androidTitle" id="android_title" width="80%" :maxlength="30"    v-model="form_msg.androidTitle" placeholder="用户在手机桌面/通知栏看到的标题文字，30字以内" data-emojiable="true">
```
报错信息如下:
<pre>
 - :value="form_msg.androidTitle" conflicts with v-model on the same element because the latter already expands to a value binding internally


 @ ./src/components/page/PushCreate.vue 9:2-227
 @ ./src/router/index.js
 @ ./src/main.js
 @ multi ./build/dev-client babel-polyfill ./src/main.js
</pre>

在input中，**不能同时指定:value和v-model**字段,详见[这里](https://github.com/vuejs/vue/issues/7084)。
