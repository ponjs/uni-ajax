# 拦截器

拦截器简单点说就是拦截每一次你的请求和响应，然后进行相应的处理。被`then / catch`处理前拦截。

前面说到如何[创建实例](/instance/create.html#创建实例)，这里是在创建实例后的基础上加入拦截器，拦截器有`请求拦截`和`响应拦截`。

`ajax.interceptors[state].use([onFulfilled[, onRejected]])`

## 请求拦截器

```JavaScript
// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    return config
  },
  error => {
    // 对请求错误做些什么
    return error
  }
)
```

> 例如判断是否有 Token 有的话请求头加入 Token

```JavaScript
instance.interceptors.request.use(
  config => {
    const token = uni.getStorageSync('TOKEN')
    token && (config.header['Authorization'] = token)
    return config
  }
)
```

### 拒绝发送请求 <Badge text="2.1.3"/>

如果你想在请求拦截器中中断请求，则只返回`Promise.reject`即可。中断请求后会触发请求错误事件，即会触发`fail / catch`。

```JavaScript
// 请求拦截器
instance.interceptors.request.use(
  config => {
    // 拒绝请求
    return Promise.reject({
      config,
      errMsg: 'request:fail intercepted'
    })
  }
)

// 发起请求
ajax().catch(err => {
  console.log(err.config)
})
```

## 响应拦截器

当服务器返回的 HTTP 状态码为 `[200, 300)` 时会到响应成功方法里，否则到响应错误。当然这个状态码验证是可通过[validateStatus](/instance/create.html#validatestatus)修改。

```JavaScript
// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response
  },
  error => {
    // 对响应错误做点什么
    return error
  }
)
```

> 例如当接口返回的 code 值不为 1 时 toast 提示返回的 msg 信息

```JavaScript
instance.interceptors.response.use(
  response => {
    if (response.data.code !== 1) {
      uni.showToast({
        title: response.data.msg,
        icon: 'none'
      })
    }
    return response
  }
)
```

### 拒绝响应成功 <Badge text="2.0.2"/>

如果你在响应成功方法里返回`Promise.reject`，请求接口时则会执行`fail / catch`。

> 例如在上面例子的基础上，当 code 值不为 1 时执行 fail / catch

```JavaScript
// 响应拦截器
instance.interceptors.response.use(
  response => {
    if (response.data.code !== 1) {
      // ...
      return Promise.reject(response)
    }
    return response
  }
)

// 请求
ajax()
  .then(res => {
    // 响应成功且code值为1
  })
  .catch(err => {
    // 响应错误 或 响应成功且code值不为1
  })
```

### 传值给拦截器 <Badge text="2.1.0"/>

你也可以[传值](/usage/request.html)到拦截器，在拦截器中通过`config`接收，又或者可以请求拦截器传值到响应拦截器。

```JavaScript
// 发起请求
ajax({
  url: 'https://www.example.com',
  ajax: 'hello ajax'    // 传递给拦截器的值
})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    console.log(config.ajax)        // 'hello ajax' 请求时传递给拦截器的值
    config.world = 'hello world'    // 请求拦截器传值到响应拦截器
    return config
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    console.log(response.config.ajax)     // 'hello ajax'  请求时传递给拦截器的值
    console.log(response.config.world)    // 'hello world' 请求拦截器传到响应拦截器的值
    return response
  }
)
```
