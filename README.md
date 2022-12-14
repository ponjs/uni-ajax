## ✨ 特性

- 支持 Promise API
- 支持 Typescript 开发
- 拦截请求和响应
- 自定义配置请求实例
- 多种 Method 方法请求
- 支持 RequestTask 操作

## 🍟 文档

**[uniajax.ponjs.com](https://uniajax.ponjs.com)**

## 🥗 安装

**插件市场**

在插件市场右上角选择 `使用HBuilder X 导入插件` 或者 `下载插件ZIP`

**NPM**

```bash
# 如果您的项目是HBuilder X创建的，根目录又没有package.json文件的话，请先执行如下命令：
# npm init -y

# 安装
npm install uni-ajax

# 更新
npm update uni-ajax
```

## 🥐 实例

新建 `ajax.js` 文件（文件名可自定义）用于处理拦截器、接口根地址、默认配置等，详细配置请[查看文档](https://uniajax.ponjs.com/instance/create.html)

```JavaScript
// ajax.js

import ajax from 'uni-ajax'                                 // 引入 uni-ajax 模块

const instance = ajax.create(config)                        // 创建请求实例

instance.interceptors.request.use(onFulfilled, onRejected)  // 添加请求拦截器
instance.interceptors.response.use(onFulfilled, onRejected) // 添加响应拦截器

export default instance                                     // 导出创建后的实例
```

## 🥪 使用

**请求方法**

```JavaScript
// 常规方法
ajax()

// 请求方法别名
ajax.get()
ajax.post()
ajax.put()
ajax.delete()
```

**RequestTask**

```JavaScript
import ajax, { Fetcher } from 'uni-ajax'

const fetcher = new Fetcher()
ajax({ fetcher })

fetcher.abort()                            // 中断请求任务
const requestTask = await fetcher.source() // 获取请求任务对象
```

**其他属性方法**

```JavaScript
ajax.defaults       // 全局默认配置
ajax.config         // 当前实例配置
ajax.getURL(config) // 获取实例请求地址
```
