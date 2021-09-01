# Typescript <Badge text="2.2.0"/>

::: tip 提示
在 `2.2.0` 以上版本已支持使用 `TypeScript` 开发。
:::

### ajax.ts

```Typescript
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

### main.ts

```Typescript
import ajax './common/ajax'

uni.$ajax = ajax // nvue
Vue.prototype.$ajax = ajax // Vue2
app.config.globalProperties.$ajax = ajax // Vue3
```

### sfc.d.ts

```Typescript
import { AjaxInstance } from 'uni-ajax'

// nvue
declare namespace UniApp {
  interface Uni {
    $ajax: AjaxInstance
  }
}

// Vue2
declare module 'vue/types/vue' {
  interface Vue {
    $ajax: AjaxInstance
  }
}

// Vue3
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $ajax: AjaxInstance
  }
}
```

### 注意

- 我们在请求时或在请求拦截器中是可以[传值](instance/interceptor.html#拦截器传值)到拦截器，但是在 TypeScript 中需要定义属性类型。

```Typescript
// sfc.d.ts

declare module 'uni-ajax' {
  interface AjaxRequestConfig {
    // prop?: type
  }
}
```

- 定义返回的数据类型，[请求方法](/usage/api.html#请求方法)都支持泛型，并有两个泛型参数 `<T = any, R = AjaxResponse<T>>` 。

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

- `ajax.config` 需通过泛型指出参数类型。当泛型参数传入 `Function` 时参数是函数类型，当传入 `Object` 时参数是对象类型。这取决你创建实例时是函数配置还是对象配置。<Badge text="2.2.6"/>

```Typescript
ajax.config<Object>(config => {
  return config
})
```
