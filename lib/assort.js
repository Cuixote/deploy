// https://github.com/jprichardson/node-fs-extra
import fse from 'fs-extra'
// https://github.com/shelljs/shelljs
import shell from 'shelljs'
import { recordTime } from '../utils/common.js'

/**
 * 将map文件归类到不同目录
 */
export function assort () {
  recordTime('assortStart')
  // 创建map目录
  const dest = fse.ensureDirSync('dist/static/map')
  // 移动.map文件到map目录
  shell.exec('mv dist/static/js/*.map ' + dest)

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
