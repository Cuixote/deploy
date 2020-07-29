const fetch = require('node-fetch')
const { findAllFiles, recordTime, silentLog } = require('../utils/common')
const { CURRENT_PROJECT } = require('../utils/constants')

/**
 * 返回url列表
 * @param remotePath 远程路径
 * @param targetPath 本地路径
 * @return {string[]}
 */
function composeUrlList (targetPath, remotePath) {
  const targetList = []
  findAllFiles(targetPath, targetList)
  return targetList.map(i => i.replace(targetPath, remotePath))
}

// 重试次数
const limit = 3
const { log } = console

let retry = limit
async function mainProcess (list, origin) {
  if (retry === limit) {
    silentLog('静态资源CDN预热开始...')
  }
  try {
    const resList = await Promise.all(list.map(i => fetch(i)))
    const failList = resList.map((res, index) => {
      if (!res.ok) {
        return list[index]
      } else {
        silentLog(' ✅ ' + res.url)
        return 0
      }
    }).filter(i => i)
    if (failList.length) {
      log(`${(failList.length / origin.length * 100).toFixed(2)}%的资源还未到达节点`)
      if (retry) {
        retry--
        log(`第${limit - retry}次重试中...`)
        await mainProcess(failList, origin)
      } else {
        log(`${limit}次重试次数已用完，请考虑手动尝试，或者重新发布。`)
        failList.forEach(i => {
          log(i)
        })
      }
    } else {
      silentLog(' ✅ 所有静态资源都已到达CDN子节点')
    }
  } catch (err) {
    log(err)
  }
}

/**
 * 预热
 */
module.exports = async function warmUp () {
  recordTime('warmUpStart')
  const { config: { env, name, uploadDomain } } = CURRENT_PROJECT
  let urlList = composeUrlList('dist', `${uploadDomain}/${env}/${name}`)
  // 排除.map文件
  urlList = urlList.filter(url => !/\.map$/.test(url))
  await mainProcess(urlList, urlList)
  recordTime('warmUpEnd')
}
