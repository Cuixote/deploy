const dateFormat = require('date-format')
const { recordTime, strExecCommand, execCommand } = require('../utils/common')
const { CURRENT_PROJECT } = require('../utils/constants')

/**
 * 获取当前环境信息
 * @return {string}
 */
module.exports = function init () {
  recordTime('headStart')

  // 当前目录
  const currentDir = strExecCommand('pwd', true)
  // 获取当前配置
  const config = CURRENT_PROJECT.config

  // 获取node版本号
  const nodeVersion = strExecCommand('node -v', true)
  // 获取npm版本号
  const npmVersion = strExecCommand('npm -v', true)
  // 设置npm源
  execCommand('npm config set registry https://registry.npm.taobao.org')
  // 获取当前npm源
  const npmRegistry = strExecCommand('npm config get registry', true)

  recordTime('headEnd')

  console.log(`
|  当前构建环境信息:
|  项目名称:     ${config.name}
|  业务环境:     ${config.env}
|  上传域名:     ${config.uploadDomain}
|  上传Bucket:   ${config.uploadBucket}
|  当前目录:     ${currentDir}
|  当前时间:     ${dateFormat('yyyy年MM月dd日 hh:mm:ss.SSS', new Date())}
|  nodejs版本:   ${nodeVersion}
|  npm版本:      ${npmVersion}
|  npm源地址:    ${npmRegistry}
  `)
}
