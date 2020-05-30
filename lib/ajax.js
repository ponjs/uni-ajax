import Interceptor from './interceptor';
import { requestUrl, isCallback } from './utils';

function handleRequest(request = {}) {
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
  const params = this.interceptors.request.fulfilled({ ...this.config, ..._params });

  // 拦截后的回调
  let callback = {};
  for (let item in _callback) {
    callback[item] = res => {
      _callback[item](handleResponse.call(this, res));
    }
  }

  return { request: params, callback };
}

function handleResponse(response = {}) {
  if (response.statusCode >= 200 && response.statusCode < 300) {
    return this.interceptors.response.fulfilled(response);
  } else {
    return this.interceptors.response.rejected(response);
  }
}

class UniAjax {
  constructor(params) {
    this.config = params;

    this.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };

    // 主方法挂载对应的 method 方法
    const method = ['GET', 'POST', 'PUT', 'DELETE'];
    for (let i = 0; i < method.length; i ++) {
      const _method = method[i];

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
      this.request[_method.toLowerCase()] = async (url = '', data = {}, options = {}) => {
        let _options = { url, data, method: _method };

        // 过滤参数 剔除 url data method success fail complete
        for (let item in options) {
          if (!isCallback(item) && !_options[item]) {
            _options[item] = options[item];
          }
        }

        // 参数不带函数 返回 Promise
        return this.request(_options);
      }
    }
  }

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
  async request(params) {
    const { request, callback } = handleRequest.call(this, params);
    // 如果请求拦截返回 false 终止请求
    if (!request) return;

    // 判断是否有回调参数 没有则返回 Promise
    if (Object.keys(callback).length) {
      return uni.request({ ...request, ...callback });
    } else {
      return new Promise(async (resolve, reject) => {
        const [err, res] = await uni.request(request);
        if (res) {
          resolve(handleResponse.call(this, res));
        } else {
          reject(handleResponse.call(this, err));
        }
      });
    }
  }
};

export default UniAjax;
