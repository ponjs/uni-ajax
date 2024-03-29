# 请求方法

## 发起请求

我们直接引入的包或创建的请求实例都是一个函数，调用该函数即可发起请求，并且函数上挂载了一些属性和方法。

::: details 类型: `Function`
```ts
<T = any, R = AjaxResult<T>>(config?: AjaxRequestConfig) => Request<R>
<T = any, R = AjaxResult<T>>(url?: string, data?: Data, config?: AjaxRequestConfig) => Request<R>
```
:::

```js
// 通过引入的包调用发起请求
import ajax from 'uni-ajax'
ajax()

// 通过创建的请求实例发起请求
const instance = ajax.create()
instance()
```

```js
// Promise 传入配置对象的方式
ajax({
  url: 'https://www.example.com/api/demo',
  data: { value: 'ajax' },
  header: { token: 'c275bdb5be55e7c2' }
}).then(res => {
  console.log(res)
})

// Promise 传入 [url, data, config] 的方式
ajax(
  'https://www.example.com/api/demo',
  { value: 'ajax' },
  {
    header: { token: 'c275bdb5be55e7c2' }
  }
).then(res => {
  console.log(res)
})
```

::: details 传入回调属性参数 <Badge type="danger" text="2.5.0" />
类型: `Function`
```ts
<T = any, R = AjaxResult<T>>(config?: AjaxCallbackConfig<R>) => Request<void>
```

示例：
```js
// 传入含回调函数配置对象的方式
ajax({
  url: 'https://www.example.com/api/demo',
  data: { value: 'ajax' },
  header: { token: 'c275bdb5be55e7c2' },
  success: res => {
    console.log(res)
  }
})
```
:::

## 请求方式别名

为了方便起见，已经为所有支持的请求方法提供了别名。并且调用这些方法的参数跟上面一样，但不同的是在方法别名中传入的 `method` 是无效的。

- `ajax.get`
- `ajax.post`
- `ajax.put`
- `ajax.delete`

```js
ajax.post({ url: '/demo' }) // 等同于 ajax({ url: '/demo', method: 'post' })
```

## create

用于创建请求实例，该方法参数可以为一个配置对象的静态配置或一个返回配置对象的函数动态配置。如果是函数的话是支持 Promise 异步的。

::: details 类型: `Function`
```ts
<T extends AjaxConfigType = void>(config?: T) => AjaxInstance<T>
```
:::

```js
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})

const instance = ajax.create(() => ({
  baseURL: 'https://www.example.com/api'
}))
```

## config

用于获取实例的配置。该属性的类型取决于你创建实例 [create](/api/#create) 的参数类型。**注意该属性是只读的。**<Badge text="2.4.1" />

::: details 类型：`Object | Function | undefined`
```ts
type AjaxConfigType =
  | AjaxRequestConfig
  | (() => AjaxRequestConfig)
  | (() => Promise<AjaxRequestConfig>)
  | void
```
:::

```js
// 假设你创建请求实例时是对象类型
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})
instance.config.baseURL  // 直接获取对象实例配置 baseURL

// 假设你创建请求实例时是函数类型
const instance = ajax.create(() => ({
  baseURL: 'https://www.example.com/api'
}))
instance.config().baseURL  // 调用函数实例配置获取 baseURL

// 假设你创建请求实例时是异步函数类型
const instance = ajax.create(async () => ({
  baseURL: 'https://www.example.com/api'
}))
;(await instance.config()).baseURL  // 调用异步函数实例配置获取 baseURL
```

## defaults

全局默认配置。你的应用中无论你创建多少个请求实例，都是共享着这个全局默认配置。<Badge text="2.4.1" />

::: details 类型：`Object`
```ts
interface AjaxRequestConfig extends CustomConfig {
  baseURL?: string
  /*...*/
}
```
:::

::: details 默认值
```js
{
  adapter: config => {/*...*/},
  method: 'GET',
  header: {
    common: {},
    get: {},
    post: {},
    put: {},
    delete: {}
  },
  validateStatus: statusCode => statusCode >= 200 && statusCode < 300
}
```
:::

```js
// 可对 defaults 上的属性进行修改
ajax.defaults.baseURL = 'https://www.example.com/api'
// ❌ 但不能直接赋值
ajax.defaults = { baseURL: 'https://www.example.com/api' }
```

## getURL

根据当前实例获取请求地址。你可以传递一个带有 `baseURL`, `url`, `params`, `query` 这些属性的一个对象或返回该对象的函数，然后根据这些属性生成最终请求地址。<Badge text="2.4.1" />

::: details 类型：`Function`
```ts
(config?: AjaxConfigType) => Promise<string>
```
:::

```js
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})

instance
  .getURL({
    url: 'demo/:type',
    params: { type: 'text' },
    query: { timestamp: 1590832951672 }
  })
  .then(url => {
    console.log(url)  // https://www.example.com/api/demo/text?timestamp=1590832951672
  })
```

## interceptors

拦截器简单点说就是拦截每一次你的请求和响应，然后进行相应的处理。所以可分为`请求拦截器`和`响应拦截器`，并且这两种拦截器上都有 `use` 和 `eject` 这两个方法。

::: details 类型：`Object`
```ts
interceptors: {
  request: AjaxInterceptorManager<AjaxRequestConfig>
  response: AjaxInterceptorManager<AjaxResponse>
}

interface AjaxInterceptorManager<V> {
  use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number
  eject(id: number): void
}
```
:::

### use

使用拦截器。接受两个参数，且这两个参数都是函数类型，并且支持异步。前一个函数参数表示发起请求前/响应成功后，后一个函数参数表示请求前错误/响应失败后。你可以创建多个拦截器，并且执行顺序根据你创建的顺序。

**后一个函数参数必须返回 `Promise.reject` 才能触发 `catch` 请求失败事件。**<Badge type="warning" text="2.3.0" />

::: details 类型：`Function`
```ts
<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any) => number
```
:::

```js
// 添加请求拦截器
ajax.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
ajax.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    return response
  },
  error => {
    // 对响应错误做些什么
    return Promise.reject(error)
  }
)
```

### eject

移除拦截器。上面我们通过 `use` 可以创建多个拦截器，如果你稍后需要移除拦截器，可以通过该方法移除。<Badge text="2.3.0" />

::: details 类型：`Function`
```ts
(id: number) => void
```
:::

```js
const myInterceptor = ajax.interceptors.request.use(() => {/*...*/})
ajax.interceptors.request.eject(myInterceptor)
```

## Fetcher

抓取器构造函数。是一个工具构造函数，不含请求相关代码，其内部原理为 Promise 的异处调用。在 `uni-ajax` 中通过 [fetcher](/api/config#fetcher) 属性内部会获取 RequestTask。<Badge text="2.5.0" />

::: details 类型：`Class`
```ts
interface FetcherConstructor {
  new <T = RequestTask>(): FetcherInstance<T>
}

interface FetcherInstance<T = any> {
  resolve: (value: T) => void
  reject: (reason?: any) => void
  source: () => Promise<T>
  abort: () => Promise<void>
}
```
:::

```js
import { Fetcher } from 'uni-ajax'

const fetcher = new Fetcher()
```
