const fse = require('fs-extra')
const { recordTime, execCommand } = require('../utils/common')

/**
 * 将map文件归类到不同目录
 */
module.exports = function assort () {
  const mapDirPath = 'dist/static/map'
  const jsDirPath = 'dist/static/js'
  // 如果没在js文件夹中找到.map文件，跳过分拣流程
  if (!fse.readdirSync(jsDirPath).filter(f => f.match(/\.map$/)).length) {
    return
  }
  recordTime('assortStart')
  // 创建map目录
  fse.ensureDirSync(mapDirPath)
  // 移动.map文件到map目录
  execCommand(`mv ${jsDirPath}/*.map ${mapDirPath}`)

  // 移除js文件中对于map文件的引用
  const jsDirName = 'dist/static/js/'
  const jsFiles = fse.readdirSync(jsDirName) || []
  if (jsFiles.length) {
    jsFiles.forEach(file => {
      file = jsDirName + file
      const str = fse.readFileSync(file).toString()
      const index = str.indexOf('//# sourceMappingURL=')
      if (index > -1) {
        // -1是移除换行
        fse.writeFileSync(file, str.slice(0, index - 1))
      }
    })
  }
  recordTime('assortEnd')
}
