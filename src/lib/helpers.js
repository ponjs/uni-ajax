import { assign, forEach } from './utils'

/**
 * 分离请求对象
 * @param {string|object} [url] 请求地址 / 请求配置
 * @param {string|object} [data] 请求参数
 * @param {object} [config] 请求配置
 * @returns {object} 回调函数对象 去除回调的请求参数
 */
export function detachConfig(url, data, config) {
  // 回调函数对象
  let callback = {}
  // 去除回调的请求参数对象
  let params = {}

  // 请求参数对象
  const value = typeof url === 'string' ? { ...config, url, data } : url

  // 分离请求参数
  forEach(value, (val, key) => {
    if (isCallback(key)) callback[key] = val
    else params[key] = val
  })

  return { callback, params }
}

/**
 * 合并请求配置（深度合并，且不合并 undefined 值）
 * @param {object} config1 前请求配置
 * @param {object} [config2] 后请求配置
 * @returns {object} 合并后的请求配置
 */
export function mergeConfig(config1, config2 = {}) {
  let config = {}

  const configKeys = Object.keys({ ...config1, ...config2 })

  forEach(configKeys, prop => {
    if (config2[prop] !== undefined) {
      config[prop] = assign(config1[prop], config2[prop])
    } else if (config1[prop] !== undefined) {
      config[prop] = assign(undefined, config1[prop])
    }
  })

  return config
}

/**
 * 判断参数是否含有回调参数 success / fail / complete 之一
 * @param {string} field 参数的 Key 值字符串
 * @returns {boolean} 返回判断值
 */
export function isCallback(field) {
  return ['success', 'fail', 'complete'].includes(field)
}

/**
 * 根据 baseURL 和 url 拼接
 * @param {string} baseURL 请求跟地址
 * @param {string} relativeURL 请求参数地址
 * @returns {string} 拼接后的地址
 */
export function combineURL(baseURL = '', relativeURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(relativeURL)) return relativeURL
  // 去除 baseURL 结尾斜杠，去除 relativeURL 开头斜杠，再判断拼接
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 根据 baseURL 获取源地址
 * @param {string} baseURL 请求跟地址
 * @returns {string} 源地址
 */
export function originURL(baseURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (!/^https?:\/\//.test(baseURL)) return ''
  const u = baseURL.split('/')
  return u[0] + '//' + u[2]
}
