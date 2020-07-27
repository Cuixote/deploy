import execa from 'execa'
import fse from 'fs-extra'
import path from 'path'

export async function execOut (...args) {
  const { stdout, stderr, failed } = await execa(...args)
  if (failed) {
    throw new Error(stderr)
  }
  return stdout
}

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
