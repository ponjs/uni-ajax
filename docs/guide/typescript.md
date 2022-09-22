---
title: TypeScript
order: 5
toc: menu
---

如果要使用 Typescript 开发，则不能用[HBuilderX](https://uniapp.dcloud.net.cn/quickstart-hx.html)直接创建项目，而应该使用[脚手架](https://uniapp.dcloud.net.cn/quickstart-cli.html)创建。对于不太了解 TypeScript 的同学可以查看[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)，我也是更推荐大家使用 Typescript 去开发项目。

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

// nvue（Vue2）
declare namespace UniApp {
  interface Uni {
    $ajax: AjaxInstance<AjaxRequestConfig>
  }
}

// nvue（Vue3）
declare global {
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
  code: 200 | 404 | 500
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
instance<never, ResponseData>().then(res => {
  console.log(res) // 这里 res 的类型为 ResponseData
})
```
