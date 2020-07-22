export const ENV_MAP = new Map([
  ['dev', { branch: 'dev' }],
  ['test', { branch: 'test' }],
  ['stable', { branch: 'stable' }],
  ['production', { branch: 'master' }]
])

export const CURRENT_PROJECT = {
  packageJson: null,
  gitBranchName: null
}
