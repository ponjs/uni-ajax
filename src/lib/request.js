export default function createRequest() {
  return class Request extends Promise {
    // RequestTask 对象
    static requestTask
    // 请求任务是否被中断
    static aborted
    // 监听 HTTP Response Header 事件函数
    static onHeadRcvd
    // 取消监听 HTTP Response Header 事件函数
    static offHeadRcvd

    // 监听 HTTP Response Header 事件执行函数
    static onHeadersReceived(fn) {
      if (typeof fn === 'function') {
        Request.onHeadRcvd = fn
      }
      if (Request.onHeadRcvd && Request.requestTask) {
        Request.requestTask.onHeadersReceived?.(Request.onHeadRcvd)
      }
    }
    // 取消监听 HTTP Response Header 事件执行函数
    static offHeadersReceived(fn) {
      if (typeof fn === 'function') {
        Request.offHeadRcvd = fn
      }
      if (Request.offHeadRcvd && Request.requestTask) {
        Request.requestTask.offHeadersReceived?.(Request.offHeadRcvd)
      }
    }

    // 中断请求任务
    abort() {
      Request.aborted = true
      Request.requestTask?.abort()
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
