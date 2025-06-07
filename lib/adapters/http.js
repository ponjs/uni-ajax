export default function adapter(config) {
  return new Promise((resolve, reject) => {
    let onCanceled

    const requestTask = uni.request({
      ...config,
      complete: result => {
        if (config.signal) {
          config.signal.removeEventListener('abort', onCanceled)
        }

        // 根据状态码判断要执行的触发的状态
        const response = { config, ...result }
        !config.validateStatus || config.validateStatus(result.statusCode)
          ? resolve(response)
          : reject(response)
      }
    })

    if (config.signal) {
      onCanceled = function () {
        requestTask.abort()
        reject({ config, errMsg: 'request:fail abort' })
      }
      if (config.signal.aborted) onCanceled()
      else config.signal.addEventListener('abort', onCanceled)
    }
  })
}
