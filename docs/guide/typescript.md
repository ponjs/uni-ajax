# TypeScript

像 TypeScript 这样的类型系统可以在编译时通过静态分析检测出很多常见错误。通过 IDE 中基于类型的自动补全，TypeScript 还改善了开发体验和效率。

如果要使用 Typescript 开发，则不能用[HBuilderX](https://uniapp.dcloud.net.cn/quickstart-hx.html)直接创建项目，而应该使用[脚手架](https://uniapp.dcloud.net.cn/quickstart-cli.html)创建。对于不太了解 TypeScript 的同学可以查看[深入理解 TypeScript](https://jkchao.github.io/typescript-book-chinese/)，我也是更推荐大家使用 Typescript 去开发项目。

## 项目配置

这里的项目配置指的是将创建好的请求实例挂载在全局上，如果你不想这么做也可以略过下面挂载步骤。

:::  code-group

```ts [ajax.ts]
import ajax from 'uni-ajax'

const instance = ajax.create()

// 这里跟快速上手文档中的创建实例一致
// https://uniajax.ponjs.com/guide/quickstart#%E5%88%9B%E5%BB%BA%E5%AE%9E%E4%BE%8B

export default instance
```

```ts [main.ts]
import ajax from './services/ajax'

uni.$ajax = ajax // nvue
Vue.prototype.$ajax = ajax // Vue2
app.config.globalProperties.$ajax = ajax // Vue3 (Options API)
```

```ts [sfc.d.ts]
import type { AjaxInstance, AjaxRequestConfig } from 'uni-ajax'

// 这里泛型是创建实例所传的参数类型
// https://uniajax.ponjs.com/guide/instance#%E5%AE%9E%E4%BE%8B%E9%85%8D%E7%BD%AE

// nvue (Vue2)
declare namespace UniApp {
  interface Uni {
    $ajax: AjaxInstance<AjaxRequestConfig>
  }
}

// nvue (Vue3)
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

:::

## 定义类型

我们在请求时或在请求拦截器中是可以自定义属性到拦截器，但是在 TypeScript 中需要定义属性类型。<Badge type="warning" text="2.4.6" />

```ts
declare module 'uni-ajax' {
  interface CustomConfig {
    // prop?: type
  }

  // 2.4.5 以下版本
  // interface AjaxRequestConfig {}
}
```

定义请求响应数据类型。可传递两种泛型参数，第一个泛型是传递给封装的响应类型，第二个是直接覆盖响应类型。

```ts
ajax<string>().then(res => {
  console.log(res)  // 这里 res 类型为 AjaxResponse<string>
})

ajax<never, string>().then(res => {
  console.log(res)  // 这里 res 类型为 string
})
```

响应拦截器[返回自定义内容](/guide/interceptor#响应自定义内容)后，上面的第一个请求方法就不太适应，所以这提供了一个自定义响应的类型，并支持一个泛型参数。<Badge text="2.4.6" />

```ts
declare module 'uni-ajax' {
  interface CustomResponse<T> {
    code: number
    msg: string
    data: T
  }
}

instance.interceptors.response.use(response => {
  return response.data
})

instance<string>().then(res => {
  console.log(res) // 这里 res 的类型为 CustomResponse<string>
})

instance<never, string>().then(res => {
  console.log(res) // 这里 res 的类型为 string
})
```
