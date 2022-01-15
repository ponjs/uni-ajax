---
title: 请求实例
order: 4
toc: menu
---

## 创建实例

`ajax.create(config)`

在实际项目开发中，我们的接口地址是通常是同个根地址，我们需要配置接口根地址方便代码的维护。而且我们对于请求和响应的都会做同样的判断，这里就可以用到拦截器，避免冗余的代码。

首先我们先新建 ajax.js 文件（文件名可自定义），用于配置项及拦截器。

```js
// 引入 uni-ajax 模块
import ajax from 'uni-ajax'

// 创建实例
const instance = ajax.create({
  // 实例初始配置（对象配置）
})

// 导出创建后的实例
export default instance
```

### 对象配置

我们在创建实例时可以传递一个对象，该对象为请求实例的初始默认配置。该配置与我们在[请求方法](/guide/usage#请求配置)时传递的请求配置是一致的。你可以通过该[文档](/api/config)查看详情内容。

```js
// 创建实例
const instance = ajax.create({
  /* 实例初始配置 */
})
```

### 函数配置

当创建实例传入的是一个函数时，并且该函数需返回上面的配置对象。每次请求前都会执行该函数（在请求拦截器之前），然后将执行后返回值传递给请求拦截器。这里的函数参数支持 async / await 操作。

```js
// 创建实例
const instance = ajax.create(() => {
  return {
    /* 实例初始配置 */
  }
})
```

## 默认配置

在 uni-ajax 中可以获取公用的请求配置。可分为全局配置和实例配置。

### 全局配置

`ajax.defaults`

我们上面的创建的请求实例，在应用中可以创建多个，但是它们都是共享着这个全局默认配置。在这个配置中的修改会应用到每个请求实例，但如果你的实例中配置了同样的属性，uni-ajx 取的是实例中属性。

```js
// 可对 defaults 上的属性进行修改
ajax.defaults.baseURL = 'https://www.example.com/api'
// ❌ 但不能直接赋值
ajax.defaults = { baseURL: 'https://www.example.com/api' }
```

### 实例配置

`instance.config`

该属性是获取我们创建实例时所传递的实例配置。如果你在创建实例时传递的对象那么它就是对象类型，反之如果是传递的是函数则它函数类型，与你所创建时的配置相对应。要注意的是它是只读的，你不可对修改。

```js
// 假设你创建请求实例时是对象类型
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})
instance.config.baseURL // 直接获取对象实例配置 baseURL

// 假设你创建请求实例时是函数类型
const instance = ajax.create(() => ({
  baseURL: 'https://www.example.com/api'
}))
instance.config().baseURL // 调用函数实例配置获取 baseURL

// 假设你创建请求实例时是异步函数类型
const instance = ajax.create(async () => ({
  baseURL: 'https://www.example.com/api'
}))
;(await instance.config()).baseURL // 调用异步函数实例配置获取 baseURL
```

## 拦截器

`ajax.interceptors[state].use(onFulfilled, onRejected)`

拦截器简单点说就是拦截每一次你的请求和响应，然后进行相应的处理，之后再进到 then / catch 。前面说到如何创建实例，这里是在创建实例后的基础上加入拦截器，拦截器有请求拦截和响应拦截。

在创建拦截器我们可以传入两个参数 `onFulfilled` 和 `onRejected`，一是成功事件拦截处理，需返回对应的数据下一步才能接收到；二是错误事件拦截处理，注意的是必须返回 Promise.reject 才能触发 fail / catch ，否则都是触发 success / then 。

### 请求拦截器

请求拦截器是在发送请求前的处理，接收到 config 值是你在发起请求传递到配置和实例配置再加全局配置所合并的对象。

```js
// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)
```

- 示例：判断是否有 Token 有的话请求头加入 Token。

```js
instance.interceptors.request.use(config => {
  const token = uni.getStorageSync('TOKEN')
  token && (config.header['Authorization'] = token)
  return config
})
```

#### 拒绝发送请求

如果你想在请求拦截器中中断请求，则只返回 Promise.reject 即可。中断请求后会触发请求错误事件，即会触发 fail / catch 。

```js
// 请求拦截器
instance.interceptors.request.use(config => {
  // 拒绝请求
  return Promise.reject({
    config,
    errMsg: 'request:fail intercepted'
  })
})

// 发起请求
instance().catch(err => {
  console.log(err.errMsg)
})
```

### 响应拦截器

当服务器返回的 HTTP 状态码为 `[200, 300)` 时会到响应成功方法里，否则到响应错误。当然这个状态码验证是可通过 [validateStatus](/api/config#validatestatus) 修改。

```js
// 添加响应拦截器
instance.interceptors.response.use(
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

- 示例：当接口返回的 code 值不为 1 时 toast 提示返回的 msg 信息。

```js
nstance.interceptors.response.use(response => {
  if (response.data.code !== 1) {
    uni.showToast({
      title: response.data.msg,
      icon: 'none'
    })
  }
  return response
})
```

#### 拒绝响应成功

如果你在响应成功方法里返回 Promise.reject，请求接口时则会执行 fail / catch。

```js
// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.data.code !== 1) {
      /* ... */
      return Promise.reject(response)
    }
    return response
  }
)

// 请求
instance()
  .then(res => {
    // 响应成功且code值为1
  })
  .catch(err => {
    // 响应错误 或 响应成功且code值不为1
  })
```

### 拦截器传值

你也可以[传值](/api/config#...)到拦截器，在拦截器中通过 config 接收，又或者可以请求拦截器传值到响应拦截器。

```js
// 发起请求
instance({
  url: 'https://www.example.com',
  ajax: 'hello ajax' // 传递给拦截器的值
})

// 请求拦截器
instance.interceptors.request.use(config => {
  console.log(config.ajax) // 'hello ajax' 请求时传递给拦截器的值
  config.world = 'hello world' // 请求拦截器传值到响应拦截器
  return config
})

// 响应拦截器
instance.interceptors.response.use(response => {
  console.log(response.config.ajax) // 'hello ajax'  请求时传递给拦截器的值
  console.log(response.config.world) // 'hello world' 请求拦截器传到响应拦截器的值
  return response
})
```

### 移除拦截器

`ajax.interceptors[state].eject(id)`

上面我们添加的拦截器是可以多个点，且根据添加的顺序执行。通过添加拦截器 `use` 方法返回的 id，然后将该 id 传递到 `eject` 方法可移除指定拦截器。

```js
// 添加拦截器
const interceptor = instance.interceptors.request.use(config => {
  return config
})

// 移除拦截器
instance.interceptors.request.eject(interceptor)
```
