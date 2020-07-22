import fs from 'fs'
import Table from 'cli-table3'
import { execOut } from '../utils/common.js'
import { CURRENT_PROJECT } from '../utils/constants'

/**
 * 获取当前环境信息
 * @param handleDone
 * @return {Promise<void>}
 */
export async function init (handleDone = () => {}) {
  const nodeVersion = await execOut('node', ['-v'])
  const npmVersion = await execOut('npm', ['-v'])
  // 设置npm源
  await execOut('npm', ['config', 'set', 'registry', 'https://registry.npm.taobao.org'])
  // 获取当前npm源
  const npmRegistry = await execOut('npm', ['config', 'get', 'registry'])
  // 从package.json中获取当前项目的项目名
  const packageJSON = JSON.parse(fs.readFileSync('./package.json'))
  CURRENT_PROJECT.packageJson = packageJSON
  // 获取当前git branch name，参考
  // https://stackoverflow.com/questions/18659425/get-git-current-branch-tag-name
  const gitBranchName = await execOut('git', ['symbolic-ref', '-q', '--short', 'HEAD'])
  CURRENT_PROJECT.gitBranchName = gitBranchName
  // 当前目录
  const currentDir = await execOut('pwd')
  // 设置表格样式
  // https://github.com/cli-table/cli-table3/blob/master/basic-usage.md
  // https://github.com/cli-table/cli-table3/blob/master/advanced-usage.md
  const table = new Table({
    colWidths: [18, 40]
  })
  table.push(
    [{ colSpan: 2, content: '当前构建环境' }],
    { nodejs版本: nodeVersion },
    { npm版本: npmVersion },
    { npm源地址: npmRegistry },
    { 当前分支: gitBranchName },
    { 项目名称: packageJSON.name },
    { 当前目录: currentDir }
  )
  handleDone()
  console.log(table.toString())
}
