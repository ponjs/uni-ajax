# API

::: tip
参数用 `[]` 包裹表示为可选参数。
:::

## 实例方法

```Javascript
const instance = ajax.create([config])    // 创建实例

instance.interceptors.request.use([onFulfilled[, onRejected]])     // 添加请求拦截器
instance.interceptors.response.use([onFulfilled[, onRejected]])    // 添加响应拦截器

instance.interceptors.request.eject(id)     // 移除请求拦截器（2.3.0 新增）
instance.interceptors.response.eject(id)    // 移除响应拦截器（2.3.0 新增）
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
const request = ajax()                  // 请求常规方法和请求方法别名都可以

request.abort()                         // 中断请求任务
request.onHeadersReceived(callback)     // 监听 HTTP Response Header 事件
request.offHeadersReceived(callback)    // 取消监听 HTTP Response Header 事件
```

## 修改实例配置 <Badge text="2.2.6"/> <Badge type="error" text="3.0.0 非兼容" />

```JavaScript
/**
 * ajax.config 为一个异步函数，需注意：
 * 如果创建实例是函数配置，则该 config 参数是一个异步函数，返回也要是一个函数；
 * 反之如果是对象配置，该 config 参数是一个配置对象，返回也要是一个对象。
 */
ajax.config(config => {
  /* ... */
  return config
})
```

## 默认配置 <Badge text="3.0.0"/>

全局默认值，修改 `defaults` 上的属性。

```JavaScript
// 可对 defaults 上的属性进行修改
ajax.defaults.baseURL = baseURL
// ❌ 不能直接赋值
ajax.defaults = { baseURL }
```

实例默认值，修改 `config` 。上面的[修改实例配置](/usage/api.html#修改实例配置)在 3.x 起改为下面这种方式，使其更加直接。

```JavaScript
// 当实例配置为对象类型时可直接修改对象上的属性。取决于您在创建实例的类型，但后续可通过下面的方式修改
ajax.config.baseURL = baseURL
// 与 defaults 不同的是，config 是可以直接赋值的，且赋值类型可以为对象或函数
ajax.config = { baseURL }
ajax.config = () => ({ baseURL })
```

## 其他属性 <Badge type="warning" text="3.0.0 移除" />

```JavaScript
ajax.baseURL    // 获取配置的接口根地址 baseURL
ajax.origin     // 根据配置的接口根地址获取源地址 origin
```
