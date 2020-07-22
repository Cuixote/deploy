import { ENV_MAP, CURRENT_PROJECT } from '../utils/constants.js'
import { execOut } from '../utils/common'

export async function deploy () {
  const argv = process.argv
  if (argv.length < 3) {
    throw new Error('请设置要发布的环境')
  }

  const env = argv[2]
  if (!ENV_MAP.get(env)) {
    throw new Error('请设置正确的环境名称, 如' + Array.from(ENV_MAP.keys()).join(','))
  }

  const branch = ENV_MAP.get(env).branch
  const { gitBranchName, packageJson } = CURRENT_PROJECT
  if (branch !== gitBranchName) {
    throw new Error(`当前分支 ${gitBranchName} 与 环境 ${env} 不对应，请检查你的配置！`)
  }

  const stdout = await execOut('qshell', [
    'qupload2',
    `--key-prefix=${env}/${packageJson.name}/`,
    '--thread-count=10',
    '--src-dir=dist',
    '--bucket=yibao-static',
    '--check-exists=true',
    '--check-hash=true'
  ])
  if (stdout) {
    const logPath = stdout.match(/(See upload log at path )([\S]+)/)
    return logPath[logPath.length - 1]
  }
}
