const shell = require('shelljs')
const fse = require('fs-extra')
const mist = require('minimist')
const packageVersion = require('../package.json').version
const { exit } = require('../utils/common')
const { CURRENT_PROJECT, ENV_LIST } = require('../utils/constants')
const defaultConfig = CURRENT_PROJECT.config

const { log } = console

/**
 * 初始化默认配置
 */
function initConfig () {
  const commandLineConfig = parseCommandLineParams()
  const path = commandLineConfig.path || defaultConfig.path
  const pathFileConfig = fse.readJsonSync(path) || {}

  const config = Object.assign({}, defaultConfig, pathFileConfig, commandLineConfig)

  const { name, uploadDomain, uploadBucket, server } = config
  if (!(name && uploadDomain && uploadBucket && server)) {
    exit('项目名称，上传域名，上传Bucket，服务器列表在配置文件中必填')
  }

  CURRENT_PROJECT.config = config

  setShelljs()
}

/**
 * 解析命令行参数
 * @return {{env: *}}
 */
function parseCommandLineParams () {
  const argv = mist(process.argv.slice(2), {
    boolean: ['verbose'],
    string: ['name', 'uploadDomain', 'uploadBucket'],
    alias: {
      h: 'help',
      v: 'version'
    }
  })
  // 如果有command
  if (argv._.length) {
    const command = argv._[0]
    if (command === 'help') {
      exit(helpLog, 0)
    }

    if (command === 'version') {
      exit(packageVersion, 0)
    }

    if (ENV_LIST.includes(command)) {
      const commandLineConfig = {
        env: command
      }
      argv.name && (commandLineConfig.name = argv.name)
      argv.uploadDomain && (commandLineConfig.uploadDomain = argv.uploadDomain)
      argv.uploadBucket && (commandLineConfig.uploadBucket = argv.uploadBucket)
      argv.path && (commandLineConfig.path = argv.path)
      argv.verbose !== undefined && (commandLineConfig.verbose = argv.verbose)
      return commandLineConfig
    }
  } else {
    if (argv.help) {
      exit(helpLog, 0)
    }
    if (argv.version) {
      exit(packageVersion, 0)
    }
  }
  log('  ❌ 输入错误，请查看帮助。')
  exit(helpLog)
}

const helpLog = `  (～￣▽￣)～
  deploy help / deploy -h : 帮助
  deploy version / deploy -v : 版本号
  deploy [env]: 发布对应版本。env可取值为 dev/test/stable/production
  deploy [env] --name [string] : 设置项目名
  deploy [env] --uploadDomain [string] : 设置上传域名
  deploy [env] --uploadBucket [string] : 设置上传Bucket
  deploy [env] --buildFileSizeLimit [number] : 设置打包后，单个文件超过多大体积（KB）的文件进行警告，默认100
  deploy [env] --verbose [boolean] : 设置是否在控制台输出更多流程日志，默认为false，不输出。
  deploy [env] --path [string] : 设置配置文件路径。默认值为'.deploy.json'。
      `

/**
 * 配置shelljs
 */
function setShelljs () {
  // 所有命令不输出
  shell.config.silent = !CURRENT_PROJECT.config.verbose
  // 抛出js error
  shell.config.fatal = true
}

module.exports = initConfig
