function foo () {
  // eslint-disable-next-line prefer-promise-reject-errors
  Promise.reject('im a error')
}

foo()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  process.exit(1)
})
