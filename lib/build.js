import { execOut } from '../utils/common.js'
import fs from 'fs'

export async function build (handleDone = () => {}) {
  // 移除打包文件夹dist
  if (fs.existsSync('dist')) {
    await execOut('rm', ['-rf', 'dist'])
  }
  // 安装依赖
  // await execOut('npm', ['install'])
  console.log('依赖安装完毕！')
  console.log('打包中...')
  // 打包
  // await execOut('npm', ['run', 'build'])
  handleDone()
}
