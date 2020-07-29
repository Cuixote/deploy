const Table = require('cli-table3')
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
  const currentDir = strExecCommand('pwd')
  // 获取当前配置
  const config = CURRENT_PROJECT.config

  // 获取node版本号
  const nodeVersion = strExecCommand('node -v')
  // 获取npm版本号
  const npmVersion = strExecCommand('npm -v')
  // 设置npm源
  execCommand('npm config set registry https://registry.npm.taobao.org')
  // 获取当前npm源
  const npmRegistry = strExecCommand('npm config get registry')

  // 设置表格样式
  // https://github.com/cli-table/cli-table3/blob/master/basic-usage.md
  // https://github.com/cli-table/cli-table3/blob/master/advanced-usage.md
  const table = new Table({
    colWidths: [18, 40]
  })
  // TODO: 找到适合Jenkins展示的样式
  table.push(
    [{ colSpan: 2, content: '当前构建环境' }],
    { 项目名称: config.name },
    { 上传域名: config.uploadDomain },
    { 上传Bucket: config.uploadBucket },
    { 当前目录: currentDir },
    { 当前时间: dateFormat('yyyy年MM月dd日 hh:mm:ss.SSS', new Date()) },
    { nodejs版本: nodeVersion },
    { npm版本: npmVersion },
    { npm源地址: npmRegistry }
  )
  recordTime('headEnd')
  return table.toString()
}
