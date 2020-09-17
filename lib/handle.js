import { detachRequest, cleanHeader, mergeHeader, requestUrl, merge, clone, type } from './utils';

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
 * 拦截后的回调
 * @param {object} callback 回调函数对象
 * @param {object} response 传递给响应拦截的值
 * @returns {function} 处理后的 complete 方法
 */
function handleComplete(callback = {}, response = {}) {
  return async res => {
    const _r = await handleResponse.call(this, { response, ...res });
    const _c = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'fail';

    const fields = Object.keys(callback);
    if (fields.includes(_c)) (async () => callback[_c](_r))();
    if (fields.includes('complete')) (async () => callback.complete(_r))();
  };
}

/**
 * 对请求拦截再次处理
 * @param {object} request
 * @returns {object} 处理后的请求对象
 */
export async function handleRequest(request = {}) {
  // 判断参数是否为对象
  if (type(request) !== 'object') {
    return requestRejected.call(this, 'request:`request` must be Object');
  }

  // 分离请求对象
  let { callback, params, response } = detachRequest(request);

  // 拼接 url
  params.url = requestUrl(this.config.baseURL, request.url);

  // 判断拼接后的 url 是否存在
  if (!params.url) {
    return requestRejected.call(this, 'request:fail Missing required parameter `url`');
  }

  // 合并默认参数的请求头
  let config = clone(this.config);
  config.header = mergeHeader(params.method || config.method, config.header);

  // 拦截后的请求参数
  let _p = await this.request.interceptors.request.fulfilled(merge(config, params, { response }));

  // 判断请求拦截返回是否为对象
  if (type(_p) !== 'object') {
    return requestRejected.call(this, 'request:interrupted by `requested interceptor`');
  }

  // 清除多余的请求头
  _p.header = cleanHeader(_p.method, _p.header);

  return {
    response,
    request: _p,
    complete: handleComplete.call(this, callback, response)
  };
}

/**
 * 对响应拦截再次处理
 * @param {object} response
 * @returns {object} 处理后的响应对象
 */
export async function handleResponse(response = {}) {
  const interceptor =
    response.statusCode >= 200 && response.statusCode < 300 ? 'fulfilled' : 'rejected';
  const result = await this.request.interceptors.response[interceptor](response);
  return result;
}
