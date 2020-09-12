import { isCallback } from './utils';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

/**
 * 给请求方法加上对应的请求方式
 * @param {function} fn 请求方法
 * @returns {object} 返回请求方式对象
 */
export default function forEachMethod(fn) {
  let result = {};
  for (let i = 0; i < methods.length; i++) {
    const method = methods[i];

    /**
     *
     * @param {string} [url] 请求地址
     * @param {(object|string)} [data] 请求参数
     * @param {object} [options] 其他配置
     * @param {object} [options.header] 设置请求的 header，header 中不能设置 Referer
     * @param {number} [options.timeout] 超时时间，单位 ms
     * @param {string} [options.dataType] 如果设为 json，会尝试对返回的数据做一次 JSON.parse
     * @param {string} [options.responseType] 设置响应的数据类型。合法值：text、arraybuffer
     * @param {boolean} [options.sslVerify] 验证 ssl 证书
     * @param {boolean} [options.withCredentials] 跨域请求时是否携带凭证（cookies）
     * @param {object} [params.response] 响应拦截器可以接收到的参数
     * @returns {promise} 返回请求的 Promise 对象
     */
    result[method.toLowerCase()] = async (url = '', data = {}, options = {}) => {
      let config = { url, data, method };

      // 过滤参数 剔除 url data method success fail complete
      for (let k in options) {
        if (!isCallback(k) && !config[k]) {
          config[k] = options[k];
        }
      }

      // 参数不带函数 返回 Promise
      return fn(config);
    };
  }
  return result;
}
