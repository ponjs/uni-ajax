import Interceptor from './interceptor';
import forEachMethod from './method';
import defaults from './defaults';
import { urlOrigin, merge } from './utils';
import { handleRequest, handleResponse } from './handle';

class UniAjax {
  constructor(params = {}) {
    this.config = merge(defaults, params);

    // 修改 this 指向
    this.request = this.request.bind(this);

    // 主方法挂载拦截器
    this.request.interceptors = {
      request: new Interceptor(),
      response: new Interceptor()
    };

    // 主方法挂载接口根地址 baseUrl
    this.request.baseUrl = this.config.baseUrl || '';
    // 主方法挂载接口根地址的源地址 origin
    this.request.origin = urlOrigin(this.config.baseUrl);

    // 主方法挂载对应的 method 方法
    const methods = forEachMethod(this.request);
    for (let k in methods) {
      this.request[k] = methods[k];
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
   * @param {object} [params.response] 响应拦截器可以接收到的参数
   * @returns {(object|Promise)} 当参数有 success / fail / complete 之一时返回 requestTask 对象，则返回 Promise 对象
   */
  async request(params = {}) {
    const { request, callback, response } = await handleRequest.call(this, params);
    // 如果请求拦截返回 false 终止请求
    if (!request) return;

    // 判断是否有回调参数 没有则返回 Promise
    if (Object.keys(callback).length) {
      return uni.request({ ...request, ...callback });
    } else {
      return new Promise(async (resolve, reject) => {
        const [err, res] = await uni.request(request);
        const result = await handleResponse.call(this, {
          response,
          ...(res || err)
        });
        if (res) resolve(result);
        else reject(result);
      });
    }
  }
}

export default UniAjax;
