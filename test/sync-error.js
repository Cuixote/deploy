
process.on('uncaughtException', (a, b) => {
  // console.log(a)
  console.log(b)
})

process.on('uncaughtExceptionMonitor', (a, b) => {
  // console.log(a)
  console.log(b)
})

function foo () {
  throw new Error('a sync error')
}

foo()
