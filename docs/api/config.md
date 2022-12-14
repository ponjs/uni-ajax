# 请求配置

## baseURL

请求根地址。自动拼接在 url 前面，除非 url 是一个绝对地址 (http 或 https 开头)。

- 类型：`String`

- 示例：

  ```js
  // 创建实例
  const instance = ajax.create({ baseURL: 'https://www.example.com/api' })

  // 发起请求，最终发起请求的 url 为 https://www.example.com/api/demo
  instance('demo')

  // url 为绝对地址时则忽略 baseURL，最终发起请求的 url 为 https://www.uniajax.com/api/test
  instance('https://www.uniajax.com/api/test')
  ```

## url

开发者服务器接口地址。可以是绝对地址或基于根地址的路径。

- 类型：`String`

## data

请求的参数。

- 类型：`Object | String | ArrayBuffer`

- 平台差异：App（自定义组件编译模式）不支持 ArrayBuffer 类型

- 数据说明：最终发送给服务器的数据是 String 类型，如果传入的 data 不是 String 类型，会被转换成 String。转换规则如下：

  - 对于 `GET` 方法，会将数据转换为 `query string`。例如 `{ name: 'name', age: 18 }` 转换后的结果是 `name=name&age=18`。
  - 对于 `POST` 方法且 `header['content-type']` 为 `application/json` 的数据，会进行 JSON 序列化。
  - 对于 `POST` 方法且 `header['content-type']` 为 `application/x-www-form-urlencoded` 的数据，会将数据转换为 query string。

## header

请求头。 header 中不能设置 Referer。这里的 header 也可以为不同请求方式添加对应的请求头（注意这里的请求方式属性要小写），以及 common 公共请求头属性。header 不仅可以在创建实例配置中，也可以在请求拦截器中修改配置。

- 类型：`Object`

- 平台差异：App、H5 端会自动带上 cookie，且 H5 端不可手动修改

- 示例：

  ```js
  /**
   * 关于 header 的优先级，在下面的例子中，假如请求头为 prior ，这里数值越大表示优先级越高
   *
   * 拦截器 > 请求方法 > 实例配置
   * 请求头属性 > 请求方式属性 > 公共属性
   */

  // 创建实例
  const instance = ajax.create({
    header: {
      prior: 7,
      get: { prior: 4 },
      common: { prior: 1 }
    }
  })

  // 请求拦截器
  instance.interceptors.request.use(config => {
    config.header.common['prior'] = 3
    config.header.get['prior'] = 6
    config.header['prior'] = 9
    return config
  })

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

## method

请求方式。在实例中配置可定义 `ajax()` 方法在没有传入指定的 method 的情况下的请求方式。

- 类型：`String`

- 默认值：GET

- 示例：

  ```js
  // 创建实例
  const instance = ajax.create({ method: 'post' })

  // 发起请求
  instance()  // 这里没有传入指定的 method，则以默认配置的 method，这里即 POST
  ```

## query

URL 的 query 参数。会将数据转换为 query string 拼接在 URL 上。

- 类型：`Object`

- 示例：

  ```js
  // 最终发起请求的地址为 https://www.example.com/api/demo?timestamp=1590832951672
  ajax({
    url: 'https://www.example.com/api/demo',
    query: { timestamp: 1590832951672 }
  })
  ```

## params

URL 的 params 参数。会替换掉 URL 上的 params 字段。

- 类型：`Object`

- 示例：

  ```js
  // 最终发起请求的地址为 https://www.example.com/api/demo/text
  ajax({
    url: 'https://www.example.com/api/demo/:type',
    params: { type: 'text' }
  })
  ```

## timeout

超时时间。单位 ms。

- 类型：`Number`

- 默认值：60000

- 平台差异：H5(HBuilderX 2.9.9+)、APP(HBuilderX 2.9.9+)、微信小程序(2.10.0)、支付宝小程序

## dataType

返回数据类型。如果设为 json，会尝试对返回的数据做一次 JSON.parse。

- 类型：`String`

- 默认值：json

## responseType

响应的数据类型。

- 类型：`'text' ｜ 'arraybuffer'`

- 默认值：text

- 平台差异：支付宝小程序不支持

## sslVerify

是否验证 ssl 证书。

- 类型：`Boolean`

- 默认值：true

- 平台差异：仅 App 安卓端支持（HBuilderX 2.3.3+）

## withCredentials

跨域请求时是否携带凭证（cookies）。

- 类型：`Boolean`

- 默认值：false

- 平台差异：仅 H5 支持（HBuilderX 2.6.15+）

## firstIpv4

DNS 解析时优先使用 ipv4。

- 类型：`Boolean`

- 默认值：false

- 平台差异：仅 App-Android 支持 (HBuilderX 2.8.0+)

## validateStatus

定义对于给定的 HTTP 状态码返回拦截状态。如果 validateStatus 返回 true（或者设置为 null），响应数据会进到响应拦截器的 onFulfilled ，否则进到 onRejected。

- 类型：`Function`

- 默认值：`statusCode => statusCode >= 200 && statusCode < 300`

- 示例：

  ```js
  // 创建实例
  const instance = ajax.create({
    // statusCode 的值为 HTTP 状态码，类型为 number / undefined
    // 当 statusCode 为 undefined 时可能为中断请求、无网络、等等其它服务端没响应的情况
    validateStatus: statusCode => statusCode >= 200 && statusCode < 300  // 默认
  })
  ```

## xhr

获取每次请求的 RequestTask 对象。<Badge type="danger">2.5.0 废弃</Badge>

- 类型：`Function`

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

## fetcher

该属性需要传递抓取器实例，请求方法内部会获取 RequestTask。<Badge>2.5.0</Badge>

- 类型: `FetcherInstance`

- 示例：

  ```js
  import ajax, { Fetcher } from 'uni-ajax'

  const fetcher = new Fetcher()
  ajax({ fetcher })
  fetcher.source()
  ```

## adapter

自定义处理请求。通过该属性可自定义请求方法，有着较强的可扩展性，一旦修改则替换默认的请求方法。该属性类型为函数类型，需返回一个 Promise（参见源码 [`/lib/adapters/http.js`](https://github.com/ponjs/uni-ajax/blob/dev/lib/adapters/http.js) ）。该函数有一个参数 config 每次请求的请求配置。

- 类型：`Function`

- 默认值：`config => new Promise(/*...*/)`

- 示例：

  ```js
  // 新增上传方法
  const instance = ajax.create({
    /*...*/
    adapter(config) {
      if (config.method === 'UPLOAD') {
        return new Promise((resolve, reject) => {
          const uploadTask = uni.uploadFile({
            ...config,
            complete: result => {
              const response = { config, ...result }
              !config.validateStatus || config.validateStatus(result.statusCode)
                ? resolve(response)
                : reject(response)
            }
          })

          config.fetcher?.resolve(uploadTask)
        })
      }

      return ajax.defaults.adapter(config)
    }
  })

  const fetcher = new Fetcher()
  fetcher.source().then(uploadTask => {/***/})

  instance({
    method: 'UPLOAD',
    url: '/upload',
    name: 'file',
    filePath,
    fetcher
  })
  ```

## success

收到服务器成功返回的回调函数。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger">2.5.0 废弃</Badge>

- 类型：`Function`

- 参数：请求成功对象

## fail

接口调用失败的回调函数。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger">2.5.0 废弃</Badge>

- 类型：`Function`

- 参数：请求失败对象

## complete

接口调用结束的回调函数（调用成功、失败都会执行）。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger">2.5.0 废弃</Badge>

- 类型：`Function`

- 参数：请求成功/失败对象

## (more) ...

传递给拦截器的值。除了上面那些属性外，你可以定义自己属性，用于在请求方法上传递给拦截器。

- 类型：`Any`

- 示例：

  ```js
  // 发起请求
  ajax({
    url: 'https://www.example.com/api/demo',
    ajax: 'hello ajax'  // 传递给拦截器的值
  })

  // 请求拦截器
  ajax.interceptors.request.use(config => {
    console.log(config.ajax)      // 'hello ajax' 请求时传递给拦截器的值
    config.world = 'hello world'  // 请求拦截器传值到响应拦截器
    return config
  })

  // 响应拦截器
  ajax.interceptors.response.use(response => {
    console.log(response.config.ajax)   // 'hello ajax'  请求时传递给拦截器的值
    console.log(response.config.world)  // 'hello world' 请求拦截器传到响应拦截器的值
    return response
  })
  ```
