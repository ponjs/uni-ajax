import { detachRequest, cleanHeader, mergeHeader, requestUrl, type, merge, clone } from './utils';

/**
 * 请求错误
 * @param {string} err 错误信息
 * @returns {Promise} 返回 Promise reject
 */
async function requestRejected(errMsg) {
  const error = { errMsg };
  await this.request.interceptors.request.rejected(error);
  return Promise.reject(error);
}

/**
 * 对请求拦截再次处理
 * @param {object} request
 */
export async function handleRequest(request = {}) {
  // 判断参数是否为对象
  if (type(request) !== 'object') {
    return requestRejected.call(this, 'request:`request` must be Object');
  }

  // 分离请求对象
  let { callback, params, response } = detachRequest(request);

  // 拼接 url
  params.url = requestUrl(this.config.baseUrl, request.url);

  // 判断 url 是否传入
  if (!params.url) {
    return requestRejected.call(this, 'request:fail Missing required parameter `url`');
  }

  // 合并默认参数的请求头
  let config = clone(this.config);
  config.header = mergeHeader(params.method || config.method, config.header);

  // 拦截后的请求参数
  let _p = await this.request.interceptors.request.fulfilled(merge(config, params, { response }));

  // 清除多余的请求头
  _p.header = cleanHeader(_p.method, _p.header);

  // 拦截后的回调
  let _c = {};
  for (let k in callback) {
    _c[k] = async res => {
      callback[k](await handleResponse.call(this, { response, ...res }));
    };
  }

  return { request: _p, callback: _c, response };
}

/**
 * 对响应拦截再次处理
 * @param {object} response
 */
export async function handleResponse(response = {}) {
  const interceptor =
    response.statusCode >= 200 && response.statusCode < 300 ? 'fulfilled' : 'rejected';
  const result = await this.request.interceptors.response[interceptor](response);
  return result;
}
