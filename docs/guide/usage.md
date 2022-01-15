---
title: 使用方法
order: 3
toc: menu
---

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

该函数接收三种参数类型，返回都是 Promise。你可根据自己的实际情况使用。

```js
/**
 * @param {object} config 无回调属性的请求配置对象
 * @returns {resolve} 响应成功对象
 * @returns {reject} 请求或响应失败对象
 */
ajax(config)

/**
 * @param {object} config 含回调属性 (传入 success / fail / complete 参数中的一个) 的请求配置对象
 * @returns {resolve} undefined
 * @returns {reject} 无
 */
ajax(config)

/**
 * @param {string} url 请求地址
 * @param {string|object} data 请求参数
 * @param {object} config 无回调属性的请求配置对象
 * @returns {resolve} 响应成功对象
 * @returns {reject} 请求或响应失败对象
 */
ajax(url, data, config)
```

为了方便起见，已经为所有支持的请求方法提供了别名。并且调用这些方法的参数跟上面一样，但不同的是在方法别名中传入的 `method` 是无效的。

```js
ajax.get()
ajax.post()
ajax.put()
ajax.delete()
```

## 请求配置

上面的请求方法提到了 `请求配置对象`，那么这个对象里有什么属性呢？你可以通过该[文档](/api/config)查看详情内容。

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

如果您想使用 RequestTask 上的方法，有下面两种方式：

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

## 取消请求

在 uni-ajax 里实现取消请求是很简单的。上面的 RequestTask 示例中就是通过这两种方式来实现取消请求。

[1]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.onHeadersReceived.html
[2]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.offHeadersReceived.html
