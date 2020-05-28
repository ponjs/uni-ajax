# uni-ajax
* 封装 uni-app 的 request API
* 加入了拦截器、接口根地址、默认参数
* 优化了 Promise 返回值

## Import
``` JavaScript
import createAjax from 'uni-ajax';

// Default configuration
const ajax = createAjax({
  // baseUrl: 'https://example.com/',
  // header: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  // method: 'POST'
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

## Usage
``` JavaScript
/**
 *
 * @param {object} params
 * @param {string} [params.url] 请求地址
 * @param {(object|string)} [params.data] 请求参数
 * @param {object} [params.header] 设置请求的 header，header 中不能设置 Referer
 * @param {string} [params.method] 请求协议，必须大写
 * @param {number} [params.timeout] 超时时间，单位 ms
 * @param {string} [params.dataType] 如果设为 json，会尝试对返回的数据做一次 JSON.parse
 * @param {string} [params.responseType] 设置响应的数据类型。合法值：text、arraybuffer
 * @param {boolean} [params.sslVerify] 验证 ssl 证书
 * @param {boolean} [params.withCredentials] 跨域请求时是否携带凭证（cookies）
 * @param {function} [params.success] 收到开发者服务器成功返回的回调函数
 * @param {function} [params.fail] 接口调用失败的回调函数
 * @param {function} [params.complete] 接口调用结束的回调函数（调用成功、失败都会执行）
 * @returns {(object|Promise)} 当参数有 success / fail / complete 之一时返回 requestTask 对象，则返回 Promise 对象
 */
request(params);

/**
 *
 * @param {string} [url] 请求地址
 * @param {(object|string)} [data] 请求参数
 * @param {object} [options] 其他参数
 * @param {object} [options.header] 设置请求的 header，header 中不能设置 Referer
 * @param {number} [options.timeout] 超时时间，单位 ms
 * @param {string} [options.dataType] 如果设为 json，会尝试对返回的数据做一次 JSON.parse
 * @param {string} [options.responseType] 设置响应的数据类型。合法值：text、arraybuffer
 * @param {boolean} [options.sslVerify] 验证 ssl 证书
 * @param {boolean} [options.withCredentials] 跨域请求时是否携带凭证（cookies）
 * @returns {promise} 返回请求的 Promise 对象
 */
request.get(url, data, options);
request.post(url, data, options);
request.put(url, data, options);
request.delete(url, data, options);
```

## Tips
使用`request(params)`时，如果没有传入 `success` / `fail` / `complete` 参数，则会返回封装后的`Promise`对象，但与原API不同的是，`then`返回的是请求成功对象，`catch`返回的是请求失败对象。（原API没有`catch`，只有`then`返回数组`[err, res]`）
