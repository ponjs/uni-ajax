import Interceptor from './interceptor';
import forEachMethod from './method';
import defaults from './defaults';
import { urlOrigin, merge, isCallback } from './utils';
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

    // 主方法挂载接口根地址 baseURL
    this.request.baseURL = this.config.baseURL || '';
    // 主方法挂载接口根地址的源地址 origin
    this.request.origin = urlOrigin(this.config.baseURL);

    // 主方法挂载对应的 method 方法
    const methods = forEachMethod(this.request);
    for (const k in methods) {
      this.request[k] = methods[k];
    }
  }

  async request(url = '', data = {}, options = {}) {
    let params = {};
    // 判断第一个参数是字符串还是对象
    if (typeof url === 'string') {
      params = { url, data, method: options.method || this.config.method };

      // 过滤参数 剔除 url data method success fail complete
      for (const k in options) {
        if (!isCallback(k) && !params.hasOwnProperty(k)) {
          params[k] = options[k];
        }
      }
    } else {
      params = { ...url };
    }

    const { response, request, complete } = await handleRequest.call(this, params);
    // 判断判断第一个参数是否为对象 如果是则返回 Task 没有则返回 Promise
    if (typeof url === 'object') {
      return uni.request({ ...request, complete });
    } else {
      return new Promise(async (resolve, reject) => {
        const [err, res] = await uni.request(request);
        handleResponse
          .call(this, {
            response,
            ...(res || err)
          })
          .then(result => {
            if (res) resolve(result);
            else reject(result);
          })
          .catch(reject);
      });
    }
  }
}

export default UniAjax;
