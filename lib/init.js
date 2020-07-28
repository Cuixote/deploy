import fse from 'fs-extra'
import Table from 'cli-table3'
import dateFormat from 'date-format'
import shell from 'shelljs'
import { getShellString, recordTime } from '../utils/common.js'
import { CURRENT_PROJECT, ENV_MAP } from '../utils/constants.js'

/**
 * 获取当前环境信息
 * @return {string}
 */
export function init () {
  recordTime('initStart')
  // 命令参数校验
  const argv = process.argv
  if (argv.length < 3) {
    throw new Error('请设置要发布的环境')
  }

  // 环境校验
  const env = argv[2]
  if (!ENV_MAP.get(env)) {
    throw new Error('请设置正确的环境名称, 如' + Array.from(ENV_MAP.keys()).join(','))
  }

  CURRENT_PROJECT.env = env

  // git分支校验
  // 获取当前git branch name，参考
  // https://stackoverflow.com/questions/18659425/get-git-current-branch-tag-name
  const gitBranchName = getShellString(shell.exec('git symbolic-ref -q --short HEAD'))
  CURRENT_PROJECT.gitBranchName = gitBranchName
  const branch = ENV_MAP.get(env).branch
  if (branch !== gitBranchName) {
    throw new Error(`当前分支 ${gitBranchName} 与 环境 ${env} 不对应，请检查你的配置！`)
  }

  // 当前目录
  const currentDir = getShellString(shell.pwd())
  // 从package.json中获取当前项目的项目名
  const packageJSON = fse.readJsonSync('./package.json')
  CURRENT_PROJECT.packageJson = packageJSON

  // 获取node版本号
  const nodeVersion = getShellString(shell.exec('node -v'))
  // 获取npm版本号
  const npmVersion = getShellString(shell.exec('npm -v'))
  // 设置npm源
  shell.exec('npm config set registry https://registry.npm.taobao.org')
  // 获取当前npm源
  const npmRegistry = getShellString(shell.exec('npm config get registry'))

  // 设置表格样式
  // https://github.com/cli-table/cli-table3/blob/master/basic-usage.md
  // https://github.com/cli-table/cli-table3/blob/master/advanced-usage.md
  const table = new Table({
    colWidths: [18, 40]
  })
  table.push(
    [{ colSpan: 2, content: '当前构建环境' }],
    { 项目名称: packageJSON.name },
    { 当前分支: gitBranchName },
    { 当前目录: currentDir },
    { 当前时间: dateFormat('yyyy年MM月dd日 hh:mm:ss.SSS', new Date()) },
    { nodejs版本: nodeVersion },
    { npm版本: npmVersion },
    { npm源地址: npmRegistry }
  )
  recordTime('initEnd')
  return table.toString()
}
