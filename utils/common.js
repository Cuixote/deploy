const fse = require('fs-extra')
const shell = require('shelljs')
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
 * 静默输出
 * @param arg
 */
function silentLog (...arg) {
  if (CURRENT_PROJECT.config.verbose) {
    console.log(...arg)
  }
}
exports.silentLog = silentLog

/**
 * 静默输出命令，并执行命令，返回命令输出结果
 * @param command
 */
function execCommand (command) {
  silentLog(command)
  return shell.exec(command)
}

exports.execCommand = execCommand

/**
 * 格式化shelljs的输出结果
 * @param command
 * @param removeLinkBreak 是否同时移除多余的换行符，默认false
 * @return {string}
 */
function strExecCommand (command, removeLinkBreak) {
  let str = execCommand(command).toString()
  if (removeLinkBreak) {
    str = str.replace(/\n/g, '')
  }
  return str
}

exports.strExecCommand = strExecCommand

/**
 * 打印日志并退出
 * @param info
 * @param code
 */
function exit (info, code = 1) {
  console.log(info)
  process.exit(code)
}

exports.exit = exit
