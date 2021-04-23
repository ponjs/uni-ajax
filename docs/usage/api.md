# API

## 实例方法

```Javascript
// 创建实例
const instance = ajax.create([config])

// 注册请求拦截器
instance.interceptors.request.use([onFulfilled[, onRejected]])

// 注册响应拦截器
instance.interceptors.response.use([onFulfilled[, onRejected]])
```

## 请求方法

```JavaScript
// 常规方法
ajax()

// 请求方法别名
ajax.get()
ajax.post()
ajax.put()
ajax.delete()

// 常规方法和请求方法别名参数有：
// [config] 或 [url[, data[, config]]]
```

## RequestTask <Badge text="2.1.0"/>

```JavaScript
const request = ajax()                  // 请求方法每项皆可

request.abort()                         // 中断请求任务
request.onHeadersReceived(callback)     // 监听 HTTP Response Header 事件
request.offHeadersReceived(callback)    // 取消监听 HTTP Response Header 事件
```

## 修改实例配置 <Badge text="2.2.4"/>

```JavaScript
/**
 * 在 2.2.6 版本起 ajax.config 为一个异步函数，需注意：
 * 如果创建实例是函数配置，则该 config 参数是一个异步函数，返回也要是一个函数；
 * 反之如果是对象配置，该 config 参数是一个配置对象，返回也要是一个对象。
 */
ajax.config(config => {
  /* ... */
  return config
})
```

## 其他属性

```JavaScript
ajax.baseURL    // 获取配置的接口根地址 baseURL
ajax.origin     // 根据配置的接口根地址获取源地址 origin
```

---

::: tip
参数用 `[]` 包裹表示为可选参数。
:::
