import execa from 'execa'

export async function execOut (...args) {
  const { stdout, stderr, failed } = await execa(...args)
  if (failed) {
    throw new Error(stderr)
  }
  return stdout
}
