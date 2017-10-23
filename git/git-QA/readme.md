#### 1.远程发布tag以后会存在master分支更新
报错信息为:"检查失败,master上有新的commit提交,请在本地合并master分支后再提交"

解决方法:
```bash
git checkout master
git pull origin master
git checkout daily/0.0.1
git merge master
```
然后正常git add就可以了，主要原因在于:"打了tag相当于远程的master有了更新"。注意这个问题就可以了。
