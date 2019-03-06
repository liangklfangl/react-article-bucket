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

##### 9.如何在nodejs中因为权限问题提升为sudo模式
```js
var os;
os = require('os');
exports.execute = function(command, callback) {
  var commander;
  if (os.platform() === 'win32') {
    commander = require('./windows');
  } else {
    commander = require('./unix');
  }
  return commander.executeWithPrivileges(command, callback);
};
```
具体你可以[点击这里](./president/president.js)。

##### 10.nodejs中关于npm常见nodejs方法使用
以下所有内容来自于[selfupdate](https://www.npmjs.com/package/selfupdate)模块。
```js
var async, npm, utils, _;
npm = require('npm');
async = require('async');
_ = require('lodash-contrib');
utils = require('./utils');
/**
 * 得到一个npm包的信息
 */
exports.getInfo = function(name, callback) {
  // https://github.com/liangklfangl/react-article-bucket/tree/master/async-programing/async-js#43-asyncify%E7%94%A8%E4%BA%8Eparallel%E6%96%B9%E6%B3%95
  return async.waterfall([
    function(callback) {
      var options;
      options = {
        loglevel: 'silent',
        global: true
      };
      return npm.load(options, _.unary(callback));
      // unary:Creates a function that accepts up to one argument, ignoring any additional arguments.
    }, function(callback) {
      //npm view命令
      return npm.commands.view([name], true, callback);
    }
  ], callback);
};
/**
 * 得到npm包的最新版本
 */
exports.getLatestVersion = function(name, callback) {
  return exports.getInfo(name, function(error, data) {
    var versions;
    if (error != null) {
      return callback(error);
    }
    versions = _.keys(data);
    return callback(null, _.first(versions));
  });
};
/**
 * 判断某一个包是否在最新的V版本上
 */
exports.isUpdated = function(packageJSON, callback) {
  return exports.getLatestVersion(packageJSON.name, function(error, latestVersion) {
    if (error != null) {
      return callback(error);
    }
    return callback(null, packageJSON.version === latestVersion);
  });
};
/**
 * 更新一个npm包
 */
exports.update = function(packageJSON, callback) {
  return async.waterfall([
    function(callback) {
      var command;
      command = utils.getUpdateCommand(packageJSON.name);
      return utils.runCommand(command, callback);
    }, function(stdout, stderr, callback) {
      if (!_.isEmpty(stderr)) {
        return callback(new Error(stderr));
      }
      return exports.getLatestVersion(packageJSON.name, callback);
    }
  ], callback);
};
```
下面是utils模块提供的方法包括getUpdateCommand/runCommand:
```js
var child_process, president, _;
president = require('president');
_ = require('lodash-contrib');
child_process = require('child_process');
/**
 * 得到更新的命令
 */
exports.getUpdateCommand = function(name) {
  if (name == null) {
    throw new Error('Missing package');
  }
  return "npm install --silent --global " + name;
};
/**
 * 判断一个错误是否是权限相关的
 */
exports.isPermissionError = function(error) {
  if (error == null) {
    return false;
  }
  if (error.message == null) {
    error.message = '';
  }
  return _.any([error.code === 3, error.errno === 3, error.code === 'EPERM', error.code === 'EACCES', error.code === 'ACCES', error.message.indexOf('EACCES') !== -1]);
};
/**
 *  执行某一个cli命令，如果执行失败就提升为sudo权限
 */
exports.runCommand = function(command, callback) {
  return child_process.exec(command, function(error, stdout, stderr) {
    if (_.any([exports.isPermissionError(error), exports.isPermissionError(new Error(stderr))])) {
      return president.execute(command, callback);
    }
    return callback(error, stdout, stderr);
  });
};
```
那么selfupdate模块如何使用呢?下面来自于[zan-proxy](https://github.com/youzan/zan-proxy/blob/master/src/bin/index.ts#L24):
```js
import childProcess from 'child_process';
import { promisify } from 'es6-promisify';
import { prompt } from 'inquirer';
import ora from 'ora';
// https://github.com/sindresorhus/ora
import selfupdate from 'selfupdate';
// 来自于上面分析的selfupdate
const packageInfo = require('../../package');
// 需要检查全局自动更新的package.json
const update = promisify(selfupdate.update);
const isUpdated = promisify(selfupdate.isUpdated);
// update方法和isupdated方
const exec = promisify(childProcess.exec);
// promisify方法
export default async () => {
  const checkSpinner = ora('正在检查更新...').start();
  const isLatest = await isUpdated(packageInfo);
  checkSpinner.stop();
  if (isLatest) {
    console.log('当前已是最新版本');
    return;
  }
  const ans = await prompt([
    {
      message: '检测到新版本，是否更新？',
      name: 'shouldUpdate',
      type: 'confirm',
    },
  ]);
  // 用户输入
  if (!ans.shouldUpdate) {
    return;
  }
  const updateSpinner = ora('正在更新').start();
  //开始更新
  return update(packageInfo)
    .catch(() => exec(`npm uninstall --global --silent ${packageInfo.name}`))
    // 已经安装了删除掉，重新安装一遍~~
    .then(() => exec(`npm install --global --silent ${packageInfo.name}`))
    .then(() => {
      updateSpinner.stop();
      console.log(
        `更新完成，请重新启动! 如出现命令丢失情况，请手动重新安装：npm install -g ${
          packageInfo.name
        }`,
      );
      process.exit(0);
    })
    .catch(error => {
      console.error('更新失败', error);
      process.exit(1);
    });
};
```

##### 11.nodejs中阻塞当前进程等待用户输入[inquery.js](https://github.com/SBoudrias/Inquirer.js)
```js
 const ans = await prompt([
    {
      message: '检测到新版本，是否更新？',
      name: 'shouldUpdate',
      type: 'confirm',
    },
  ]);
 // shouldUpdate表示用户是否选择了自动更新
  if (!ans.shouldUpdate) {
     return;
  }
```

##### 12.npm模块的常见方法
上面已经简单说了npm的基本使用方法，里面还包括的方法有:
```js
config: { loaded: false, get: [Object], set: [Object] },
commands: {ac,}
// commands里面包含所有的方法
```
建议自己require它并打印出来。

##### 13.babel打包的时候拷贝非js文件
遇到一个常见的问题:在babel打包的时候需要考虑less/scss等文件，此时可以直接使用如下的命令即可:
```js
rimraf lib && babel src --out-dir lib --copy-files
```
