import isCallback from './isCallback'
import { forEach, tryCatch } from '../utils'

/**
 * 分离请求对象
 * @param {string|object} [url] 请求地址 / 请求配置
 * @param {string|object} [data] 请求参数
 * @param {object} [config] 请求配置
 * @returns {object} 回调函数对象 去除回调的请求参数
 */
export default function detachConfig(url, data, config) {
  // 回调函数对象
  let callback = null
  // 去除回调的请求参数对象
  const options = {}

  // 是否传入单个参数
  const isSingle = typeof url === 'object'

  // 请求参数对象
  const value = isSingle ? url : { ...config, url, data }

  // 分离请求参数
  forEach(value, (val, key) => {
    if (isSingle && isCallback(key)) {
      ;(callback || (callback = {}))[key] = tryCatch(val)
    } else {
      options[key] = val
    }
  })

  return {
    callback,
    config: options
  }
}
