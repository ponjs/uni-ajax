import { METHOD } from './defaults';

/**
 * 分离请求对象
 * @param {object} request 请求对象
 * @returns {object} 回调函数对象 去除回调的请求参数 传递给响应拦截器参数 构成的对象
 */
function detachRequest(request) {
  // 回调函数对象
  let callback = {};
  // 去除回调的请求参数
  let params = {};
  // 请求前传递给响应拦截器参数
  let response = {};

  for (const k in request) {
    if (isCallback(k)) {
      callback[k] = request[k];
    } else if (k === 'response') {
      response = request[k];
    } else {
      params[k] = request[k];
    }
  }

  return { callback, params, response };
}

/**
 * 清除多余的请求头
 * @param {string} method 请求方式
 * @param {object} header 请求头
 * @returns {object} 处理后的请求头
 */
function cleanHeader(method, header = {}) {
  let result = mergeHeader(method, header);

  for (let i = 0; i < METHOD.length; i++) {
    delete result[METHOD[i]];
  }
  return result;
}

/**
 * 合并请求头
 * @param {string} method 请求方式
 * @param {object} header 请求头
 * @returns {object} 处理后的请求头
 */
function mergeHeader(method, header = {}) {
  return merge(header || {}, header[method.toLowerCase()] || {});
}

/**
 * 根据 baseURL 和 url 拼接 url
 * @param {string} baseURL 请求跟地址
 * @param {string} url 请求参数地址
 * @returns {string} 拼接后的地址
 */
function requestUrl(baseURL = '', url = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(url)) return url;

  // 判断 baseURL 是否 / 结尾 有则去除
  baseURL = baseURL.replace(/\/+$/, '');
  // 判断 url 是否 / 开头 有则去除
  url = url.replace(/^\/+/, '');

  return baseURL + '/' + url;
}

/**
 * 判断参数是否含有回调参数 success / fail / complete
 * @param {string} field 参数的 Key 值字符串
 * @returns {boolean} 返回判断值
 */
function isCallback(field) {
  return ['success', 'fail', 'complete'].includes(field);
}

/**
 * 根据 baseURL 获取源地址
 * @param {string} baseURL 请求跟地址
 * @returns {string} 源地址
 */
function urlOrigin(baseURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (!/^https?:\/\//.test(baseURL)) return '';
  const u = baseURL.split('/');
  return u[0] + '//' + u[2];
}

/**
 * 对象深合并
 * @param  {...any}  对象
 * @returns {object} 合并后的对象
 */
function merge(...arg) {
  let result = {};
  for (let i = 0; i < arg.length; i++) {
    for (const k in arg[i]) {
      if (arg[i].hasOwnProperty(k)) {
        const val = arg[i][k];
        if (typeof result[k] === 'object' && typeof val === 'object') {
          result[k] = merge(result[k], val);
        } else {
          result[k] = val;
        }
      }
    }
  }
  return result;
}

/**
 * 对象深拷贝
 * @param {object} obj 对象
 * @returns {object} 拷贝后的对象
 */
function clone(obj) {
  // 原始类型直接返回
  if (typeof obj !== 'object' && typeof obj !== 'function') return obj;
  let result = type(obj) === 'array' ? [] : {};
  for (const i in obj) {
    if (obj.hasOwnProperty(i)) {
      result[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
    }
  }
  return result;
}

/**
 * 返回数据类型
 * @param {any} val 需要判断的值
 * @returns {string} 数据类型字符串 (英文小写)
 */
function type(val) {
  const t = typeof val;
  if (t !== 'object') return t;

  let temp = Object.prototype.toString.call(val).split(' ')[1] || '';
  return temp.substr(0, temp.length - 1).toLowerCase();
}

export {
  detachRequest,
  cleanHeader,
  mergeHeader,
  requestUrl,
  isCallback,
  urlOrigin,
  merge,
  clone,
  type
};
