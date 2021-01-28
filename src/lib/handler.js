import { HEADER } from './defaults'
import { combineURL, mergeConfig, isCallback } from './helpers'
import { forEach, isObject, merge } from './utils'

/**
 * 处理请求前
 * @param {object} request 请求参数
 * @returns {object} 处理后的请求参数对象
 */
export async function handleRequest(request) {
  let params = mergeConfig(this.config, request)

  // 这里转大写是方便拦截器的相应操作
  params.method = params.method.toUpperCase()

  // 拦截后的请求参数
  let config = await this.request.interceptors.request.fulfilled(params)

  // 判断请求拦截返回是否为对象
  if (!isObject(config)) {
    const error = await this.request.interceptors.request.rejected({
      config,
      errMsg: 'request:fail parameter'
    })
    return Promise.reject(error)
  }

  // 拼接 url
  config.url = combineURL(config.baseURL, config.url)

  // 请求方法转大写
  config.method = config.method.toUpperCase()

  // 调整 header 优先级
  config.header = merge(
    config.header.common,
    config.header[config.method.toLowerCase()],
    config.header
  )

  // 清除多余的请求头
  forEach(HEADER, h => isObject(config.header[h]) && delete config.header[h])

  // 清除回调函数
  forEach(config, (fn, key) => isCallback(key) && delete config[key])

  return config
}

/**
 * 处理响应后
 * @param {object} config 请求配置
 * @param {object} callback 回调函数对象
 * @param {function} resolve Promise 的 resolve 方法
 * @param {function} reject Promise 的 reject 方法
 * @returns {function} 处理后的 complete 方法
 */
export function handleResponse(config, callback, resolve, reject) {
  return async res => {
    try {
      // 根据状态码判断要执行的回调和拦截器
      const state =
        !config.validateStatus || config.validateStatus(res.statusCode) ? 'fulfilled' : 'rejected'
      var result = await this.request.interceptors.response[state]({ config, ...res })
      var field = state === 'fulfilled' ? 'success' : 'fail'
    } catch (error) {
      // 拦截器返回错误
      result = error
      field = 'fail'
    }

    const fields = Object.keys(callback)
    // 请求参数没有回调函数
    if (!fields.length) return field === 'success' ? resolve(result) : reject(result)
    // 异步执行回调函数
    fields.includes(field) && (async () => callback[field](result))()
    fields.includes('complete') && (async () => callback.complete(result))()
  }
}
