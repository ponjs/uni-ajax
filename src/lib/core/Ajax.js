import InterceptorManager from './InterceptorManager'
import RequestConstructor from '../adapters/Request'
import dispatchCancel from './dispatchCancel'
import dispatchRequest from './dispatchRequest'
import detachConfig from '../helpers/detachConfig'
import mergeConfig from '../helpers/mergeConfig'
import originURL from '../helpers/originURL'
import defaults, { METHOD } from '../defaults'
import { forEach } from '../utils'

export default class Ajax {
  constructor(config) {
    // 赋值到实例配置
    this.config = config

    // 挂载拦截器
    this.request.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    }

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
    const { callback, config } = detachConfig(...args)

    // 创建请求类
    const Request = RequestConstructor()

    // 声明 Promise 链
    const chain = [dispatchRequest(Request), dispatchCancel]

    // 将请求拦截遍历添加到链前面
    this.request.interceptors.request.forEach(({ fulfilled, rejected }) =>
      chain.unshift(fulfilled, rejected)
    )

    // 将响应拦截遍历添加到链后面
    this.request.interceptors.response.forEach(({ fulfilled, rejected }) =>
      chain.push(
        fulfilled,
        // 判断发起请求前是否发生错误，如果发生错误则不执行后面的响应错误拦截器
        rejected &&
          (response => (response.__CANCEL__ ? Promise.reject(response) : rejected(response)))
      )
    )

    // 先执行获取 config 请求配置
    chain.unshift(async config => mergeConfig(await this.config, config), undefined)

    // 处理发起请求前的错误数据
    chain.push(undefined, ({ __CANCEL__, ...error }) =>
      Promise.reject(__CANCEL__ ? error.reason : error)
    )

    // 调用请求方法后，且拦截器触发完成后，判断回调参数的执行
    chain.push(
      response => {
        if (!callback) return response
        setTimeout(() => callback.success?.(response))
        setTimeout(() => callback.complete?.(response))
      },
      error => {
        if (!callback) return Promise.reject(error)
        setTimeout(() => callback.fail?.(error))
        setTimeout(() => callback.complete?.(error))
      }
    )

    // 创建请求Promise，遍历链将链上方法传递到then回调
    let request = Request.resolve(config)
    while (chain.length) {
      request = request.then(chain.shift(), chain.shift())
    }

    return request
  }
}
