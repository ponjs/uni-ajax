export default function adapter(config, Request) {
  return new Promise((resolve, reject) => {
    // 判断是否被取消请求
    if (Request.aborted) {
      return reject({
        config,
        errMsg: 'request:fail abort'
      })
    }

    // 发起请求，并挂载 RequestTask
    Request.task = uni.request({
      ...config,
      complete: result => {
        // 根据状态码判断要执行的触发的状态
        const response = { config, ...result }
        !config.validateStatus || config.validateStatus(result.statusCode)
          ? resolve(response)
          : reject(response)
      }
    })

    // 请求类内部判断是否执行监听 HTTP Response Header 事件
    Request.onHeadersReceived()
    Request.offHeadersReceived()

    // 根据配置的 xhr 属性执行获取 RequestTask
    config.xhr?.(Request.task, config)
  })
}
