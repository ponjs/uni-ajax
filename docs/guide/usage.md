# 使用方法

## 发起请求

我们直接引入的包或创建的请求实例都是一个函数，调用该函数即可发起请求。

```js
// 通过引入的包调用发起请求
import ajax from 'uni-ajax'
ajax()

// 通过创建的请求实例发起请求
const instance = ajax.create()
instance()
```

该函数接收两种参数类型，返回都是 Promise。你可根据自己的实际情况使用。

```js
/**
 * @param {object} config 无回调属性的请求配置对象
 * @returns {Promise.resolve} 响应成功对象
 * @returns {Promise.reject} 请求或响应失败对象
 */
ajax(config)

/**
 * @param {string} url 请求地址
 * @param {string|object} data 请求参数
 * @param {object} config 无回调属性的请求配置对象
 * @returns {Promise.resolve} 响应成功对象
 * @returns {Promise.reject} 请求或响应失败对象
 */
ajax(url, data, config)
```

::: details 传入回调属性参数 <Badge type="danger" text="2.5.0" />
你也可以传入回调属性参数，但该方式使用率较低，所以在 `2.5.0` 版本已弃用。

```js
/**
 * @param {object} config 含回调属性 (至少传入一个 success / fail / complete 参数) 的请求配置对象
 * @returns {Promise.resolve} undefined
 * @returns {Promise.reject} 无
 */
ajax(config)
```
:::

为了方便起见，已经为所有支持的请求方法提供了别名。并且调用这些方法的参数跟上面一样，但不同的是在方法别名中传入的 `method` 是无效的。

```js
ajax.get()
ajax.post()
ajax.put()
ajax.delete()
```

## 请求配置

上面的请求方法提到了 `请求配置对象`，那么这个对象里有什么属性呢？你可以通过下面文档查看详细内容。

参考：[请求配置](/api/config)

## 响应结构

请求的响应包含以下信息。

| 参数       | 类型                          | 说明                                   |
| :--------- | :---------------------------- | :------------------------------------- |
| data       | Object / String / ArrayBuffer | 服务器返回的数据                       |
| statusCode | Number                        | 服务器响应的 HTTP 状态码               |
| header     | Object                        | 服务器响应的头                         |
| config     | Object                        | 请求提供的配置信息                     |
| cookies    | Array\<string\>               | 服务器返回的 cookies，格式为字符串数组 |

## RequestTask

网络请求任务对象。

| 方法               | 说明                                                                              |
| :----------------- | :-------------------------------------------------------------------------------- |
| abort              | 中断请求任务                                                                      |
| onHeadersReceived  | 监听 HTTP Response Header 事件。会比请求完成事件更早，仅 [微信小程序平台][1] 支持 |
| offHeadersReceived | 取消监听 HTTP Response Header 事件，仅 [微信小程序平台][2] 支持                   |

::: details 请求方法调用或通过 xhr 获取：<Badge type="danger" text="2.5.0" />

直接调用。这里 request 接收的是封装后的 Promise，并支持 RequestTask 的以上方法。但实际并非真正的 RequestTask 对象。只是封装继承 Promise 并挂载 RequestTask 的同名方法。

```js
const request = ajax('https://www.example.com/api/demo')
request.abort()
```

获取 RequestTask 对象调用。通过参数请求选项的 xhr 回调参数也可以获取 RequestTask 对象。

```js
ajax({
  url: 'https://www.example.com/api/demo',
  xhr: (requestTask, config) => {
    requestTask.abort()
  }
})
```
:::

可以通过 [Fetcher](/api/#fetcher) 抓取器实例来获取 `RequestTask`。<Badge text="2.5.0" />

```js
import ajax, { Fetcher } from 'uni-ajax'

const fetcher = new Fetcher()
ajax({ fetcher })

fetcher.abort() // 中断请求（Fetcher 只封装了 abort 方法，其他请使用 source 获取使用）
const requestTask = await fetcher.source() // 获取请求任务对象
```

## 取消请求

在 uni-ajax 里实现取消请求是很简单的。上面的 RequestTask 示例中就是实现的取消请求。

[1]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.onHeadersReceived.html
[2]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.offHeadersReceived.html
