import { init } from './init.js'
import { build } from './build.js'
import { assort } from './assort.js'
import { deploy } from './deploy.js'

const { log } = console

async function main () {
  try {
    log('环境分析中...')
    const initData = await init()
    log('环境分析完毕!')
    log(initData)
    log(' 🟢 ⚪ ⚪ ⚪ ⚪ 20%')
    log('')

    log('依赖安装中...')
    await build()
    log('打包完毕!')
    log(' 🟢 🟢 ⚪ ⚪ ⚪ 40%')
    log('')

    log('sourcemap分拆中...')
    await assort()
    log('sourcemap分拆完毕！')
    log(' 🟢 🟢 🟢 ⚪ ⚪ 60%')
    log('')

    log('发布中...')
    await deploy()
    log('发布完毕!')
    log(' 🟢 🟢 🟢 🟢 ⚪ 80%')
    log('')
  } catch (e) {
    let msg = ' ❌ '
    if (e) {
      if (e.message) {
        msg += e.message
      } else if (e.stderr) {
        msg += e.stderr
      } else {
        msg += e
      }
    } else {
      msg += '未知错误，请检查代码'
    }
    log(msg)
  }
}

main()
