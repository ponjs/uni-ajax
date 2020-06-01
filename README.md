# uni-ajax

* 封装 uni-app 的 request API
* 加入了拦截器、接口根地址、默认参数
* 优化了 Promise 返回值

## Import

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

然后在`main.js`引入该`request.js`，将`request`方法挂载在`Vue`原型链上

``` JavaScript
// main.js

import request from './utils/request';
Vue.prototype.request = request;
```

## Usage 

``` JavaScript
request(params);
```

`params` \<object\>

| 参数            | 类型             | 说明 |
| :---            | :---            | :--- |
| url             | string          | 请求地址，不填时默认 baseUrl，如果没有 baseUrl 又没有 url 则请求失败 |
| data            | object / string | 请求参数，如果 method 为 GET 时且有参数为 object，会序列化处理拼接在 url 上 |
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

当参数有 `success` / `fail` / `complete` 之一时返回 `requestTask` 对象，则返回 `Promise` 对象。但与原API不同的是，`then`返回的是请求成功对象，`catch`返回的是请求失败对象。（原API没有`catch`，只有`then`返回数组`[err, res]`）

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

返回请求的 `Promise` 对象
