import { init } from './init.js'
import { build } from './build.js'
import { deploy } from './deploy.js'

async function main () {
  try {
    console.log('环境分析中...')
    await init(() => console.log('环境分析完毕!'))
    console.log(' 🟢 ⚪ ⚪ ⚪ ⚪ 20%')
    console.log('')
    console.log('依赖安装中...')
    await build(() => console.log('打包完毕!'))
    console.log(' 🟢 🟢 ⚪ ⚪ ⚪ 40%')
    console.log('')
    await deploy()
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
    console.log(msg)
  }
}

main()
