# 拦截器

`ajax.interceptors[state].use(onFulfilled, onRejected)`

拦截器简单点说就是拦截每一次你的请求和响应，然后进行相应的处理，之后再进到 then / catch 。前面说到如何创建实例，这里是在创建实例后的基础上加入拦截器，拦截器有请求拦截和响应拦截。

在创建拦截器我们可以传入两个参数 `onFulfilled` 和 `onRejected`，一是成功事件拦截处理，需返回对应的数据下一步才能接收到；二是错误事件拦截处理，注意的是必须返回 Promise.reject 才能触发 catch ，否则都是触发 then 。

## 请求拦截器

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

### 拒绝发送请求

如果你想在请求拦截器中中断请求，则只返回 Promise.reject 即可。中断请求后会触发请求错误事件，即会触发 catch 。

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

## 响应拦截器

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
instance.interceptors.response.use(response => {
  if (response.data.code !== 1) {
    uni.showToast({
      title: response.data.msg,
      icon: 'none'
    })
  }
  return response
})
```

### 响应自定义内容

服务端返回的数据是在 `response.data` 中，如果你想直接在请求方法中接收服务端返回数据也是可以的。

```js
instance.interceptors.response.use(response => {
  // 直接返回服务端数据
  return response.data
})

instance().then(res => {
  // 这里的 res 即为上面的 response.data
  console.log(res)
})
```

### 拒绝响应成功

如果你在响应成功方法里返回 Promise.reject，请求接口时则会执行 catch。

```js
// 响应拦截器
instance.interceptors.response.use(response => {
  if (response.data.code !== 1) {
    /* ... */
    return Promise.reject(response)
  }
  return response
})

// 请求
instance()
  .then(res => {
    // 响应成功且code值为1
  })
  .catch(err => {
    // 响应错误 或 响应成功且code值不为1
  })
```

## 拦截器传值

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

## 移除拦截器

`ajax.interceptors[state].eject(id)` <Badge>2.3.0</Badge>

上面我们添加的拦截器是可以多个点，且根据添加的顺序执行。通过添加拦截器 `use` 方法返回的 id，然后将该 id 传递到 `eject` 方法可移除指定拦截器。

```js
// 添加拦截器
const interceptor = instance.interceptors.request.use(config => {
  return config
})

// 移除拦截器
instance.interceptors.request.eject(interceptor)
```
