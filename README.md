## @lonely9/deploy

[前端部署系统](https://www.npmjs.com/package/@lonely9/deploy)       [知识点小记](https://www.yuque.com/jiahesheng/blog/pv3bwt)

### 介绍

包含6个流程：
- 初始化。包含参数校验，本次程序运行参数，全局变量初始化等
- 环境信息。展示当前环境信息。
- 打包。包含依赖安装，文件打包，打包结果分析等。
- 分拣。包含将`.map` 文件移到到指定目录，移除js文件中对`map`文件的引用。
- 上传。将打包好的静态资源文件及`map`文件上传到七牛CDN。将index.html发送到指定服务器。
- 预热。对CDN上的静态资源进行请求。

### 使用

#### 安装

```shell script
npm i @lonely9/deploy@latest -g --registry https://registry.npmjs.org
```

全局安装deploy，使用npm官方源地址。其他镜像地址可能更新不及时。

#### 使用

进入项目根目录，在命令行执行：

````shell script
deploy [env]
````

- `deploy`是命令。指向`@lonely9/deploy/bin/deploy.js`。
- `env <string>` 是环境值。可以是`env`、`test`、`stable`、`production`。
对应关系见下表。

环境 | 环境名称
--- | ---
开发环境 | dev
测试环境 | test
预发环境 | stable
正式环境 | production

#### 打包

打包其实是执行了`npm scripts` 里对应的四个命令，这四个命令对应四个环境，所以这四个命令一定得先在`npm scripts` 里面配置好。

```json
{
  "scripts": {
    "build:dev": "",
    "build:test": "",
    "build:stable": "",
    "build:production": ""
  }
}
```

更多信息，可在命令行执行：

```shell script
deploy help
```

### 配置文件

> 优先级。命令行参数 > 配置文件 > 默认值

在项目根目录配置`.deploy.json`。如下：

```json
{
  "name": "项目名",
  "uploadDomain": "",
  "uploadBucket": "",
  "buildFileSizeLimit": 100,
  "verbose": false,
  "server": {
    "dev": [{
      "account": "admin",
      "domain": "192.168.1.2",
      "path": "/data/www/index/",
      "port": "8080"
    }]
  }
}
```

### 参数

参数名 | 必填 |说明
--- | --- |---
name | 是 | 项目名称
uploadDomain | 是 | 上传七牛时对应的域名
uploadBucket | 是 | 上传七牛时对应的bucket
server | 是 | 服务器配置，格式见示例。
buildFileSizeLimit | 否 | 打包后，超过多大体积（KB）的文件进行警告，默认100KB，值类型为number
verbose | 否 | 是否展示流程细节，默认为false，不展示。
path | 否 | 设置配置文件路径。默认值为'.deploy.json'。
registry | 否 | 设置npm包安装源地址。默认值为'https://registry.npm.taobao.org'
skipWarmUp | 否 | 设置是否跳过预热流程，默认为false，不跳过。

也可以在命令行中执行：

```shell
deploy help
```

获取这些参数信息

### 特殊说明

- 默认只有test/production环境会生成sourcemap。可以在业务项目中的`vue.config.js`配置。
本项目只有检测到`dist/static/js`文件夹中有`.map`文件才会进行相应操作。
