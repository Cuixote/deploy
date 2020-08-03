if (!Promise.allSettled) {
  Promise.allSettled = function (pList) {
    // Promise.all会返回一个Promise实例
    return new Promise((resolve, reject) => {
      // 没有iterable，直接抛错退出
      if (typeof pList[Symbol.iterator] !== 'function') {
        return reject(
          new TypeError(
            `${typeof pList} is not iterable (cannot read property Symbol(Symbol.iterator))`
          )
        )
      }
      const len = pList.length
      const result = []
      // 没有可迭代项直接返回[]
      if (len === 0) {
        return resolve(result)
      }
      // 记录个数
      let index = 0
      for (let i = 0; i < len; i++) {
        let p = pList[i]
        // 当前项不是promise实例，转为Promise resolve状态
        // 此处本来可以直接返回值的（同步执行），但是官方实现里，凡是length>0的，都必须是异步
        if (p && typeof p.then !== 'function') {
          p = Promise.resolve(p)
        }
        p.then(res => ({ status: 'fulfilled', value: res }), err => ({ status: 'rejected', value: err }))
          .then(res => {
            result[i] = res
            if (++index === len) {
              resolve(result)
            }
          })
      }
    })
  }
}
