import Interceptor from './interceptor'
import createRequest from './request'
import defaults, { METHOD } from './defaults'
import { detachConfig, mergeConfig, originURL } from './helpers'
import { forEach } from './utils'
import { handleRequest, handleResponse } from './handler'

export default class Ajax {
  constructor(config) {
    // 赋值到实例配置
    this.config = config

    // 请求前处理函数
    this.handleRequest = handleRequest

    // 响应后处理函数
    this.handleResponse = handleResponse

    // 挂载拦截器
    this.request.interceptors = { request: new Interceptor(), response: new Interceptor() }

    // 因为 config 传入的可能是异步函数
    ;(async () => {
      // 挂载接口根地址 baseURL
      this.request.baseURL = (await this.config).baseURL || ''

      // 挂载接口根地址的源地址 origin
      this.request.origin = originURL(this.request.baseURL)
    })()

    // 挂载修改 config 方法
    this.request.config = async fn => (this.config = await fn(this._config))

    // 挂载对应的 method 方法
    forEach(METHOD, method => {
      this.request[method] = (url, data, config) =>
        this.request(
          ...(typeof url === 'string' ? [url, data, { ...config, method }] : [{ ...url, method }])
        )
    })
  }

  set config(config) {
    this._config =
      typeof config === 'function'
        ? async () => mergeConfig(defaults, await config())
        : mergeConfig(defaults, config)
  }
  get config() {
    return typeof this._config === 'function' ? this._config() : this._config
  }

  request = (...args) => {
    // 分类请求参数
    const { callback, options } = detachConfig(...args)
    // 回调函数字段
    const fields = Object.keys(callback)
    // 创建请求类
    const Request = createRequest()

    // 实例化请求类
    return new Request(async (resolve, reject) => {
      // 统一处理请求错误
      try {
        // 请求拦截后的配置
        var config = await this.handleRequest(options)
      } catch (error) {
        // 如果有回调参数 执行 fail / complete
        callback.fail?.(error)
        callback.complete?.(error)
        // 没有回调参数时抛出请求错误
        return !fields.length && reject(error)
      }

      // 接口调用结束的回调函数
      const complete = this.handleResponse({ config, callback, resolve, reject })

      // 判断是否被取消请求
      if (Request.aborted) return complete({ errMsg: 'request:fail abort' })

      // 发起请求
      Request.requestTask = uni.request({ ...config, complete })

      // 根据配置的 xhr 属性执行获取 requestTask
      typeof config.xhr === 'function' && config.xhr(Request.requestTask, config)

      // 当传入 success / fail / complete 之一时，返回 requestTask 对象
      fields.length && resolve(Request.requestTask)

      // class 内部判断是否执行监听 HTTP Response Header 事件
      Request.onHeadersReceived()
      Request.offHeadersReceived()
    })
  }
}
