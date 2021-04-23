import { assign, forEach } from '../utils'

/**
 * 合并请求配置（深度合并，且不合并 undefined 值）
 * @param {object} config1 前请求配置
 * @param {object} [config2] 后请求配置
 * @returns {object} 合并后的请求配置
 */
export default function mergeConfig(config1, config2 = {}) {
  const config = {}

  const configKeys = Object.keys({ ...config1, ...config2 })

  forEach(configKeys, prop => {
    if (config2[prop] !== undefined) {
      config[prop] = assign(config1[prop], config2[prop])
    } else if (config1[prop] !== undefined) {
      config[prop] = assign(undefined, config1[prop])
    }
  })

  config.method = config.method.toUpperCase()

  return config
}
