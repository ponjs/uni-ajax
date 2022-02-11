export default function RequestConstructor() {
  const Request = function Request(executor) {
    return Reflect.construct(Promise, [executor], Request)
  }
  Object.setPrototypeOf(Request, Promise)
  Request.prototype = Object.create(Promise.prototype)
  Request.prototype.constructor = Request

  // RequestTask 对象
  Request.task = null
  // 请求任务是否被中断
  Request.aborted = false
  // 监听 HTTP Response Header 事件回调函数
  Request.onHeadersReceivedCallback = null
  // 取消监听 HTTP Response Header 事件回调函数
  Request.offHeadersReceivedCallback = null

  // 监听 HTTP Response Header 事件执行函数
  Request.onHeadersReceived = function onHeadersReceived(fn) {
    if (typeof fn === 'function') {
      Request.onHeadersReceivedCallback = fn
    }
    if (Request.onHeadersReceivedCallback && Request.task) {
      Request.task.onHeadersReceived?.(Request.onHeadersReceivedCallback)
    }
  }

  // 取消监听 HTTP Response Header 事件执行函数
  Request.offHeadersReceived = function offHeadersReceived(fn) {
    if (typeof fn === 'function') {
      Request.offHeadersReceivedCallback = fn
    }
    if (Request.offHeadersReceivedCallback && Request.task) {
      Request.task.offHeadersReceived?.(Request.offHeadersReceivedCallback)
    }
  }

  // 中断请求任务
  Request.prototype.abort = function abort() {
    Request.aborted = true
    Request.task?.abort()
    return this
  }

  // 监听 HTTP Response Header 事件
  Request.prototype.onHeadersReceived = function onHeadersReceived(fn) {
    Request.onHeadersReceived(fn)
    return this
  }

  // 取消监听 HTTP Response Header 事件
  Request.prototype.offHeadersReceived = function offHeadersReceived(fn) {
    Request.offHeadersReceived(fn)
    return this
  }

  return Request
}
