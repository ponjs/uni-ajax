# 请求配置

这里 uni-ajax 的请求配置与 uni.request 一致，下面这些配置项为 uni-ajax 所用到的，其他配置项请参考 [uni.request](https://uniapp.dcloud.net.cn/api/request/request.html)。

如果你使用的 TypeScript 的话可能出现属性没定义的提示，那是因为该属性为 uni.request 后续新增的，你可以通过 [CustomConfig](/guide/typescript#定义类型) 来拓展它。

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

## query

URL 的 query 参数。会将数据转换为 query string 拼接在 URL 上。<Badge text="2.4.2" />

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

URL 的 params 参数。会替换掉 URL 上声明的 params 字段。<Badge type="warning" text="2.4.2" />

- 类型：`Object`

- 数据说明：在 2.4.2 前面版本，params 属性作用是将数据转换为 query string 拼接在 URL 上，即上面的 `query` 一致。但 2.4.2 更新后做了兼容处理，当你传了 params 属性并且 url 上没有 `/:xxx` 参数字段声明时，则按照 `query` 处理。

- 示例：

  ```js
  // 最终发起请求的地址为 https://www.example.com/api/demo/text
  ajax({
    url: 'https://www.example.com/api/demo/:type',
    params: { type: 'text' }
  })
  ```

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

获取每次请求的 RequestTask 对象。<Badge type="danger" text="2.5.0" />

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

该属性需要传递[抓取器实例](/api/#fetcher)，请求方法内部会获取 RequestTask。<Badge text="2.5.0" />

- 类型: `FetcherInstance`

- 示例：

  ```js
  import ajax, { Fetcher } from 'uni-ajax'

  const fetcher = new Fetcher()
  ajax({ fetcher })
  fetcher.source()
  ```

## adapter

自定义处理请求。通过该属性可自定义请求方法，有着较强的可扩展性，一旦修改则替换默认的请求方法。该属性类型为函数类型，需返回一个 Promise（参见源码 [`/lib/adapters/http.js`](https://github.com/ponjs/uni-ajax/blob/dev/lib/adapters/http.js) ）。该函数有一个参数 config 每次请求的请求配置。<Badge text="2.3.0" />

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

  // 建议根据实际情况封成上传方法调用
  export const upload = config =>
    instance({ name: 'file', ...config, method: 'UPLOAD' })

  // 可以传入 fetcher 以获取 uploadTask
  const fetcher = new Fetcher()
  fetcher.source().then(uploadTask => {/***/})

  upload({ url: '/upload', filePath, fetcher })
  ```

## success

收到服务器成功返回的回调函数。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger" text="2.5.0" />

- 类型：`Function`

- 参数：请求成功对象

## fail

接口调用失败的回调函数。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger" text="2.5.0" />

- 类型：`Function`

- 参数：请求失败对象

## complete

接口调用结束的回调函数（调用成功、失败都会执行）。**该属性无法在实例配置上定义，只能在请求方法上。**<Badge type="danger" text="2.5.0" />

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
