/*!
 * uni-ajax v2.2.4
 * Developed by ponjs
 * https://github.com/ponjs/uni-ajax
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ajax = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class Interceptor {
    constructor() {
      this.fulfilled = res => res;

      this.rejected = err => err;
    }
    /**
     * 拦截器
     * @param {function} fulfilled 拦截成功
     * @param {function} rejected 拦截失败
     */


    use(fulfilled, rejected) {
      typeof fulfilled === 'function' && (this.fulfilled = fulfilled);
      typeof rejected === 'function' && (this.rejected = rejected);
    }

  }

  /**
   * 获取值的原始类型字符串，例如 [object Object]
   */
  const _toString = Object.prototype.toString;
  /**
   * 判断是否为数组
   * @param {*} val 要判断的值
   * @returns {boolean} 返回判断结果
   */

  function isArray(val) {
    return _toString.call(val) === '[object Array]';
  }
  /**
   * 判断是否为普通对象
   * @param {*} val 要判断的值
   * @returns {boolean} 返回判断结果
   */

  function isObject(val) {
    return _toString.call(val) === '[object Object]';
  }
  /**
   * 遍历
   * @param {object|array} obj 要迭代的对象
   * @param {function} fn 为每个项调用的回调
   */

  function forEach(obj, fn) {
    if (obj === null || obj === undefined) return;
    if (typeof obj !== 'object') obj = [obj];

    if (isArray(obj)) {
      for (let i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
      }
    } else {
      for (const k in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, k)) {
          fn.call(null, obj[k], k, obj);
        }
      }
    }
  }
  /**
   * 对象深合并
   * @param  {...object} args 对象
   * @returns {object} 合并后的对象
   */

  function merge(...args) {
    let result = {};

    for (let i = 0, l = args.length; i < l; i++) {
      isObject(args[i]) && forEach(args[i], (val, key) => result[key] = assign(result[key], val));
    }

    return result;
  }
  /**
   * 合并分配到目标对象
   * @param {*} target 目标对象
   * @param {*} source 源对象
   * @returns {*} 目标对象
   */

  function assign(target, source) {
    if (isObject(target) && isObject(source)) {
      return merge(target, source);
    } else if (isObject(source)) {
      return merge({}, source);
    } else if (isArray(source)) {
      return source.slice();
    }

    return source;
  }

  const METHOD = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'];
  const HEADER = ['common', ...METHOD];
  var defaults = {
    header: {},
    method: 'GET',
    timeout: 30000,
    dataType: 'json',
    responseType: 'text',
    sslVerify: true,
    withCredentials: false,
    firstIpv4: false,
    validateStatus: statusCode => statusCode >= 200 && statusCode < 300
  };
  forEach(HEADER, h => defaults.header[h] = {});

  /**
   * 分离请求对象
   * @param {string|object} [url] 请求地址 / 请求配置
   * @param {string|object} [data] 请求参数
   * @param {object} [config] 请求配置
   * @returns {object} 回调函数对象 去除回调的请求参数
   */

  function detachConfig(url, data, config) {
    // 回调函数对象
    let callback = {}; // 去除回调的请求参数对象

    let params = {}; // 请求参数对象

    const value = typeof url === 'string' ? { ...config,
      url,
      data
    } : url; // 分离请求参数

    forEach(value, (val, key) => {
      if (isCallback(key)) callback[key] = val;else params[key] = val;
    });
    return {
      callback,
      params
    };
  }
  /**
   * 合并请求配置（深度合并，且不合并 undefined 值）
   * @param {object} config1 前请求配置
   * @param {object} [config2] 后请求配置
   * @returns {object} 合并后的请求配置
   */

  function mergeConfig(config1, config2 = {}) {
    let config = {};
    const configKeys = Object.keys({ ...config1,
      ...config2
    });
    forEach(configKeys, prop => {
      if (config2[prop] !== undefined) {
        config[prop] = assign(config1[prop], config2[prop]);
      } else if (config1[prop] !== undefined) {
        config[prop] = assign(undefined, config1[prop]);
      }
    });
    return config;
  }
  /**
   * 判断参数是否含有回调参数 success / fail / complete 之一
   * @param {string} field 参数的 Key 值字符串
   * @returns {boolean} 返回判断值
   */

  function isCallback(field) {
    return ['success', 'fail', 'complete'].includes(field);
  }
  /**
   * 根据 baseURL 和 url 拼接
   * @param {string} baseURL 请求跟地址
   * @param {string} relativeURL 请求参数地址
   * @returns {string} 拼接后的地址
   */

  function combineURL(baseURL = '', relativeURL = '') {
    // 判断是否 http:// 或 https:// 开头
    if (/^https?:\/\//.test(relativeURL)) return relativeURL; // 去除 baseURL 结尾斜杠，去除 relativeURL 开头斜杠，再判断拼接

    return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL;
  }
  /**
   * 根据 baseURL 获取源地址
   * @param {string} baseURL 请求跟地址
   * @returns {string} 源地址
   */

  function originURL(baseURL = '') {
    // 判断是否 http:// 或 https:// 开头
    if (!/^https?:\/\//.test(baseURL)) return '';
    const u = baseURL.split('/');
    return u[0] + '//' + u[2];
  }

  /**
   * 处理请求前
   * @param {object} request 请求参数
   * @returns {object} 处理后的请求参数对象
   */

  async function handleRequest(request) {
    let params = mergeConfig(this.config, request); // 这里转大写是方便拦截器的相应操作

    params.method = params.method.toUpperCase(); // 拦截后的请求参数

    let config = await this.request.interceptors.request.fulfilled(params); // 判断请求拦截返回是否为对象

    if (!isObject(config)) {
      const error = await this.request.interceptors.request.rejected({
        config,
        errMsg: 'request:fail parameter'
      });
      return Promise.reject(error);
    } // 拼接 url


    config.url = combineURL(config.baseURL, config.url); // 请求方法转大写

    config.method = config.method.toUpperCase(); // 调整 header 优先级

    config.header = merge(config.header.common, config.header[config.method.toLowerCase()], config.header); // 清除多余的请求头

    forEach(HEADER, h => isObject(config.header[h]) && delete config.header[h]); // 清除回调函数

    forEach(config, (fn, key) => isCallback(key) && delete config[key]);
    return config;
  }
  /**
   * 处理响应后
   * @param {Object} response 处理响应参数
   * @param {object} response.config 请求配置
   * @param {object} response.callback 回调函数对象
   * @param {function} response.resolve Promise 的 resolve 方法
   * @param {function} response.reject Promise 的 reject 方法
   * @returns {function} 处理后的 complete 方法
   */

  function handleResponse({
    config,
    callback,
    ...promise
  }) {
    return async res => {
      var _callback$field, _callback$complete;

      try {
        // 根据状态码判断要执行的回调和拦截器
        const state = !config.validateStatus || config.validateStatus(res.statusCode) ? 'fulfilled' : 'rejected';
        var result = await this.request.interceptors.response[state]({
          config,
          ...res
        });
        var field = state === 'fulfilled' ? 'success' : 'fail';
      } catch (error) {
        // 拦截器返回错误
        result = error;
        field = 'fail';
      } // 请求参数没有回调函数


      if (!Object.keys(callback).length) {
        return promise[field === 'success' ? 'resolve' : 'reject'](result);
      } // 执行回调函数


      (_callback$field = callback[field]) === null || _callback$field === void 0 ? void 0 : _callback$field.call(callback, result);
      (_callback$complete = callback.complete) === null || _callback$complete === void 0 ? void 0 : _callback$complete.call(callback, result);
    };
  }

  class Ajax {
    constructor(_config) {
      _defineProperty(this, "request", (...args) => {
        // 分类请求参数
        const {
          callback,
          params
        } = detachConfig(...args); // 回调函数字段

        const fields = Object.keys(callback); // 定义 RequestTask 所需字段

        let requestTask, aborted, onHeadRcvd, offHeadRcvd; // 继承 Promise 封装 RequestTask 的一些方法

        class Request extends Promise {
          // 中断请求任务
          abort() {
            var _requestTask;

            aborted = true;
            (_requestTask = requestTask) === null || _requestTask === void 0 ? void 0 : _requestTask.abort();
            return this;
          } // 监听 HTTP Response Header 事件


          onHeadersReceived(fn) {
            var _requestTask2, _requestTask2$onHeade;

            onHeadRcvd = fn;
            (_requestTask2 = requestTask) === null || _requestTask2 === void 0 ? void 0 : (_requestTask2$onHeade = _requestTask2.onHeadersReceived) === null || _requestTask2$onHeade === void 0 ? void 0 : _requestTask2$onHeade.call(_requestTask2, fn);
            return this;
          } // 取消监听 HTTP Response Header 事件


          offHeadersReceived(fn) {
            var _requestTask3, _requestTask3$offHead;

            offHeadRcvd = fn;
            (_requestTask3 = requestTask) === null || _requestTask3 === void 0 ? void 0 : (_requestTask3$offHead = _requestTask3.offHeadersReceived) === null || _requestTask3$offHead === void 0 ? void 0 : _requestTask3$offHead.call(_requestTask3, fn);
            return this;
          }

        }

        return new Request(async (resolve, reject) => {
          var _requestTask$onHeader, _requestTask4, _requestTask$offHeade, _requestTask5;

          // 统一处理请求错误
          try {
            // 请求拦截后的配置
            var config = await handleRequest.call(this, params);
          } catch (error) {
            var _callback$fail, _callback$complete;

            // 如果有回调参数 执行 fail / complete
            (_callback$fail = callback.fail) === null || _callback$fail === void 0 ? void 0 : _callback$fail.call(callback, error);
            (_callback$complete = callback.complete) === null || _callback$complete === void 0 ? void 0 : _callback$complete.call(callback, error); // 没有回调参数时抛出请求错误

            return !fields.length && reject(error);
          } // 接口调用结束的回调函数


          const complete = handleResponse.call(this, {
            config,
            callback,
            resolve,
            reject
          }); // 判断是否被取消请求

          if (aborted) return complete({
            errMsg: 'request:fail abort'
          }); // 发起请求

          requestTask = uni.request({ ...config,
            complete
          }); // 根据配置的 xhr 属性执行获取 requestTask

          typeof config.xhr === 'function' && config.xhr(requestTask, config); // 当传入 success / fail / complete 之一时，返回 requestTask 对象

          fields.length && resolve(requestTask); // 判断是否执行监听 HTTP Response Header 事件

          onHeadRcvd && ((_requestTask$onHeader = (_requestTask4 = requestTask).onHeadersReceived) === null || _requestTask$onHeader === void 0 ? void 0 : _requestTask$onHeader.call(_requestTask4, onHeadRcvd));
          offHeadRcvd && ((_requestTask$offHeade = (_requestTask5 = requestTask).offHeadersReceived) === null || _requestTask$offHeade === void 0 ? void 0 : _requestTask$offHeade.call(_requestTask5, offHeadRcvd));
        });
      });

      // 合并请求配置赋值到实例配置
      this.config = mergeConfig(defaults, _config); // 挂载拦截器

      this.request.interceptors = {
        request: new Interceptor(),
        response: new Interceptor()
      }; // 挂载接口根地址 baseURL

      this.request.baseURL = this.config.baseURL || ''; // 挂载接口根地址的源地址 origin

      this.request.origin = originURL(this.config.baseURL); // 挂载修改 config 方法

      this.request.config = fn => this.config = fn(this.config); // 挂载对应的 method 方法


      forEach(METHOD, method => {
        this.request[method] = (url, data, config) => this.request(...(typeof url === 'string' ? [url, data, { ...config,
          method
        }] : [{ ...url,
          method
        }]));
      });
    }

  }

  function createInstance(defaultConfig) {
    return new Ajax(defaultConfig).request;
  }

  const ajax = createInstance();

  ajax.create = function create(instanceConfig) {
    return createInstance(instanceConfig);
  };

  return ajax;

})));
