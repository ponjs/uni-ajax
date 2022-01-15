---
title: FAQ
order: 6
toc: content
---

## 上传和下载

uni-ajax 暂时只支持发起网络请求，如果你想要上传或下载，你可以使用 [uni.uploadFile](https://uniapp.dcloud.io/api/request/network-file?id=uploadfile) 和 [uni.downloadFile](https://uniapp.dcloud.io/api/request/network-file?id=downloadfile)。这里举例如果封装上传，你可以根据项目实际情况处理。

```js
// ajax.js
// 在 Ajax 实例上挂载 upload 方法
instance.upload = function (filePath, formData, callback) {
  return new Promise(async (resolve, reject) => {
    const url = await this.getURL({ url: 'upload' })

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

## 处理重复请求

当我们在提交表单时，提交一次就会发起一次请求，如果用户频繁点击按钮提交则会触发多次请求。避免这种情况我们一般在发起请求处做防抖处理。你也可以在实例配置时处理。将处于 pending 状态的请求用数组存储起来形成请求队列。在请求时判断当前请求是否已存在。如果存在，说明请求重复了，则中断这个请求，并移除队列中的该请求。如果不存在，说明这个请求不是重复的，正常发送并把该请求添入队列中。这里只是提供思路，具体的实现方式请根据实际项目情况。

```js
// ajax.js

// 请求队列
const queue = new Map()

// 创建实例
const instance = ajax.create({
  xhr(task, config) {
    queue.get(config.url)?.abort()
    queue.set(config.url, task)
  }
})
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
