# 网络请求任务

- 类型：`XMLHttpRequest`

- 示例：
  通过请求配置的 [fetcher](/api/config#fetcher) 属性获取原生 RequestTask 对象，该属性需要传递抓取器实例，请求方法内部会抓取 `uni.request` 的返回值。<Badge>2.5.0</Badge>

  ```js
  import ajax, { Fetcher } from 'uni-ajax'

  const fetcher = new Fetcher()
  ajax({ fetcher })

  // 中断请求（Fetcher 只封装了 abort 方法，其他请使用 source 获取使用）
  fetcher.abort()
  const requestTask = await fetcher.source() // 获取请求任务对象
  ```

  ::: details 可通过请求配置的 [xhr](/api/config#xhr) 获取原生 RequestTask 对象，进而可以执行下面方法。但是 uni-ajax 已经将这些方法封装，使其方便调用。<Badge type="danger">2.5.0</Badge>
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

  // 通过封装的方法调用
  const request = ajax('https://www.example.com/api/demo').catch(err => {
    console.log(err)
  })
  request.abort()
  ```
  :::

## abort

中断请求任务。

## offHeadersReceived

取消监听 HTTP Response Header 事件，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.offHeadersReceived.html)。

## onHeadersReceived

监听 HTTP Response Header 事件。会比请求完成事件更早，仅微信小程序平台支持，[文档详情](https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.onHeadersReceived.html)。
