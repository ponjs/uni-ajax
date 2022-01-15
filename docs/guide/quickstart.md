---
title: 快速上手
order: 3
toc: menu
---

## 安装

前面我们已经介绍了如何[安装](/guide/installation#npm)，接下来我带你从创建请求实例到发起请求的简单入门。

```bash
npm install uni-ajax
```

## 创建实例

新建 `ajax.js` 文件（文件名可自定义）用于处理拦截器、接口根地址、默认配置等。如果想深入了解请求实例，可通过后面的文档查看详细内容。

```js
// ajax.js

// 引入 uni-ajax 模块
import ajax from 'uni-ajax'

// 创建请求实例
const instance = ajax.create({
  // 初始配置
  baseURL: 'https://www.example.com/api'
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

## 挂载实例

这一步是将创建好的请求实例挂载在 Vue 实例全局属性上，即可方便地调用请求方法。

```js
// main.js

import ajax from './common/ajax' // 路径需根据项目实际情况

// 如果你是像我下面这样挂载在 Vue 原型链上（Vue2），则通过 this.$ajax 调用
Vue.prototype.$ajax = ajax

// 如果你使用最新的 Vue3，则需要这样挂载（app 为 createApp 后的实例），也是通过 this.$ajax 调用（Options API）
app.config.globalProperties.$ajax = ajax

// 如果你在项目中有用到 nvue 页面，是无法通过 this.$ajax 调用
// 需要将请求方法添加到 uni 对象上，然后通过 uni.$ajax 调用
uni.$ajax = ajax
```

## 发起请求

上面我们已经挂载在 Vue 实例全局属性上，则无需引入上面创建的 `ajax.js` 文件，便可通过 `this.$ajax` 在页面中调用发起请求。

```js
// GET 请求 https://www.example.com/api/demo 接口
this.$ajax('demo')

// 你也可以下面这样使用
this.$ajax({ url: 'demo' })
this.$ajax.get('demo')
this.$ajax.get({ url: 'demo' })
```
