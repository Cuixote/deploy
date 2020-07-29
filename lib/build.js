const fse = require('fs-extra')
const { findAllFiles, recordTime, execCommand } = require('../utils/common')
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
  execCommand('npm install')
  recordTime('installEnd')
  log('依赖安装完毕！')
  log('')
  log('打包中...')
  recordTime('buildStart')
  // 打包
  const config = CURRENT_PROJECT.config
  execCommand('npm run build:' + config.env)
  recordTime('buildEnd')

  // 打包文件分析
  const staticDirName = 'dist/static/'
  const files = []
  findAllFiles(staticDirName, files)
  const warnList = []
  const MAX = config.buildFileSizeLimit || 100

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
    log('')
    log(`|  大于${MAX}K的文件`)
    // 先排序
    warnList.sort((a, b) => b.size - a.size).forEach(({ file, size }) => {
      file = file.replace(staticDirName, '')
      log(`|  ${file}: ${(size / 1024).toFixed(2)}KB`)
    })
    log('')
  }
}
