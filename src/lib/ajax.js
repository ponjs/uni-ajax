import Interceptor from './interceptor'
import defaults, { METHOD } from './defaults'
import { detachConfig, mergeConfig, originURL } from './helpers'
import { forEach } from './utils'
import { handleRequest, handleResponse } from './handler'

export default class Ajax {
  constructor(config) {
    // 合并请求配置赋值到实例配置
    this.config = mergeConfig(defaults, config)

    // 挂载拦截器
    this.request.interceptors = { request: new Interceptor(), response: new Interceptor() }

    // 挂载接口根地址 baseURL
    this.request.baseURL = this.config.baseURL || ''

    // 挂载接口根地址的源地址 origin
    this.request.origin = originURL(this.config.baseURL)

    // 挂载修改 config 方法
    this.request.config = fn => (this.config = fn(this.config))

    // 挂载对应的 method 方法
    forEach(METHOD, method => {
      this.request[method] = (url, data, config) =>
        this.request(
          ...(typeof url === 'string' ? [url, data, { ...config, method }] : [{ ...url, method }])
        )
    })
  }
  request = (...args) => {
    // 分类请求参数
    const { callback, params } = detachConfig(...args)
    // 回调函数字段
    const fields = Object.keys(callback)
    // 定义 RequestTask 所需字段
    let requestTask, aborted, onHeadRcvd, offHeadRcvd

    // 继承 Promise 封装 RequestTask 的一些方法
    class Request extends Promise {
      // 中断请求任务
      abort() {
        aborted = true
        requestTask?.abort()
        return this
      }
      // 监听 HTTP Response Header 事件
      onHeadersReceived(fn) {
        onHeadRcvd = fn
        requestTask?.onHeadersReceived?.(fn)
        return this
      }
      // 取消监听 HTTP Response Header 事件
      offHeadersReceived(fn) {
        offHeadRcvd = fn
        requestTask?.offHeadersReceived?.(fn)
        return this
      }
    }

    return new Request(async (resolve, reject) => {
      // 统一处理请求错误
      try {
        // 请求拦截后的配置
        var config = await handleRequest.call(this, params)
      } catch (error) {
        // 如果有回调参数 执行 fail / complete
        callback.fail?.(error)
        callback.complete?.(error)
        // 没有回调参数时抛出请求错误
        return !fields.length && reject(error)
      }

      // 接口调用结束的回调函数
      const complete = handleResponse.call(this, { config, callback, resolve, reject })

      // 判断是否被取消请求
      if (aborted) return complete({ errMsg: 'request:fail abort' })

      // 发起请求
      try {
        requestTask = uni.request({ ...config, complete })
      } catch (error) {
        const result = await this.request.interceptors.request
          .rejected({ config, ...error })
          ?.catch(err => err)
        return complete(result)
      }

      // 根据配置的 xhr 属性执行获取 requestTask
      typeof config.xhr === 'function' && config.xhr(requestTask, config)

      // 当传入 success / fail / complete 之一时，返回 requestTask 对象
      fields.length && resolve(requestTask)

      // 判断是否执行监听 HTTP Response Header 事件
      onHeadRcvd && requestTask.onHeadersReceived?.(onHeadRcvd)
      offHeadRcvd && requestTask.offHeadersReceived?.(offHeadRcvd)
    })
  }
}
