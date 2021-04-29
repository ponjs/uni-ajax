import buildURL from '../helpers/buildURL'
import combineURL from '../helpers/combineURL'
import isCallback from '../helpers/isCallback'
import { forEach, isPlainObject, merge } from '../utils'
import { HEADER } from '../defaults'

/**
 * 派发请求方法
 * @param {*} Request 请求类
 * @returns {Promise} 执行请求方法Promise
 */
export default function dispatchRequest(Request) {
  return config => {
    // 拼接 url
    config.url = buildURL(combineURL(config.baseURL, config.url), config.params)

    // 请求方法转大写
    config.method = (config.method || 'get').toUpperCase()

    // 调整 header 优先级
    config.header = merge(
      config.header.common,
      config.header[config.method.toLowerCase()],
      config.header
    )

    // 清除多余的请求头
    forEach(HEADER, h => isPlainObject(config.header[h]) && delete config.header[h])

    // 清除回调函数
    forEach(config, (val, key) => isCallback(key) && delete config[key])

    // 执行请求方法
    return config.adapter(config, Request)
  }
}
