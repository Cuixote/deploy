import { execOut } from '../utils/common.js'
import fse from 'fs-extra'

const { log } = console

/**
 * 执行依赖安装和打包代码
 * @return {Promise<void>}
 */
export async function build () {
  // 移除打包文件夹dist
  await fse.remove('dist')
  // 安装依赖
  await execOut('npm', ['install'])
  log('依赖安装完毕！')
  log('打包中...')
  // 打包
  await execOut('npm', ['run', 'build'])
}
