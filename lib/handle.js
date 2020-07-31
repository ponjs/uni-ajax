import { detachRequest, cleanHeader, requestUrl, retType, merge } from './utils';

/**
 * 对请求拦截再次处理
 * @param {object} request
 */
async function handleRequest(request = {}) {
  // 判断参数是否为对象
  if (retType(request) !== 'object') {
    const errMsg = { errMsg: 'request:`request` must be Object' };
    await this.interceptors.request.rejected(errMsg);
    return Promise.reject(errMsg);
  }

  // 分离请求对象
  let { callback: _callback, params: _params, response } = detachRequest(request);

  // 拼接 url
  _params.url = requestUrl(this.config.baseUrl, request.url);

  if (!_params.url) {
    const errMsg = { errMsg: 'request:fail Missing required parameter `url`' };
    await this.interceptors.request.rejected(errMsg);
    return Promise.reject(errMsg);
  }

  // 拦截后的请求参数
  let params = await this.interceptors.request.fulfilled(merge(this.config, _params, { response }));

  // 清除多余的请求头
  params.header = cleanHeader(params.method.toLowerCase(), params.header);

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
