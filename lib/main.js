require('../utils/polyfill')
const head = require('./head')
const build = require('./build')
const assort = require('./assort')
const upload = require('./upload')
const warmUp = require('./warm-up')
const timeAnalyse = require('./time-analyse')
const { CURRENT_PROJECT } = require('../utils/constants')

const { log } = console

async function main () {
  try {
    log('环境分析中...')
    head()
    log('环境分析完毕!')
    log('▇▇░░░░░░░░ 20%')
    log('')

    const { config } = CURRENT_PROJECT
    // 如果是回滚
    if (!config.backup) {
      log('依赖安装中...')
      build()
      log('打包完毕!')
      log('▇▇▇▇░░░░░░ 40%')
      log('')

      log('文件分拆中...')
      assort()
      log('文件分拆完毕！')
      log('▇▇▇▇▇▇░░░░ 60%')
      log('')
    }

    log((config.backup ? '代码回滚' : '资源上传') + '中...')
    upload()
    log((config.backup ? '代码回滚' : '资源上传') + '完毕!')
    log('▇▇▇▇▇▇▇▇░░ 80%')
    log('')

    if (config.skipWarmUp || config.backup) {
      log('跳过预热')
    } else {
      log('静态资源预热中...')
      await warmUp()
      log('预热完毕！')
    }
    log('▇▇▇▇▇▇▇▇▇▇ 100%')
    log('')

    log((config.backup ? '回滚' : '发布') + '成功 🎆🎆🎆')
    timeAnalyse()
  } catch (e) {
    log(e)
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
})

process.on('uncaughtException', (error, type) => {
  console.log(type, ': ', error)
})

module.exports = main
