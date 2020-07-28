const shell = require('shelljs')
const { CURRENT_PROJECT } = require('../utils/constants')
const { getShellString, recordTime, silentLog } = require('../utils/common')

/**
 * 上传文件到七牛
 */
module.exports = function upload () {
  recordTime('uploadStart')
  const { env, config } = CURRENT_PROJECT
  /**
   * 七牛云上传工具
   * @desc https://github.com/qiniu/qshell/blob/master/docs/qupload.md
   * @desc https://github.com/qiniu/qshell/blob/master/docs/qupload2.md
   * @param key-prefix 在保存文件在七牛空间时，使用的文件名的前缀
   * @param thread-count 多线程
   * @param src-dir 本地同步路径
   * @param bucket 同步数据的目标空间名称
   * @param check-exists 每个文件上传之前是否检查空间中是否存在同名文件，默认为false，不检查
   * @param check-hash 在check_exists设置为true的情况下生效，是否检查本地文件hash和空间文件hash一致，默认不检查，节约同步时间
   */
  const stdout = getShellString(shell.exec('qshell qupload2 --src-dir=dist' +
    ` --bucket=${config.uploadBucket} --key-prefix=${env}/${config.name}/` +
    ' --thread-count=10 --rescan-local=true --check-exists=true --check-hash=true'
  ))
  recordTime('uploadEnd')
  silentLog(stdout)
  if (stdout) {
    let logPath = stdout.match(/(See upload log at path )([\S]+)/)
    logPath = logPath[logPath.length - 1]
    console.log('发布结果如下：')
    console.log(shell.exec('awk \'{print $4 $5}\' ' + logPath + ' | tail -n 8').toString())
    console.log(`更多信息请在log文件中查看: cat ${logPath}`)
  }
}
