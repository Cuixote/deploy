export const ENV_MAP = new Map([
  ['dev', { branch: 'dev' }],
  ['test', { branch: 'test' }],
  ['stable', { branch: 'stable' }],
  ['production', { branch: 'master' }]
])

export const CURRENT_PROJECT = {
  packageJson: null,
  gitBranchName: null,
  env: null,
  remoteDomain: 'https://imgvideo.120yibao.com',
  times: {
    initStart: 0,
    initEnd: 0,
    installStart: 0,
    installEnd: 0,
    buildStart: 0,
    buildEnd: 0,
    assortStart: 0,
    assortEnd: 0,
    uploadStart: 0,
    uploadEnd: 0,
    warmUpStart: 0,
    warmUpEnd: 0
  }
}
