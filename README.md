# uni-ajax

* 封装 uni-app 的 request API
* 加入了拦截器、接口根地址、默认参数
* 优化了 Promise 返回值

## 安装

### 下载安装

* 在uni-app插件市场右上角选择`使用HBuilder X 导入插件`或者`下载插件ZIP`。
* 如果您的项目是由HBuilder X创建的标准uni-app项目，将下载解压后的`uni-ajax`文件夹，复制到项目根目录。
* 如果您的项目是由vue-cli模式创建的， 请将下载后的`uni-ajax`文件夹放到项目的`src`文件夹中即可。


### npm 安装
```
// 如果您的项目是HBuilder X创建的，根目录又没有package.json文件的话，请先执行如下命令：
// npm init -y

// 安装
npm install uni-ajax

// 更新
npm update uni-ajax
```

## 引入

创建`request.js`用于处理拦截器、接口根地址、默认参数等，在处理方法后导出`UniAjax`实例上的`request`方法

``` JavaScript
// request.js

import createAjax from 'uni-ajax';

// Default configuration
const ajax = createAjax({
  // baseUrl: 'https://example.com/',
  // method: 'POST',
  // header: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // }
});

ajax.interceptors.request.use(request => {
  // Do something before request is sent
  return request;
}, error => {
  // Do something with request error
  return error;
});

ajax.interceptors.response.use(response => {
  // Do something with response data
  return response;
}, error => {
  // Do something with response error
  return error;
});

const request = ajax.request;

export default request;
```

然后在`main.js`引入该`request.js`，将`request`方法挂载在`Vue`原型链上（如果您是像我这样挂载在`Vue`原型链上，则通过`this.request`调用）

``` JavaScript
// main.js

import request from './utils/request';
Vue.prototype.request = request;
```

## 使用

### 基本使用

``` JavaScript
request(params);
```

`params` \<object\>

| 参数            | 类型             | 说明 |
| :---            | :---            | :--- |
| url             | string          | 请求地址，不填时默认 baseUrl，如果没有 baseUrl 又没有 url 则请求失败 |
| data            | object / string | 请求参数 |
| header          | object          | 设置请求的 header，header 中不能设置 Referer |
| method          | string          | 请求协议，必须大写 |
| timeout         | number          | 超时时间，单位 ms |
| dataType        | string          | 如果设为 json，会尝试对返回的数据做一次 JSON.parse |
| responseType    | string          | 设置响应的数据类型。合法值：text、arraybuffer |
| sslVerify       | boolean         | 验证 ssl 证书 |
| withCredentials | boolean         | 跨域请求时是否携带凭证（cookies） |
| success         | function        | 收到开发者服务器成功返回的回调函数 |
| fail            | function        | 接口调用失败的回调函数 |
| complete        | function        | 接口调用结束的回调函数（调用成功、失败都会执行） |
| response        | object          | 响应拦截器可以接收到的参数 |
| ...             | any             | 请求拦截器接收参数 |

当参数有 `success` / `fail` / `complete` 之一时返回 `requestTask` 对象，则返回 `Promise` 对象。但与原API不同的是，`then`返回的是请求成功对象，`catch`返回的是请求失败对象。（原API没有`catch`，只有`then`返回数组`[err, res]`）


### method 方法使用

``` JavaScript
request.get(url, data, options);
request.post(url, data, options);
request.put(url, data, options);
request.delete(url, data, options);
```

`url` \<string\> 请求地址  
`data` \<object|string\> 请求参数  
`options` \<object\> 其他配置

| 参数            | 类型    | 说明 |
| :---            | :---    | :--- |
| header          | object  | 设置请求的 header，header 中不能设置 Referer |
| timeout         | number  | 超时时间，单位 ms |
| dataType        | string  | 如果设为 json，会尝试对返回的数据做一次 JSON.parse |
| responseType    | string  | 设置响应的数据类型。合法值：text、arraybuffer |
| sslVerify       | boolean | 验证 ssl 证书 |
| withCredentials | boolean | 跨域请求时是否携带凭证（cookies） |
| response        | object  | 响应拦截器可以接收到的参数 |
| ...             | any     | 请求拦截器接收参数 |

返回请求的 `Promise` 对象

### 其他方法

获取配置的接口根地址`baseUrl`
``` JavaScript
request.baseUrl
```

根据配置的接口根地址获取源地址`origin`
``` JavaScript
request.origin
```
