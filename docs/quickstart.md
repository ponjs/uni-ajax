# 快速上手

新建`ajax.js`文件（文件名可自定义）用于处理拦截器、接口根地址、默认配置等。

更多实例配置文档见[实例](/instance/create.html)。

```JavaScript
// ajax.js

// 引入 Vue 用于将请求实例挂载在 Vue 原型链上
import Vue from 'vue'
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

// 如果您是像我下面这样挂载在 Vue 原型链上，则通过 this.$ajax 调用
Vue.prototype.$ajax = instance
// 如果您在项目中有用到 nvue 页面，是无法通过 this.$ajax 调用
// 需要将实例添加到 uni 对象上，然后通过 uni.$ajax 调用
uni.$ajax = instance

// 导出 create 创建后的实例
export default instance
```

然后在`main.js`引入该`ajax.js`。

```JavaScript
// main.js

import './utils/ajax'    // 路径需根据项目实际情况
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
