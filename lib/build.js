import fse from 'fs-extra'
import Table from 'cli-table3'
import { execOut, findAllFiles } from '../utils/common.js'

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

  // 打包文件分析
  const staticDirName = 'dist/static/'
  const files = []
  findAllFiles(staticDirName, files)
  const warnList = []

  if (files.length) {
    files.forEach(file => {
      // 忽略map文件
      if (/\.map$/.test(file)) return
      // B
      const size = fse.statSync(file).size
      // 大于100k
      if (size > 100 * 1024) {
        warnList.push({
          file,
          size
        })
      }
    })
  }

  if (warnList.length) {
    const table = new Table({
      colWidths: [40, 10]
    })
    table.push([{ colSpan: 2, content: '大于100K的文件' }])
    // 先排序
    warnList.sort((a, b) => b.size - a.size).forEach(({ file, size }) => {
      file = file.replace(staticDirName, '')
      table.push({
        [file]: (size / 1024).toFixed(2) + 'KB'
      })
    })

    log(table.toString())
  }
}
