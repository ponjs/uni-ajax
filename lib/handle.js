import querystring from 'querystring';
import { requestUrl, isCallback } from './utils';

/**
 * 对请求拦截再次处理
 * @param {object} request
 */
function handleRequest(request = {}) {
  // 判断参数是否为对象
  if (Object.prototype.toString.call(request) !== '[object Object]') {
    this.interceptors.request.rejected({
      errMsg: 'request:must be object'
    });
    return { request: false };
  }

  // 回调函数对象
  let _callback = {};
  // 去除回调的请求参数
  let _params = {};

  // 分离回调函数
  for (let item in request) {
    if (isCallback(item)) {
      _callback[item] = request[item];
    } else {
      _params[item] = request[item];
    }
  }

  // 拼接 url
  _params.url = requestUrl(this.config.baseUrl, request.url);

  if (!_params.url) {
    this.interceptors.request.rejected({
      errMsg: 'request:fail Missing required parameter `url`'
    });
    return { request: false };
  }

  // 拦截后的请求参数
  let params = this.interceptors.request.fulfilled({ ...this.config, ..._params });

  // 如果是 GET 请求 且有数据 则序列化数据并拼接在 url 上
  if (params.method === 'GET' && params.data) {
    const query = querystring.stringify(params.data);
    if (query) params.url = params.url + '?' + query;
  }

  // 拦截后的回调
  let callback = {};
  for (let item in _callback) {
    callback[item] = res => {
      _callback[item](handleResponse.call(this, res));
    }
  }

  return { request: params, callback };
}

/**
 * 对响应拦截再次处理
 * @param {object} response
 */
function handleResponse(response = {}) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return this.interceptors.response.fulfilled(response);
  } else {
    return this.interceptors.response.rejected(response);
  }
}

export { handleRequest, handleResponse };
