# 快速上手

新建 `ajax.js` 文件（文件名可自定义）用于处理拦截器、接口根地址、默认配置等。

更多实例配置文档见[实例](/instance/create.html)。

```JavaScript
// ajax.js

// 引入 uni-ajax 模块
import ajax from 'uni-ajax'

// 创建请求实例
const instance = ajax.create({
  // 初始配置
  baseURL: 'https://www.example.com',
  method: 'POST'
})

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

// 导出 create 创建后的实例
export default instance
```

然后在 `main.js` 引入该 `ajax.js` ，并挂载在 `Vue` 实例全局属性上。

```JavaScript
// main.js

import ajax './common/ajax'    // 路径需根据项目实际情况

// 如果您是像我下面这样挂载在 Vue 原型链上（Vue2），则通过 this.$ajax 调用
Vue.prototype.$ajax = ajax

// 如果您使用最新的 Vue3，则需要这样挂载（app 为 createApp 后的实例），也是通过 this.$ajax 调用
app.config.globalProperties.$ajax = ajax

// 如果您在项目中有用到 nvue 页面，是无法通过 this.$ajax 调用
// 需要将请求方法添加到 uni 对象上，然后通过 uni.$ajax 调用
uni.$ajax = instance
```

在页面中[调用](/usage/api.html#请求方法)。

```JavaScript
// POST 请求 https://www.example.com/api 接口
this.$ajax('api')

// 您也可以下面这样使用
this.$ajax({ url: 'api' })
this.$ajax.post('api')
this.$ajax.post({ url: 'api' })
```

如果有API集中管理的需求，可参考这个模板项目 [uni-app-boilerplate](https://github.com/ponjs/uni-app-boilerplate) 。
