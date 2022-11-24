# RequestTask

网络请求任务对象。可通过请求配置的 [xhr](/api/config#xhr) 获取原生 RequestTask 对象，进而可以执行下面方法。但是 uni-ajax 已经将这些方法封装，使其方便调用。

- 类型：`XMLHttpRequest`

- 示例：

  ```js
  // 通过 xhr 属性获取原生 RequestTask 对象调用
  ajax({
    url: 'https://www.example.com/api/demo',
    xhr: (requestTask, config) => {
      requestTask.abort()
    },
    fail: err => {
      console.log(err)
    }
  })
  ```

  ```js
  // 通过封装的方法调用
  const request = ajax('https://www.example.com/api/demo').catch(err => {
    console.log(err)
  })
  request.abort()
  ```

## abort

中断请求任务。

## offHeadersReceived

取消监听 HTTP Response Header 事件，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.offHeadersReceived.html)。

## onHeadersReceived

监听 HTTP Response Header 事件。会比请求完成事件更早，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.onHeadersReceived.html)。
