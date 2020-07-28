const ENV_MAP = new Map([
  ['dev', { branch: 'dev' }],
  ['test', { branch: 'test' }],
  ['stable', { branch: 'stable' }],
  ['production', { branch: 'master' }]
])

exports.ENV_MAP = ENV_MAP

const CURRENT_PROJECT = {
  gitBranchName: null,
  env: null,
  config: {
    name: null,
    uploadDomain: null,
    uploadBucket: null,
    buildFileSizeLimit: 100,
    silent: true
  },
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

exports.CURRENT_PROJECT = CURRENT_PROJECT
