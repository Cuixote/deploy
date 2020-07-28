## @mark42/deploy

[前端部署系统](https://www.npmjs.com/package/@mark42/deploy)

### 介绍

包含5个流程：
- 初始化。包含参数校验，本次程序运行参数，全局变量初始化等到。
- 打包。包含依赖安装，文件打包，打包结果分析等。
- 分拣。包含将`.map` 文件移到到指定目录，移除js文件中对`map`文件的引用。
- 上传。将打包好的静态资源文件及`map`文件上传到七牛CDN。
- 预热。对CDN上的静态资源进行请求。

### 使用

#### 安装

```shell script
npm i -D @mark42/deploy@latest
```

#### 使用

在项目命令行：

````shell script
npx deploy [env]
````

在`package.json`中的`scripts`中配置：

```json
{
  "scripts": {
    "deploy:dev": "deploy [env]"
  }
}
```

- `deploy`是命令。指向`@mark42/deploy/bin/deploy.js`。
- `env <string>` 是环境值。可以是`env`、`test`、`stable`、`production`。
对应关系见下表。

环境 | 环境名称 | 分支名称
--- | --- | ---
开发环境 | dev | dev
测试环境 | test | test
预发环境 | stable | stable
正式环境 | production | master


### 推荐配置

```json
{
  "scripts": {
    "deploy:dev": "deploy dev",
    "deploy:test": "deploy test",
    "deploy:stable": "deploy stable",
    "deploy:production": "deploy production"
  }
}
```


### 配置文件

在项目根目录配置`.deploy.json`。如下：

```json
{
  "name": "项目名",
  "uploadDomain": "",
  "uploadBucket": "",
  "buildFileSizeLimit": 100,
  "slice": true,
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
server | 是 | 服务器配置，存放`index.html`文件
buildFileSizeLimit | 否 | 打包后，超过多大体积（KB）的文件进行警告，默认100KB，值类型为number
silent | 否 | 是否展示流程细节，默认为true，不展示。
