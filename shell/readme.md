#### 前言
这部分主要讲述了在开发类似于CLI命令中遇到的问题，是一些很值得关注的问题。如果喜欢记得star，如果有任意问题也欢迎issue。

#### 1.开发自己的cli命令报错
bin目录下的文件名称和package.json中的bin配置的文件**名称是配套**的，如果bin下的文件有后缀那么package.json中也必须有后缀:
```js
   "bin": {
        "extract": "./bin/extract.js"
    }
```

#### 2.glob抓取文件忽略某一个具体的文件夹
```js
const glob = require("glob");
const files = glob
  .sync("**", { dot: false,cwd, ignore: "node_modules/**" })
  .filter(file => {
    return path.extname(file) === ".js" || path.extname(file) === ".jsx";
  })
  .reduce((prev, cur) => {
    return prev.concat(path.join(cwd, cur));
  }, []);
```
比如上面的例子就是抓取所有的js和jsx后缀文件，但是忽略node_modules下的额外文件。需要注意的是ignore的配置。

#### 3.监听某一个目录下动态生成的文件夹
```js
const chokidar = require("chokidar");
const watchDir = 'xxxx';
// 需要监听的目录
let watcher = chokidar
  .watch(watchDir, {
    persistent: true,
    disableGlobbing: true,
    ignoreInitial: true,
    // 1.忽略一开始就有的某一个目录下的文件夹
    depth: 0
  })
  .on("addDir", genPath => {
    // 2.监听到文件被生成，即hub生成的文件
    const relativePath = path.relative(genPath, watchDir);
    const index = genPath.indexOf(watchDir);
    let genHubPath = genPath.substring(index + watchDir.length + 1);
    // 3.获取产生的目录名称
    if (relativePath == "..") {
        // 4.表示是动态产生的目录,此时获取到产生的目录可以操作了
    }
  });
```

#### 4.动态产生React组件的props构建jsx的template
```js
const path2Cnpt = '';
// 需要解析的某一个组件的地址
const fakeProps = require("react-fake-props");
const props = fakeProps(path2Cnpt, { optional: true });
// optional: true表示非required的属性也要动态产生
// 产生了props就可以动态构建jsx的template了
```
下面通过动态产生的props构建jsx的template:
```js
//cntName:组件名称
//props:动态产生的组件props
function generateTestTemplate(cntName, props) {
  const template = `
    import React from 'react';
    import ReactDOM from 'react-dom';
    import ${cntName} from './index';
    const props = ${JSON.stringify(props)};
    class Test extends React.Component {
      render() {
        return <${cntName} {...props}\/>;
      }
    }
    ReactDOM.render(<Test />, document.getElementById('app'));
    `;
  return template;
}
```
有一点需要注意:那就是react-fake-props产生的props是对象，即object，所以动态产生template的时候需要stringify一下:
```js
const props = ${JSON.stringify(props)};
```

#### 5.获取某一个文件的绝对路径使用require.resolve(node v8+支持)
```js
  const path = require('path');
  const sourcePath = require.resolve(
    path.resolve(`${cwd}`, relative[r])
  );
  let fileName = path.basename(sourcePath);
  //通过文件名称引入的，比如require('./util/test')表示util下的test.js
  if (fileName != "index.js") {
    const arr = destPath.split(path.sep);
    arr.pop();
    destPath = arr.join(path.sep);
    // 去掉文件名就是它的目录
  }
```
如果要兼容低版本可以使用npm上的resolve模块来完成。
##### 6.执行cli命令并支持输入
很多情况下需要在自己的cli命令中包装别人的cli命令，而别人的cli命令是yoeman开发的，需要支持用户的输入，此时你可能想到的是使用shelljs，但实际上[官方明确说了](https://github.com/shelljs/shelljs/wiki/FAQ#running-interactive-programs-with-exec)不支持此类用法，可以采用如下的方式来完成。
```js
const child_process = require("child_process");
// 假如原有的cli命令，即包装命令是:et init liangklfangl
child_process.execFileSync("et", ["init", "liangklfangl"], {
    stdio: "inherit"
  });
```

##### 7.正则表达式在node中判断是否是相对路径
```js
const pathRegex = /^\./g;
const isRelative = pathRegex.test(importSource);
// 第一种方法判断是否是相对路径，但是有时候会出现很奇怪的结果，所以我都使用如下的方式
const isRelative = path2Detect.indexOf(".") == 0;
```

##### 8.通过shell安装某些npm包
```js
const child_process = require("child_process");
const exec = child_process.exec;
/**
 * 执行shell脚本
 */
function execute(cmd, workingDirPath) {
  return new Promise((resolve, reject) => {
    try {
      let child = exec(
        cmd,
        { cwd: workingDirPath },
        (error, stdout, stderr) => {
          if (error) {
            reject(error);
          } else {
            resolve(stdout);
          }
        }
      );
    } catch (e) {
      reject(e);
    }
  });
}
/**
 * npm配置
 */
function getNpmConfigVariable(varName, workingDirPath) {
  return execute(`tnpm get ${varName}`, workingDirPath).catch(err => {
    console.error(err);
    return undefined;
  });
}
/**
 * 设置npm配置
 */
function setNpmConfigVariable(varName, varValue, workingDirPath) {
  return execute(
    `tnpm set ${varName}=${varValue}`,
    workingDirPath
  ).catch(err => {
    console.error(err);
    return undefined;
  });
}
/**
 * 安装特定模块
 */
const installPackages = function(pkgNames, workingDirPath) {
  let oldProgress;
  return getNpmConfigVariable("progress", workingDirPath)
    .then(result => {
      oldProgress = result;
      return setNpmConfigVariable("progress", "false", workingDirPath);
    })
    .then(() => {
      log(chalk.green(`准备开始安装${pkgNames}依赖`));
      return execute(`tnpm install ${pkgNames} -S -E`, workingDirPath);
    })
    .then(() => {
      log(chalk.green(`依赖的${pkgNames}模块安装完成!`));
      return setNpmConfigVariable("progress", oldProgress, workingDirPath);
    });
};
```
以上方法来自于[structor-commons](https://github.com/ipselon/structor-commons) 。
