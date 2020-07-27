import shell from 'shelljs'
import { CURRENT_PROJECT } from '../utils/constants.js'
import { execOut } from '../utils/common.js'

export async function deploy () {
  const { env, packageJson } = CURRENT_PROJECT
  // 七牛云上传工具
  // https://github.com/qiniu/qshell/blob/master/docs/qupload.md
  // https://github.com/qiniu/qshell/blob/master/docs/qupload2.md
  const stdout = await execOut('qshell', [
    'qupload2',
    // 在保存文件在七牛空间时，使用的文件名的前缀
    `--key-prefix=${env}/${packageJson.name}/`,
    // 多线程
    '--thread-count=10',
    // 本地同步路径
    '--src-dir=dist',
    // 同步数据的目标空间名称
    '--bucket=yibao-video',
    // 每个文件上传之前是否检查空间中是否存在同名文件，默认为false，不检查
    '--check-exists=true',
    // 在check_exists设置为true的情况下生效，是否检查本地文件hash和空间文件hash一致，默认不检查，节约同步时间
    '--check-hash=true'
  ])
  if (stdout) {
    // console.log(stdout)
    const logPath = stdout.match(/(See upload log at path )([\S]+)/)
    console.log('发布结果如下：')
    shell.exec('awk \'{print $4 $5}\' ' + logPath[logPath.length - 1] + ' | tail -n 8')
  }
}
