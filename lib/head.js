const dateFormat = require('date-format')
const { recordTime, strExecCommand } = require('../utils/common')
const { CURRENT_PROJECT } = require('../utils/constants')

/**
 * 获取当前环境信息
 * @return {string}
 */
module.exports = function init () {
  recordTime('headStart')

  // 当前目录
  const currentDir = process.cwd()
  // 获取当前配置
  const config = CURRENT_PROJECT.config

  // 获取node版本号
  const nodeVersion = strExecCommand('node -v', true)
  // 获取npm版本号
  const npmVersion = strExecCommand('npm -v', true)

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
|  npm源地址:    ${config.registry}
  `)
}
