# FAQ

这里列举的是一些常问的问题，如果你有其他问题可以在 GitHub 上提交 [issues](https://github.com/ponjs/uni-ajax/issues/new) 或加群交流 [QQ群 917428107](https://qm.qq.com/cgi-bin/qm/qr?k=a0NaOxj875pQzpGh0MEx5jJPZnKAw_IM&jump_from=webapi)。

## 插件市场名称

为什么插件市场上的插件名是 `u-ajax` 而不是 `uni-ajax` 呢？因为第一个版本发布在 npm 上，当时就已经取名为 `uni-ajax` 了，后面发布插件市场时发现命名是不能带有 `uni` 关键词的，所以稍微改了下名称。但是二者代码是完全相同的，不同的是为了迎合 `uni_modules` 的规范，所以插件市场的目录结构有所调整。

## 跨域问题

其实在 [uni-app 官方文档](https://uniapp.dcloud.io/api/request/request.html) 里就已经有提到 H5 端本地调试需注意跨域问题，可以参考该具体解答[调试跨域问题解决方案](https://ask.dcloud.net.cn/article/35267)。

## 与 [Axios](https://github.com/axios/axios) 的使用区别

uni-ajax 底层调用还是用的 [uni.request](https://uniapp.dcloud.io/api/request/request.html)，所以优先遵循 uni-app 的定义。这里列举的是开发者们容易混淆的点，其实还有很大部分是有区别的。

|                        | uni-ajax                                     | axios                                                                            |
| :--------------------- | :------------------------------------------- | :------------------------------------------------------------------------------- |
| 请求头属性名           | `header`                                     | `headers`                                                                        |
| 响应状态码             | `statusCode`                                 | `status`                                                                         |
| 多个请求拦截器执行顺序 | 根据添加顺序执行                             | 根据添加顺序反向执行                                                             |
| 请求别名方法传参       | 所有方法的[传参](/api/#请求方式)是保持一致的 | `get` `delete` 传参是两个参数，且没有 data 属性                                  |
| 请求参数 data          | [详情](/api/config#data)                     | 仅适用 `PUT`, `POST`, `DELETE`, `PATCH` 请求                                     |
| 获取请求地址           | `getURL` 为异步函数                          | `getUri` 为普通函数                                                              |
| 中断请求               | [`Fetcher`](/api/config#fetcher)             | [`AbortController` / `CancelToken`](https://axios-http.com/zh/docs/cancellation) |

## 上传和下载

uni-ajax 暂时只支持发起网络请求，如果你想要上传或下载，你可以使用 [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file?id=uploadfile) 和 [uni.downloadFile](https://uniapp.dcloud.io/api/request/network-file?id=downloadfile)。这里举例封装上传，你可以根据项目实际情况处理。

如果想进阶一点，可以通过 [adapter](/api/config#adapter) 添加上传下载适配器，这样上传下载也跟请求一样会经过拦截器。

```js
// ajax.js
// 在 Ajax 实例上挂载 upload 方法
instance.upload = function (filePath, formData, callback) {
  return new Promise(async (resolve, reject) => {
    const url = await instance.getURL({ url: 'upload' })

    const uploadTask = uni.uploadFile({
      url,
      filePath,
      name: 'file',
      // 如果第二个参数是 object 类型则作为 formData 使用
      formData: typeof formData === 'object' ? formData : {},
      complete: res => (res.statusCode === 200 ? resolve(res) : reject(res))
    })

    // 如果第二个参数是 function 类型则作为 uploadTask 的回调函数使用，并不管第三个参数了
    if (typeof formData === 'function') {
      formData(uploadTask)
    } else if (typeof callback === 'function') {
      callback(uploadTask)
    }
  })
}

// pages
// 在页面中调用 this.$ajax.upload()
this.$ajax.upload(filePath)
```

## 响应失败不抛出错误

我们知道 Promise 有三种状态 pending / fulfilled / rejected 。当状态为 fulfilled 会进到 then 接受状态回调，如果是 rejected 时会抛出“错误”，要用 catch 捕捉或 then 拒绝状态回调。这样那只有 pending 状态时不会进到任何回调。顺着这个思路，我们只要在响应错误时返回 pending 状态的 Promise 即可。

```js
// ajax.js

// 定义 pending 状态的 Promise，用于避免进入 catch 回调
const pending = new Promise(() => {})

// 响应拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    /**
     * 在有返回错误的拦截器里返回 pending 状态的 Promise
     *
     * 那如果想要在请求方法接收响应错误是怎么办呢？
     * 我们可以通过拦截器传值再做相应逻辑，
     * 这里我用传值 catch 判断是否需要返回错误，如果是 true 返回错误信息，否则不返回。
     */
    return error.config.catch ? Promise.reject(error) : pending
  }
)

// 有发生错误信息时，并用 catch 捕捉
instance({ catch: true }).catch(err => console.log(err))
// 有发生错误信息时，不返回错误信息
instance()
```

## 无感刷新 Token

当 Token 过期的时候，做到用户无感知刷新 Token，避免频繁登录。在响应拦截器中拦截判断当前请求的接口是否已经 Token 过期，如果过期则请求刷新 Token 接口更新，然后再自动将原来请求接口重新请求一遍。

```js
import ajax from 'uni-ajax'

// 创建实例
const instance = ajax.create({
  baseURL: 'https://www.example.com/api'
})

let isRefreshing = false  // 当前是否在请求刷新 Token
let requestQueue = []     // 将在请求刷新 Token 中的请求暂存起来，等刷新 Token 后再重新请求

// 执行暂存起来的请求
const executeQueue = error => {
  requestQueue.forEach(promise => {
    if (error) {
      promise.reject(error)
    } else {
      promise.resolve()
    }
  })

  requestQueue = []
}

// 刷新 Token 请求
const refreshToken = () => instance.post('/oauth/token')

// 刷新 Token 请求处理，参数为刷新成功后的回调函数
const refreshTokenHandler = afresh => {
  // 如果当前是在请求刷新 Token 中，则将期间的请求暂存起来
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      requestQueue.push({ resolve, reject })
    }).then(afresh)
  }

  isRefreshing = true

  return new Promise((resolve, reject) => {
    refreshToken()
      // 假设请求成功接口返回的 code === 200 为刷新成功，其他情况都是刷新失败
      .then(res => (res.data.code === 200 ? res : Promise.reject(res)))
      .then(res => {
        uni.setStorageSync('TOKEN', res.data.data)
        resolve(afresh?.())
        executeQueue(null)
      })
      .catch(err => {
        uni.removeStorageSync('TOKEN')
        reject(err)
        executeQueue(err)
      })
      .finally(() => {
        isRefreshing = false
      })
  })
}

// 添加请求拦截器
instance.interceptors.request.use(config => {
  // 给每条请求赋值 Token 请求头
  config.header['Authorization'] = uni.getStorageSync('TOKEN')
  return config
})

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 假设接口返回的 code === 401 时则需要刷新 Token
    if (response.data.code === 401) {
      return refreshTokenHandler(() => instance(response.config))
    }

    return response
  },
  error => {
    return Promise.reject(error)
  }
)
```

## 配置全局请求加载

若要实现每个请求默认有 `loading` 效果，可以通过拦截器并搭配[自定义配置](/guide/interceptor#拦截器传值)实现。

```js
class Loading {
  times = 0
  timer = null

  show(loading) {
    if (loading === false) return // 如果传入的 loading 属性为 false，则不处理

    clearTimeout(this.timer) // 如果有多个请求同时进行，则用最后请求的 loading

    this.times++
    this.timer = setTimeout(() => {
      uni.showLoading({
        title: loading ?? '加载中',
        mask: true
      })
    }, 300) // 设定延迟，如果请求超过 300ms 才显示 loading
  }

  hide(loading) {
    if (loading === false) return

    this.times--
    if (this.times <= 0) {
      clearTimeout(this.timer)
      uni.hideLoading()
      this.times = 0
    }
  }
}

const loading = new Loading()

const instance = ajax.create({/***/})

// 请求拦截器
instance.interceptors.request.use(
  config => {
    loading.show(config.loading)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    loading.hide(response.config.loading)
    return response
  },
  error => {
    loading.hide(error.config.loading)
    return Promise.reject(error)
  }
)

instance({ loading: '登录中' }) // 当前请求自定义加载文字
instance({ loading: false }) // 当前请求不显示加载
```

如果是 Typescript 的话是需要定义[配置属性类型](/guide/typescript#定义类型)。

```ts
declare module 'uni-ajax' {
  interface CustomConfig {
    loading?: string | false
  }
}
```
