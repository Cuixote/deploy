const head = require('./head')
const build = require('./build')
const assort = require('./assort')
const upload = require('./upload')
const warmUp = require('./warm-up')
const timeAnalyse = require('./time-analyse')

const { log } = console

async function main () {
  try {
    log('环境分析中...')
    head()
    log('环境分析完毕!')
    log('▇▇░░░░░░░░ 20%')
    log('')

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

    log('资源上传中...')
    upload()
    log('资源上传完毕!')
    log('▇▇▇▇▇▇▇▇░░ 80%')
    log('')

    log('静态资源预热中...')
    await warmUp()
    log('预热完毕！')
    log('▇▇▇▇▇▇▇▇▇▇ 100%')
    log('')

    log('发布成功 🎆🎆🎆')
    timeAnalyse()
  } catch (e) {
    log(e)
    process.exit(1)
  }
}

module.exports = main
