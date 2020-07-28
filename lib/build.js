const fse = require('fs-extra')
const Table = require('cli-table3')
const shell = require('shelljs')
const { findAllFiles, recordTime } = require('../utils/common')
const { CURRENT_PROJECT } = require('../utils/constants')

const { log } = console

/**
 * 执行依赖安装和打包代码
 */
module.exports = function build () {
  // 移除打包文件夹dist
  fse.removeSync('dist')
  recordTime('installStart')
  // 安装依赖
  shell.exec('npm install')
  recordTime('installEnd')
  log('依赖安装完毕！')
  log('打包中...')
  recordTime('buildStart')
  // 打包
  shell.exec('npm run build:' + CURRENT_PROJECT.env)
  recordTime('buildEnd')

  // 打包文件分析
  const staticDirName = 'dist/static/'
  const files = []
  findAllFiles(staticDirName, files)
  const warnList = []
  const MAX = CURRENT_PROJECT.config.buildFileSizeLimit || 100

  if (files.length) {
    files.forEach(file => {
      // 忽略map文件
      if (/\.map$/.test(file)) return
      // B
      const size = fse.statSync(file).size
      // 大于100k
      if (size > MAX * 1024) {
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
    table.push([{ colSpan: 2, content: `大于${MAX}K的文件` }])
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
