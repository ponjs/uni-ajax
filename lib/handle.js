import { requestUrl, isCallback, retType } from './utils';

/**
 * 对请求拦截再次处理
 * @param {object} request
 */
async function handleRequest(request = {}) {
  // 判断参数是否为对象
  if (retType(request) !== 'object') {
    await this.interceptors.request.rejected({
      errMsg: 'request:must be object'
    });
    return { request: false };
  }

  // 回调函数对象
  let _callback = {};
  // 去除回调的请求参数
  let _params = {};
  // 请求前传递给响应拦截器参数
  let response = {};

  // 分离请求对象
  for (let item in request) {
    if (isCallback(item)) {
      _callback[item] = request[item];
    } else if (item === 'response') {
      response = request[item];
    } else {
      _params[item] = request[item];
    }
  }

  // 拼接 url
  _params.url = requestUrl(this.config.baseUrl, request.url);

  if (!_params.url) {
    await this.interceptors.request.rejected({
      errMsg: 'request:fail Missing required parameter `url`'
    });
    return { request: false };
  }

  // 拦截后的请求参数
  let params = await this.interceptors.request.fulfilled({ ...this.config, ..._params, response });

  // 拦截后的回调
  let callback = {};
  for (let item in _callback) {
    callback[item] = async res => {
      _callback[item](await handleResponse.call(this, { response, ...res }));
    }
  }

  return { request: params, callback, response };
}

/**
 * 对响应拦截再次处理
 * @param {object} response
 */
async function handleResponse(response = {}) {
  const interceptor = response.statusCode >= 200 && response.statusCode < 300 ? 'fulfilled' : 'rejected';
  const result = await this.interceptors.response[interceptor](response);
  return result;
}

export { handleRequest, handleResponse };
