/**
 * 环境列表
 * @type {string[]}
 */
const ENV_LIST = ['dev', 'test', 'stable', 'production']

exports.ENV_LIST = ENV_LIST

/**
 * npm源地址
 * @type {{OFFICIAL: string, TaoBao: string}}
 */
const REGISTRY = {
  OFFICIAL: 'https://registry.npmjs.org',
  TaoBao: 'https://registry.npm.taobao.org'
}

exports.REGISTRY = REGISTRY

/**
 * 当前项目的环境变量
 */
const CURRENT_PROJECT = {
  config: {
    env: null,
    name: null,
    uploadDomain: null,
    uploadBucket: null,
    server: null,
    buildFileSizeLimit: 100,
    verbose: false,
    path: '.deploy.json',
    registry: REGISTRY.TaoBao,
    skipWarmUp: false,
    backup: false
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
