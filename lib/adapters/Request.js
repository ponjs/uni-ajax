const ON_HEADERS_RECEIVED = Symbol('$$onHeadersReceived')
const OFF_HEADERS_RECEIVED = Symbol('$$offHeadersReceived')

const Request = (function () {
  function Request(executor) {
    return Reflect.construct(Promise, [executor], Request)
  }

  Object.setPrototypeOf(Request, Promise)
  Request.prototype = Object.create(Promise.prototype)
  Request.prototype.constructor = Request

  // 中断请求任务
  Request.prototype.abort = function abort() {
    this.aborted = true
    this.task?.abort()
    return this
  }

  // 监听 HTTP Response Header 事件
  Request.prototype.onHeadersReceived = function onHeadersReceived(fn) {
    if (typeof fn === 'function') {
      this[ON_HEADERS_RECEIVED] = fn
    }
    const callback = this[ON_HEADERS_RECEIVED]
    if (callback && this.task) {
      this.task.onHeadersReceived?.(callback)
    }
    return this
  }

  // 取消监听 HTTP Response Header 事件
  Request.prototype.offHeadersReceived = function offHeadersReceived(fn) {
    if (typeof fn === 'function') {
      this[OFF_HEADERS_RECEIVED] = fn
    }
    const callback = this[OFF_HEADERS_RECEIVED]
    if (callback && this.task) {
      this.task.offHeadersReceived?.(callback)
    }
    return this
  }
})()

export default Request
