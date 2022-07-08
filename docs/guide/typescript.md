---
title: TypeScript
order: 5
toc: menu
---

**ajax.ts**

```ts
import ajax from 'uni-ajax'

const instance = ajax.create({
  baseURL: ''
})

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default instance
```

**main.ts**

```ts
import ajax from './services/ajax'

uni.$ajax = ajax // nvue
Vue.prototype.$ajax = ajax // Vue2
app.config.globalProperties.$ajax = ajax // Vue3 (Options API)
```

**sfc.d.ts**

```ts
import { AjaxInstance, AjaxRequestConfig } from 'uni-ajax'

// nvue
declare namespace UniApp {
  interface Uni {
    $ajax: AjaxInstance<AjaxRequestConfig>
  }
}

// Vue2
declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxInstance<AjaxRequestConfig>
  }
}

// Vue3 (Options API)
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ajax: AjaxInstance<AjaxRequestConfig>
  }
}
```

**注意**

- 我们在请求时或在请求拦截器中是可以传值到拦截器，但是在 TypeScript 中需要定义属性类型。

```ts
// sfc.d.ts

declare module 'uni-ajax' {
  interface AjaxRequestConfig {
    // prop?: type
  }
}
```

- 定义返回的数据类型，请求方法都支持泛型，并有两个泛型参数 `<T = any, R = AjaxResponse<T>>`。

```ts
// 定义接口返回的数据类型
interface ResponseData<T = any> {
  code: number
  msg: string
  data: T
}

// 通过泛型定义 res.data 的类型为 ResponseData
ajax<ResponseData>().then(res => {
  console.log(res.data) // 这里 res.data 的类型为 ResponseData
})

/** 下面是如果直接接收服务端返回数据 */

// 响应拦截器 返回接口数据
instance.interceptors.response.use(response => {
  return response.data
})
// 请求方法 通过泛型定义 res 的类型为 ResponseData
ajax<never, ResponseData>().then(res => {
  console.log(res) // 这里 res 的类型为 ResponseData
})
```
