const fse = require('fs-extra')
const { CURRENT_PROJECT } = require('../utils/constants')
const { recordTime, silentLog, execCommand, strExecCommand, exit } = require('../utils/common')

const { log } = console

const distIndexPath = 'dist/index.html'

/**
 * 上传文件到七牛
 */
module.exports = function upload () {
  recordTime('uploadStart')
  const config = CURRENT_PROJECT.config
  // 备份路径
  const backupIndexPath = `backup/${config.env}/index.html`

  // 如果是回滚，跳过静态资源上传
  if (!config.backup) {
    // 静态资源上传
    staticSourceUpload(config)
  }

  // 获取上传地址
  const uploadIndexPath = getUploadPath(config, backupIndexPath)

  // 发送index.html到服务器
  sentToServer(config, uploadIndexPath)

  // 备份
  if (config.backup) {
    backupRollBack(config, backupIndexPath)
  } else {
    backup(config, backupIndexPath)
  }
  recordTime('uploadEnd')
}

/**
 * 静态资源上传
 * @param config
 */
function staticSourceUpload (config) {
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
   * @param rescan-local 重新扫描本地目录以上传新添加的文件
   * @param overwrite 覆盖Bucket中名称相同但是内容不同的文件
   */
  const stdout = execCommand('qshell qupload2 --src-dir=dist' +
    ` --bucket=${config.uploadBucket} --key-prefix=${config.env}/${config.name}/` +
    ' --thread-count=10 --rescan-local=true --check-exists=true --check-hash=true --overwrite=true'
  )
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
    log(strExecCommand(`awk '{print $4 $5}' ${logPath} | tail -n 8`).toString())
    log(`更多信息请在log文件中查看: cat ${logPath}`)
  }
}

/**
 * 备份
 * @param config
 * @param backupIndexPath
 */
function backup (config, backupIndexPath) {
  fse.ensureDirSync('backup')
  fse.ensureDirSync(`backup/${config.env}`)
  const tempPath = `backup/${config.env}/latest.html`
  if (fse.existsSync(tempPath)) {
    fse.copySync(tempPath, backupIndexPath)
  }
  fse.copySync(distIndexPath, tempPath)
}

/**
 * 备份回滚
 * @param config
 * @param backupIndexPath
 */
function backupRollBack (config, backupIndexPath) {
  const tempPath = `backup/${config.env}/latest.html`
  fse.removeSync(tempPath)
  fse.moveSync(backupIndexPath, tempPath)
}

/**
 * 获取要上到服务器的index.html路径
 * @param config
 * @param backupIndexPath
 * @return {string|*}
 */
function getUploadPath (config, backupIndexPath) {
  if (config.backup) {
    if (fse.existsSync(backupIndexPath)) {
      return backupIndexPath
    } else {
      throw new Error('备份文件不存在，无法回滚')
    }
  } else {
    return distIndexPath
  }
}

/**
 * 发送index.html到服务器
 * @param config
 * @param uploadIndexPath
 */
function sentToServer (config, uploadIndexPath) {
  const serverList = config.server[config.env] || []
  if (!serverList.length) {
    exit('请设置服务器列表')
  }

  serverList.forEach(({ account, domain, path, port }) => {
    // 修改index.html的权限为其他人可读取
    execCommand(`chmod o+r ${uploadIndexPath}`)
    // 上传到服务器
    execCommand(`scp -P ${port} ${uploadIndexPath} ${account}@${domain}:${path}`)
  })
}
