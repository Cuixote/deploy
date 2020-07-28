import Table from 'cli-table3'
import { CURRENT_PROJECT } from '../utils/constants.js'

/**
 * 时间分析
 * @return {string}
 */
export function timeAnalyse () {
  const timeCalc = (start, end) => (end - start) / 1000 + 's'
  const table = new Table({
    colWidths: [18, 40]
  })
  const {
    initStart, initEnd, installStart, installEnd, buildStart, buildEnd,
    assortEnd, assortStart, uploadEnd, uploadStart, warmUpEnd, warmUpStart
  } = CURRENT_PROJECT.times
  table.push(
    [{ colSpan: 2, content: '流程执行时间' }],
    { 初始化: timeCalc(initStart, initEnd) },
    { 安装: timeCalc(installStart, installEnd) },
    { 打包: timeCalc(buildStart, buildEnd) },
    { 分拣: timeCalc(assortStart, assortEnd) },
    { 上传: timeCalc(uploadStart, uploadEnd) },
    { 预热: timeCalc(warmUpStart, warmUpEnd) },
    { 总体: timeCalc(initStart, warmUpEnd) }
  )
  return table.toString()
}
