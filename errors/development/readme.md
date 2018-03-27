#### 前言
开发中遇到的那些其实不应该耗时但是却很耗时的问题，记录下来，下次能够快速解决。

#### 删除本地的node.js
```shell
sudo rm -rf /usr/local/{bin/{node,npm},lib/node_modules/npm,lib/node,share/man/*/node.*}
```

#### 自己创建的git仓库说access denied
解决方法:删除本地的.git目录(有可能是package.json里面的repository不正确)。如果看不到这个目录可以使用:
```shell
defaults write com.apple.finder AppleShowAllFiles -bool true;
KillAll Finder
```

#### 无法推送信息到远程（前提是添加了ssh key）
修改当前目录下的**隐藏目录下的config文件**，内容如下：
```shell
url = https://liangklfangl@github.com/liangklfangl/webpack-compiler-and-compilation.git
```

#### email在公司里面验证不通过
直接运行：
```shell
git config --global user.name "你的花名"
git config --global user.email "你的公司邮箱"
git commit --amend --reset-author
```
