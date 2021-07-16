export default function RequestConstructor() {
  return class Request extends Promise {
    // RequestTask 对象
    static task = null
    // 请求任务是否被中断
    static aborted = false
    // 监听 HTTP Response Header 事件回调函数
    static onHeadersReceivedCallback = null
    // 取消监听 HTTP Response Header 事件回调函数
    static offHeadersReceivedCallback = null

    // 监听 HTTP Response Header 事件执行函数
    static onHeadersReceived(fn) {
      if (typeof fn === 'function') {
        Request.onHeadersReceivedCallback = fn
      }
      if (Request.onHeadersReceivedCallback && Request.task) {
        Request.task.onHeadersReceived?.(Request.onHeadersReceivedCallback)
      }
    }
    // 取消监听 HTTP Response Header 事件执行函数
    static offHeadersReceived(fn) {
      if (typeof fn === 'function') {
        Request.offHeadersReceivedCallback = fn
      }
      if (Request.offHeadersReceivedCallback && Request.task) {
        Request.task.offHeadersReceived?.(Request.offHeadersReceivedCallback)
      }
    }

    // 中断请求任务
    abort() {
      Request.aborted = true
      Request.task?.abort()
      return this
    }
    // 监听 HTTP Response Header 事件
    onHeadersReceived(fn) {
      Request.onHeadersReceived(fn)
      return this
    }
    // 取消监听 HTTP Response Header 事件
    offHeadersReceived(fn) {
      Request.offHeadersReceived(fn)
      return this
    }
  }
}
