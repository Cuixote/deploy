const ENV_LIST = ['dev', 'test', 'stable', 'production']

exports.ENV_LIST = ENV_LIST

const CURRENT_PROJECT = {
  env: null,
  config: {
    name: null,
    uploadDomain: null,
    uploadBucket: null,
    server: null,
    buildFileSizeLimit: 100,
    silent: true
  },
  times: {
    headStart: 0,
    headEnd: 0,
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
