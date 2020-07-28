import shell from 'shelljs'
import { init } from './init.js'
import { build } from './build.js'
import { assort } from './assort.js'
import { upload } from './upload.js'
import { warmUp } from './warm-up.js'
import { timeAnalyse } from './time-analyse.js'
import { CURRENT_PROJECT } from '../utils/constants.js'

const { log } = console

async function main () {
  try {
    log('环境分析中...')
    const initData = init()
    log('环境分析完毕!')
    log(initData)
    log(' 🟢 ⚪ ⚪ ⚪ ⚪ 20%')
    log('')

    log('依赖安装中...')
    build()
    log('打包完毕!')
    log(' 🟢 🟢 ⚪ ⚪ ⚪ 40%')
    log('')

    log('sourcemap分拆中...')
    assort()
    log('sourcemap分拆完毕！')
    log(' 🟢 🟢 🟢 ⚪ ⚪ 60%')
    log('')

    log('资源上传中...')
    upload()
    log('资源上传完毕!')
    log(' 🟢 🟢 🟢 🟢 ⚪ 80%')
    log('')

    log('静态资源预热中...')
    await warmUp()
    log('预热完毕！')
    log(' 🟢 🟢 🟢 🟢 🟢 100%')
    log('')

    log('发布成功 🎆🎆🎆')
    log(timeAnalyse())
  } catch (e) {
    log(e)
  }
}

// 配置shelljs
(function () {
  // 所有命令不输出
  shell.config.silent = CURRENT_PROJECT.config.silent
  // 抛出js error
  shell.config.fatal = true
})()

// 执行
main()
