# 创建和配置

在项目开发中，我们的接口地址是通常是同个根地址，我们需要配置接口根地址方便代码的维护。而且我们对于请求和响应的都会做同样的判断，这里就可以用到拦截器，避免冗余的代码。

## 创建实例

首先我们先新建`ajax.js`文件，用于配置项及拦截器。

`ajax.create([config])`

```JavaScript
// 引入 uni-ajax 模块
import ajax from 'uni-ajax'

// 创建实例
const instance = ajax.create({
  // 默认配置（配置参数如下）
})

// 导出创建后的实例
export default instance
```

## 实例配置

`config`是一个对象，该对象的参数如下。

| 参数                | 类型     | 默认值                                             | 说明                                                | 平台差异说明                                     |
| :------------------ | :------- | :------------------------------------------------- | :-------------------------------------------------- | :----------------------------------------------- |
| [baseURL][1]        | String   |                                                    | 请求根地址                                          |                                                  |
| [data][2]           | Object   |                                                    | 请求的参数，当类型为 object 时会合并在请求时的 data | App（自定义组件编译模式）不支持 ArrayBuffer 类型 |
| [header][3]         | Object   |                                                    | 请求头，支持配置不同请求方式的请求头                | H5 端会自动带上 cookie 不可手动覆盖              |
| [method][4]         | String   | GET                                                | ajax() 默认的请求方式                               |
| timeout             | Number   | 30000                                              | 超时时间，单位 ms                                   | 微信小程序（2.10.0）、支付宝小程序               |
| dataType            | String   | json                                               | 如果设为 json，会尝试对返回的数据做一次 JSON.parse  |
| responseType        | String   | text                                               | 设置响应的数据类型。合法值：text、arraybuffer       | App 和支付宝小程序不支持                         |
| sslVerify           | Boolean  | true                                               | 验证 ssl 证书                                       | 仅 App 安卓端支持（HBuilderX 2.3.3+）            |
| withCredentials     | Boolean  | false                                              | 跨域请求时是否携带凭证（cookies）                   | 仅 H5 支持（HBuilderX 2.6.15+）                  |
| firstIpv4           | Boolean  | false                                              | DNS 解析时优先使用 ipv4                             | 仅 App-Android 支持 (HBuilderX 2.8.0+)           |
| [validateStatus][5] | Function | <span style="white-space:nowrap">[200, 300)</span> | 定义对于给定的 HTTP 状态码返回拦截状态              |                                                  |
| [...][6]            | Any      |                                                    | 传递给拦截器的值                                    |                                                  |

### `baseURL`

请求根地址`baseURL`将自动加在`url`前面，除非`url`是一个绝对 URL (http 或 https 开头)。

```JavaScript
// 创建实例
const instance = ajax.create({ baseURL: 'https://www.example.com' })

// 发起请求，最终发起请求的 url 为 https://www.example.com/api
instance('api')
```

### `data`

请求的参数如果是 `object` 类型会合并在请求时的 `data`。

```JavaScript
// 创建实例
const instance = ajax.create({
  data: { hello: 'hello' }
})

// 发起请求
instance('api', { ajax: 'ajax' })

// 最终发起请求的 data
// 如果发起请求时的字段是与默认配置的字段相同，则采用发起请求时的值
{
  hello: 'hello',
  ajax: 'ajax'
}
```

### `header`

这里的`header`也可以为不同请求方式添加对应的请求头（注意这里的请求方式属性要小写），以及`common`公共请求头属性。`header`不仅可以在创建实例配置中，也可以在请求拦截器中配置，一般来说固定的请求头放在创建实例配置中，动态请求头放在请求拦截器中。

```JavaScript
// 创建实例
const instance = ajax.create({
  header: {
    post: { 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8' }
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    config.header.post['Authorization'] = uni.getStorageSync('TOKEN')
    return config
  }
)
```

关于`header`的优先级，在下面的例子中，假如请求头为`prior`，数值越大表示优先级越高。

::: tip
拦截器 > 请求方法 > 实例配置  
请求头属性 > 请求方式属性 > 公共属性
:::

```JavaScript
// 创建实例
const instance = ajax.create({
  header: {
    prior: 7,
    get: { prior: 4 },
    common: { prior: 1 }
  }
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    config.header.common['prior'] = 3
    config.header.get['prior'] = 6
    config.header['prior'] = 9
    return config
  }
)

// 请求方法
instance({
  method: 'GET',
  header: {
    prior: 8,
    get: { prior: 5 },
    common: { prior: 2 }
  }
})
```

### `method`

当请求方法为`ajax()`常规方法时，如果没有传入指定的`method`，这时的请求方式为默认配置的`method`或`GET`，并且无论是在配置中还是请求中大小写都不受限。

```JavaScript
// 创建实例
const instance = ajax.create({ method: 'post' })

// 发起请求
instance()    // 这里没有传入指定的 method，则以默认配置的 method，这里即 POST
```

### `validateStatus`

定义对于给定的 HTTP 状态码返回拦截状态。如果`validateStatus`返回`true`（或者设置为`null`），响应数据会进到[响应拦截器](/instance/interceptor.html#响应拦截器)的`onFulfilled`，否则进到`onRejected`。

```JavaScript
// 创建实例
const instance = ajax.create({
  // statusCode 的值为 HTTP 状态码，类型为 number / undefined
  // 当 statusCode 为 undefined 时可能为中断请求、无网络、等等其它服务端没响应的情况
  validateStatus: statusCode => statusCode >= 200 && statusCode < 300    // 默认
})
```

[1]: /instance/create.html#baseurl
[2]: /instance/create.html#data
[3]: /instance/create.html#header
[4]: /instance/create.html#method
[5]: /instance/create.html#validatestatus
[6]: /instance/interceptor.html#传值给拦截器
