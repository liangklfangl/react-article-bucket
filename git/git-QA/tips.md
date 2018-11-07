### 1.删除git仓库以前的提交
```bash
git filter-branch --force --index-filter \ 'git rm --cached --ignore-unmatch others/nodejs-QA/egg-QA.md'\   -- --all
git push origin --force --all
```
在运行命令的时候会不断的输出:
<pre>
Rewrite 7ce29ea30156b6a7a5cac594cd30aa8aa60b9987 (274/280) (679 seconds passed, remaining 14 predicted)    rm 'others/nodejs-QA/egg-QA.md'
Rewrite 2f2c56641d042064a1ae1c60a4ef6a84a245ef21 (275/280) (682 seconds passed, remaining 12 predicted)    rm 'others/nodejs-QA/egg-QA.md'
Rewrite fd72dbe8004ff0b706240d5adbd24fad01342a34 (277/280) (688 seconds passed, remaining 7 predicted)    rm 'others/nodejs-QA/egg-QA.md'
Rewrite f7837a5ff98b449f4d37df07f0bff452e8503fb1 (278/280) (692 seconds passed, remaining 4 predicted)    rm 'others/nodejs-QA/egg-QA.md'
</pre>

### 2.github仓库命名
github仓库命名后，通过老的地址访问会被**重定向**到新的地址。


### 参考资料

[Removing data from a repository](https://help.github.com/articles/removing-sensitive-data-from-a-repository/)
