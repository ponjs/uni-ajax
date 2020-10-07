import { METHOD } from './defaults';
import { forEach, merge, type } from './utils';
import { cleanHeader, combineURL, detachRequest, isCallback } from './helpers';

/**
 * 请求错误
 * @param {object} config 请求配置
 * @param {string} errMsg 错误信息
 * @returns {Promise} 返回 Promise reject
 */
export async function requestRejected(config, errMsg) {
  const error = { config, errMsg };
  await this.request.interceptors.request.rejected(error);
  return Promise.reject(error);
}

/**
 * 处理请求前
 * @param {object} params 请求参数
 * @returns {object} 处理后的请求参数对象
 */
export async function handleRequest(params) {
  params = merge(this.config, params);
  params.url = combineURL(this.config.baseURL, params.url);
  params.method = params.method.toUpperCase();
  params.header = merge(params.header[params.method.toLowerCase()] || {}, params.header || {});

  // 判断拼接后的 url 是否存在
  if (type(params.url) !== 'string') {
    return requestRejected.call(this, params, 'request:fail Missing required parameter `url`');
  }

  // 给请求头加上对应的请求方式 用于请求拦截器中给请求方式加上请求头
  forEach(METHOD, ele => (params.header[ele] = {}));

  // 拦截后的请求参数
  let config = await this.request.interceptors.request.fulfilled(params);

  // 判断请求拦截返回是否为对象
  if (type(config) !== 'object') {
    return requestRejected.call(this, config, 'request:fail interrupted');
  }

  // 清除多余的请求头
  config.header = cleanHeader(config.method, config.header);

  // 清除回调函数
  forEach(config, (ele, k) => isCallback(k) && delete config[k]);

  return config;
}

/**
 * 拦截后的回调
 * @param {object} config 请求配置
 * @param {object} callback 回调函数对象
 * @param {function} resolve Promise 的 resolve 方法
 * @param {function} reject Promise 的 reject 方法
 * @returns {function} 处理后的 complete 方法
 */
export function handleResponse(config, callback, resolve, reject) {
  return async res => {
    try {
      // 根据状态码判断要执行的方法和拦截器
      const interceptor = res.statusCode >= 200 && res.statusCode < 300 ? 'fulfilled' : 'rejected';
      var result = await this.request.interceptors.response[interceptor]({ config, ...res });
      var field = interceptor === 'fulfilled' ? 'success' : 'fail';
    } catch (error) {
      // 拦截器返回错误
      result = error;
      field = 'fail';
    }

    const fields = Object.keys(callback);
    // 请求参数没有回调函数
    if (!fields.length) return field === 'success' ? resolve(result) : reject(result);
    // 异步执行回调函数
    if (fields.includes(field)) (async () => callback[field](result))();
    if (fields.includes('complete')) (async () => callback.complete(result))();
  };
}
