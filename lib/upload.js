const { CURRENT_PROJECT } = require('../utils/constants')
const { recordTime, silentLog, execCommand, exit } = require('../utils/common')

const { log } = console

/**
 * 上传文件到七牛
 */
module.exports = function upload () {
  recordTime('uploadStart')
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
  const config = CURRENT_PROJECT.config
  const stdout = execCommand('qshell qupload2 --src-dir=dist' +
    ` --bucket=${config.uploadBucket} --key-prefix=${config.env}/${config.name}/` +
    ' --thread-count=10 --rescan-local=true --check-exists=true --check-hash=true'
  )
  recordTime('uploadEnd')
  silentLog(stdout)
  // 没有输出结果
  if (!stdout) {
    exit('上传失败！' + stdout)
  }
  let logPath = stdout.match(/(See upload log at path )([\S]+)/)
  // 输出结果不是成功的格式
  if (!logPath) {
    exit('上传失败！' + stdout)
  }
  logPath = logPath[logPath.length - 1]
  const fail = execCommand(`tail -n 8 ${logPath} | awk '/Failure/ {print $5}'`).toString()
  // 输出结果中有失败数
  if (+fail > 0) {
    exit('上传失败！更多信息请在log文件中查看: cat ' + logPath)
  } else {
    log('发布结果如下：')
    log(execCommand(`awk '{print $4 $5}' ${logPath} | tail -n 8`).toString())
    log(`更多信息请在log文件中查看: cat ${logPath}`)
  }

  // 发送index.html到服务器
  const serverList = config.server[config.env] || []
  if (!serverList.length) {
    exit('请设置服务器列表')
  }
  serverList.forEach(({ account, domain, path, port }) => {
    execCommand(`scp -P ${port} dist/index.html ${account}@${domain}:${path}`)
  })
}
