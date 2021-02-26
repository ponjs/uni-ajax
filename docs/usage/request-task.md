# RequestTask

网络请求任务对象

| 方法               | 说明                                                                            |
| :----------------- | :------------------------------------------------------------------------------ |
| abort              | 中断请求任务                                                                    |
| onHeadersReceived  | 监听 HTTP Response Header 事件。会比请求完成事件更早，仅[微信小程序平台][1]支持 |
| offHeadersReceived | 取消监听 HTTP Response Header 事件，仅[微信小程序平台][2]支持                   |

如果您想使用`RequestTask`上的方法，有下面三种方式：

- **直接调用 <Badge text="2.1.0"/>**

这里`request`接收的是封装后的`Promise`，并支持`RequestTask`的以上方法。但实际并非真正的`RequestTask`对象。只是封装继承`Promise`并挂载`RequestTask`的同名方法。

```JavaScript
const request = ajax('https://www.example.com')

request.abort()
```

- **获取`RequestTask`对象调用 ①**

获取`RequestTask`对象，需传参为`config`一个对象，且`config`至少传入`success / fail / complete`参数中的一个，然后接收`Promise.resolve`的返回值。

```JavaScript
const requestTask = await ajax({
  url: 'https://www.example.com',
  complete: () => {}
})

requestTask.abort()
```

- **获取`RequestTask`对象调用 ② <Badge text="2.2.4"/>**

通过参数请求选项的`xhr`属性也可以获取`RequestTask`对象。

```JavaScript
ajax({
  url: 'https://www.example.com',
  xhr: (requestTask, config) => {
    requestTask.abort()
  }
})
```

[1]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.onHeadersReceived.html
[2]: https://developers.weixin.qq.com/miniprogram/dev/api/RequestTask.offHeadersReceived.html
