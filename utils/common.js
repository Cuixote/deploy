import fse from 'fs-extra'
import { CURRENT_PROJECT } from './constants.js'

/**
 * 递归遍历目录下所有文件
 * @param dirPath 目录名
 * @param result
 */
export function findAllFiles (dirPath, result = []) {
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

/**
 * 记录时间
 * @param key
 * @param val
 */
export function recordTime (key, val) {
  if (CURRENT_PROJECT.times[key] !== undefined) {
    CURRENT_PROJECT.times[key] = val || Date.now()
  }
}

/**
 * 格式化shelljs的输出结果
 * @param shellString
 * @return {string}
 */
export function getShellString (shellString = '') {
  return shellString.toString().replace(/\n/, '')
}
