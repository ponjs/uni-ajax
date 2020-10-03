import { detachRequest, cleanHeader, mergeHeader, combineURL, merge, clone, type } from './utils';

/**
 * 请求错误
 * @param {string} errMsg 错误信息
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
    let result, field;

    try {
      result = await handleResponse.call(this, { response, ...res });
      field = res.statusCode >= 200 && res.statusCode < 300 ? 'success' : 'fail';
    } catch (error) {
      result = error;
      field = 'fail';
    }

    const fields = Object.keys(callback);
    if (fields.includes(field)) (async () => callback[field](result))(); // success / fail
    if (fields.includes('complete')) (async () => callback.complete(result))(); // complete
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
  params.url = combineURL(this.config.baseURL, request.url);

  // 判断拼接后的 url 是否存在
  if (!params.url) {
    return requestRejected.call(this, 'request:fail Missing required parameter `url`');
  }

  // 合并默认参数的请求头
  let config = clone(this.config);
  config.header = mergeHeader(params.method || config.method, config.header);

  // 拦截后的请求参数
  let result = await this.request.interceptors.request.fulfilled(
    merge(config, params, { response })
  );

  // 判断请求拦截返回是否为对象
  if (type(result) !== 'object') {
    return requestRejected.call(this, 'request:interrupted by `requested interceptor`');
  }

  // 清除多余的请求头
  result.header = cleanHeader(result.method, result.header);

  return {
    response,
    request: result,
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
  return this.request.interceptors.response[interceptor](response);
}
