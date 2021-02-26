# Typescript <Badge text="2.2.0"/>

::: tip 提示
在 `2.2.0` 以上版本已支持使用 `TypeScript` 开发。
:::

### ajax.ts

```Typescript
import Vue from 'vue'
import ajax from 'uni-ajax'

const instance = ajax.create({
  baseURL: ''
})

instance.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return error
  }
)

instance.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return error
  }
)

Vue.prototype.$ajax = instance

export default instance
```

### main.ts

```Typescript
import './utils/ajax'
```

### sfc.d.ts

```Typescript
import { AjaxInstance } from 'uni-ajax'

declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxInstance
  }
}
```

### 注意

- 我们在请求时或在请求拦截器中是可以[传值](instance/interceptor.html#传值给拦截器)到拦截器，但是在 TypeScript 中需要定义属性类型。

```Typescript
// sfc.d.ts

declare module 'uni-ajax' {
  interface AjaxRequestConfig {
    // prop?: type
  }
}
```

- 定义接口返回的数据类型，[请求方法](/usage/api.html#请求方法)都支持泛型，并有两个泛型参数`<T = any, R = AjaxResponse<T>>`

```Typescript
// 定义接口返回的数据类型
interface ResponseData {
  code: number;
  data: any;
  msg: string;
}


// 通过泛型定义 res.data 的类型为 ResponseData
ajax<ResponseData>().then(res => {
  console.log(res.data)    // 这里 res.data 的类型为 ResponseData
})

/** 下面是如果直接接收服务端返回数据 */

// 响应拦截器 返回接口数据
instance.interceptors.response.use(
  response => {
    return response.data
  }
)
// 请求方法 通过泛型定义 res 的类型为 ResponseData
ajax<unknown, ResponseData>().then(res => {
  console.log(res)    // 这里 res 的类型为 ResponseData
})
```
