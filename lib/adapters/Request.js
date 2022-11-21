export default function RequestConstructor() {
  function Request(executor) {
    return Reflect.construct(Promise, [executor], Request)
  }

  Object.setPrototypeOf(Request, Promise)
  Request.prototype = Object.create(Promise.prototype)
  Request.prototype.constructor = Request

  // 中断请求任务
  Request.prototype.abort = function abort() {
    Request.aborted = true
    Request.task?.abort()
    return this
  }

  // 监听 HTTP Response Header 事件
  Request.prototype.onHeadersReceived = function onHeadersReceived(fn) {
    if (typeof fn === 'function') {
      Request.onHeadersReceived = fn
    }
    if (Request.onHeadersReceived && Request.task) {
      Request.task.onHeadersReceived?.(Request.onHeadersReceived)
    }
    return this
  }

  // 取消监听 HTTP Response Header 事件
  Request.prototype.offHeadersReceived = function offHeadersReceived(fn) {
    if (typeof fn === 'function') {
      Request.offHeadersReceived = fn
    }
    if (Request.offHeadersReceived && Request.task) {
      Request.task.offHeadersReceived?.(Request.offHeadersReceived)
    }
    return this
  }

  return Request
}
