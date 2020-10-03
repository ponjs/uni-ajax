## ✨ 特性

- 支持 Promise API
- 加入请求拦截器、响应拦截器
- 可以配置接口根地址、默认参数
- 支持 method 方法请求
- 支持 task 操作

## 🍟 文档

[https://uniajax.ponjs.com](https://uniajax.ponjs.com)

## 🥗 安装

### 下载安装

- 在 uni-app 插件市场右上角选择`使用HBuilder X 导入插件`或者`下载插件ZIP`。
- 如果您的项目是由 HBuilder X 创建的标准 uni-app 项目，将下载解压后的`uni-ajax`文件夹，复制到项目根目录。
- 如果您的项目是由 vue-cli 模式创建的， 请将下载后的`uni-ajax`文件夹放到项目的`src`文件夹中即可。

### npm 安装

```
// 如果您的项目是HBuilder X创建的，根目录又没有package.json文件的话，请先执行如下命令：
// npm init -y

// 安装
npm install uni-ajax

// 更新
npm update uni-ajax
```

## 🥐 引入

新建`ajax.js`文件（文件名自定义）用于处理拦截器、接口根地址、默认参数等

```JavaScript
// ajax.js

// 引入 Vue 用于将请求实例挂载在 Vue 原型链上
import Vue from 'vue';
// 引入 uni-ajax 模块
import ajax from 'uni-ajax';

const _ajax = ajax.create({
  // 默认配置
});

_ajax.interceptors.request.use(
  request => {
    // 在发送请求之前做些什么
    return request;
  },
  error => {
    // 对请求错误做些什么
    return error;
  }
);

_ajax.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    return response;
  },
  error => {
    // 对响应错误做点什么
    return error;
  }
);

// 如果您是像我下面这样挂载在 Vue 原型链上，则通过 this.$ajax 调用
Vue.prototype.$ajax = _ajax;

// 导出 create 创建后的实例
export default _ajax;
```

然后在`main.js`引入该`ajax.js`

```JavaScript
// main.js

import './utils/ajax';    // 路径需根据项目实际情况
```

## 🥪 使用

```JavaScript
// 常规使用
ajax();

// 请求方式使用
ajax.get();
ajax.post();
ajax.put();
ajax.delete();

// 其他属性
ajax.baseURL    // 获取配置的接口根地址 baseURL
ajax.origin     // 根据配置的接口根地址获取源地址 origin
```

上面的方法中，传参方式有`params`或`url[, data[, options]]`，返回都是`Promise`对象，但是`resolve`和`reject`的返回不同

- `params`
  - resolve：requestTask 对象
  - reject：请求失败对象
- `url[, data[, options]]`
  - resolve：响应成功对象
  - reject：响应失败对象

### 参数

`params` \<object\>

| 参数            | 类型            | 说明                                                                       |
| :-------------- | :-------------- | :------------------------------------------------------------------------- |
| url             | string          | 请求地址，不填时默认配置的 baseURL，如果没有 baseURL 又没有 url 则请求失败 |
| data            | object / string | 请求参数                                                                   |
| header          | object          | 设置请求的 header，header 中不能设置 Referer                               |
| method          | string          | 请求协议，不填时默认配置的 method 或 GET，必须大写                         |
| timeout         | number          | 超时时间，单位 ms                                                          |
| dataType        | string          | 如果设为 json，会尝试对返回的数据做一次 JSON.parse                         |
| responseType    | string          | 设置响应的数据类型。合法值：text、arraybuffer                              |
| sslVerify       | boolean         | 验证 ssl 证书                                                              |
| withCredentials | boolean         | 跨域请求时是否携带凭证（cookies）                                          |
| success         | function        | 收到开发者服务器成功返回的回调函数                                         |
| fail            | function        | 接口调用失败的回调函数                                                     |
| complete        | function        | 接口调用结束的回调函数（调用成功、失败都会执行）                           |
| response        | object          | 响应拦截器可以接收到的值                                                   |
| ...             | any             | 传递给请求拦截器的值                                                       |

`url` \<string\> 请求地址  
`data` \<object|string\> 请求参数  
`options` \<object\> 其他配置

| 参数            | 类型    | 说明                                                                            |
| :-------------- | :------ | :------------------------------------------------------------------------------ |
| header          | object  | 设置请求的 header，header 中不能设置 Referer                                    |
| method          | string  | 请求协议（如果是请求方式使用，method 设置是无效的，只有在 ajax() 使用时才生效） |
| timeout         | number  | 超时时间，单位 ms                                                               |
| dataType        | string  | 如果设为 json，会尝试对返回的数据做一次 JSON.parse                              |
| responseType    | string  | 设置响应的数据类型。合法值：text、arraybuffer                                   |
| sslVerify       | boolean | 验证 ssl 证书                                                                   |
| withCredentials | boolean | 跨域请求时是否携带凭证（cookies）                                               |
| response        | object  | 响应拦截器可以接收到的值                                                        |
| ...             | any     | 传递给请求拦截器的值                                                            |
