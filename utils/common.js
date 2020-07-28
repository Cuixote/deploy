const fse = require('fs-extra')
const { CURRENT_PROJECT } = require('./constants')

/**
 * 递归遍历目录下所有文件
 * @param dirPath 目录名
 * @param result
 */
function findAllFiles (dirPath, result = []) {
  dirPath = dirPath[dirPath.length - 1] === '/' ? dirPath : (dirPath + '/')
  const fileList = fse.readdirSync(dirPath)
  fileList.filter(i => !/^\./.test(i)).forEach(i => {
    const p = dirPath + i
    const stat = fse.statSync(p)
    if (stat.isFile()) {
      result.push(p)
    } else if (stat.isDirectory()) {
      findAllFiles(p, result)
    }
  })
}

exports.findAllFiles = findAllFiles

/**
 * 记录时间
 * @param key
 * @param val
 */
function recordTime (key, val) {
  if (CURRENT_PROJECT.times[key] !== undefined) {
    CURRENT_PROJECT.times[key] = val || Date.now()
  }
}

exports.recordTime = recordTime

/**
 * 格式化shelljs的输出结果
 * @param shellString
 * @return {string}
 */
function getShellString (shellString = '') {
  return shellString.toString().replace(/\n/, '')
}

exports.getShellString = getShellString

/**
 * 静默输出
 * @param arg
 */
function silentLog (...arg) {
  if (!CURRENT_PROJECT.config.silent) {
    console.log(...arg)
  }
}
exports.silentLog = silentLog
