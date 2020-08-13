const { CURRENT_PROJECT } = require('../utils/constants')

/**
 * 时间分析
 * @return {string}
 */
module.exports = function timeAnalyse () {
  const timeCalc = (start, end) => (end - start) / 1000 + 's'
  const {
    headStart, headEnd, installStart, installEnd, buildStart, buildEnd,
    assortEnd, assortStart, uploadEnd, uploadStart, warmUpEnd, warmUpStart
  } = CURRENT_PROJECT.times
  console.log(`
|  初始化: ${timeCalc(headStart, headEnd)}
|  安装: ${timeCalc(installStart, installEnd)}
|  打包: ${timeCalc(buildStart, buildEnd)}
|  分拣: ${timeCalc(assortStart, assortEnd)}
|  上传: ${timeCalc(uploadStart, uploadEnd)}
|  预热: ${timeCalc(warmUpStart, warmUpEnd)}
|  总体: ${timeCalc(headStart || installStart || buildStart || assortStart || uploadStart || warmUpStart || Date.now(), warmUpEnd || Date.now())}
  `)
}
