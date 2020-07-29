const shell = require('shelljs')
const fse = require('fs-extra')

const { CURRENT_PROJECT, ENV_LIST } = require('../utils/constants')

console.log(process.argv.slice(2))

// 所有命令不输出
shell.config.silent = CURRENT_PROJECT.config.silent
// 抛出js error
shell.config.fatal = true

// 命令参数校验
const argv = process.argv
if (argv.length < 3) {
  throw new Error('请设置要发布的环境')
}

// 环境校验
const env = argv[2]
if (!ENV_LIST.includes(env)) {
  throw new Error('请设置正确的环境名称, 如' + ENV_LIST.join(','))
}

CURRENT_PROJECT.env = env

/**
 * 初始化默认配置
 */
function initConfig () {
  const config = fse.readJsonSync('.deploy.json') || {}
  const { name, uploadDomain, uploadBucket } = config
  if (!(name && uploadDomain && uploadBucket)) {
    throw new Error('项目名称，上传域名，上传Bucket在配置文件中必填')
  }
  CURRENT_PROJECT.config = Object.assign({}, CURRENT_PROJECT.config, config)
}

module.exports = initConfig
