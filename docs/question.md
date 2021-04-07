# FAQ

### **如何上传和下载**

`uni-ajax`暂时只支持发起网络请求，如果您想要上传或下载，您可以使用 [uni.uploadFile][2]和 [uni.downloadFile][3]。这里我们可以使用`ajax.baseURL`或`ajax.origin`来获取相关地址，对上传或下载的`url`进行所需的拼接处理。

> 这里我只是举例，您可根据项目实际情况处理

```Javascript
// ajax.js
// 在 Ajax 实例上挂载 upload 方法
instance.upload = function(filePath, formData, callback) {
  return new Promise((resolve, reject) => {
    const uploadTask = uni.uploadFile({
      url: this.baseURL + '/upload',
      filePath,
      name: 'file',
      // 如果第二个参数是 object 类型则作为 formData 使用
      formData: typeof formData === 'object' ? formData : {},
      complete: res => (res.statusCode === 200 ? resolve(res) : reject(res))
    })

    // 如果第二个参数是 function 类型则作为 uploadTask 的回调函数使用，并不管第三个参数了
    if (typeof formData === 'function') return formData(uploadTask)
    typeof callback === 'function' && callback(uploadTask)
  })
}

// pages
// 在页面中调用 this.$ajax.upload()
this.$ajax.upload(filePath)
```

### **H5 打包出现 `API request is not yet implemented`**

如果您是通过`npm`安装`uni-ajax`，又在项目中没用到`uni.request`，并且 H5 配置中开启了 [摇树优化][1]，则会出现这问题。解决该问题有两种方法。

1、关闭摇树优化<br />
2、使用`uni.request`

第一种解决方法似乎不太合理，那我们使用第二种方法。摇树优化简单点说就是没有用到的组件或 API 会被去除，虽然`uni-ajax`是封装`uni.request`，但是`node_modules`是被摇树优化忽略的，所以当有用到`uni.request`时，才不会被去掉。

> 这里我们在[创建实例](/instance/create.html)的文件中加入下面代码即可<br />
> 我这里做 export，即使不会用到 request，但必须要有 uni.request 代码片段

```Javascript
// #ifdef H5
export const request = uni.request
// #endif
```

### 如何处理重复请求

<!-- 将处于`pending`的请求用数组存储起来形成请求队列。每个请求发送之前判断当前请求是否已存在。如果存在，说明请求重复了，则中断这个请求。如果不存在，说明这个请求不是重复的，正常发送并且把这个请求添入队列中，等请求结束之后移除队列的该 API。这里只是提供思路，具体的实现方式请根据实际项目情况。<br />
新建`queue.js`，用于处理请求 URL 队列，根据 URL 队列来处理重复请求。

```Javascript
// queue.js

// 引入合并 URL 方法
import { combineURL } from 'uni-ajax/src/lib/helpers'

class QueueURL {
  constructor() {
    this.queue = []
  }
  // 判断队列是否存在该请求 URL
  has({ baseURL, url }) {
    const finalURL = combineURL(baseURL, url)
    const has = this.queue.includes(finalURL)
    !has && this.queue.push(finalURL)
    return has
  }
  // 移除请求 URL
  remove(url = '') {
    const index = this.queue.indexOf(url)
    index > -1 && this.queue.splice(index, 1)
  }
}

const queueURL = new QueueURL()

export default queueURL
```

然后在请求实例文件中，在拦截器上做相应处理。

```Javascript
// ajax.js

import queue from './queue'

// 请求拦截器
// 如果重复请求则中断请求 直到该接口响应
instance.interceptors.request.use(
  config => {
    if (queue.has(config)) {
      return Promise.reject({
        config,
        errMsg: 'request:fail repeat'
      })
    }
    return config
  }
)

// 响应拦截器
// 无论响应成功或失败都释放请求 URL
instance.interceptors.response.use(
  response => {
    queue.remove(response.config.url)
    return response
  },
  error => {
    queue.remove(error.config.url)
    return error
  }
)
``` -->

将处于`pending`状态的请求用数组存储起来形成请求队列。在请求时判断当前请求是否已存在。如果存在，说明请求重复了，则中断这个请求，并移除队列中的该请求。如果不存在，说明这个请求不是重复的，正常发送并把该请求添入队列中。这里只是提供思路，具体的实现方式请根据实际项目情况。

```Javascript
// ajax.js

// 请求队列
const queue = []

// 创建实例
const instance = ajax.create({
  xhr: (task, config) => {
    task.url = config.url
    const index = queue.findIndex(ele => ele.url === task.url)
    index > -1 && queue.splice(index, 1)[0].abort()
    queue.push(task)
  }
})
```

### 响应失败不抛出错误

我们知道`Promise`有三种状态`pending / fulfilled / rejected`。当状态为`fulfilled`会进到`then`回调，如果是`rejected`时会抛出“错误”，要用`catch`捕捉。这样那只有`pending`状态时不会进到回调。顺着这个思路，我们只要在响应错误时返回`pending`状态的`Promise`即可。

```Javascript
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
    return error.config.catch ? error : pending
  }
)

// 有发生错误信息时，并用 catch 捕捉
instance({ catch: true }).catch(err => console.log(err))
// 有发生错误信息时，不返回错误信息
instance()
```

### **其他使用方式**

可无需配置实例，直接使用，[使用方法](/usage/api.html#请求方法)都是一样的。

```Javascript
// 引入
import ajax from 'uni-ajax'

// 请求
ajax()
```

拦截器和创建实例的函数配置都支持`async / await`操作。

```Javascript
// 创建实例
const instance = ajax.create(async () => {
  return {
    // 例如获取异步 token 生成请求头
    header: {
      Token: await generate()
    }
  }
})

// 请求拦截器
instance.interceptors.request.use(
  async config => {
    // 例如请求参数加验签参数
    config.data = {
      ...(await validate()),
      ...config.data
    }
    return config
  }
)
```

[1]: https://ask.dcloud.net.cn/article/36279
[2]: https://uniapp.dcloud.io/api/request/network-file?id=uploadfile
[3]: https://uniapp.dcloud.io/api/request/network-file?id=downloadfile
