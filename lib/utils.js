const METHOD = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'];

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

  for (let key in request) {
    if (isCallback(key)) {
      callback[key] = request[key];
    } else if (key === 'response') {
      response = request[key];
    } else {
      params[key] = request[key];
    }
  }

  // 给请求头加上对应的请求方式
  params.header = { ...params.header || {} };
  for (let i = 0; i < METHOD.length; i ++) {
    if (!params.header.hasOwnProperty(METHOD[i])) {
      params.header[METHOD[i]] = { ...params.header[METHOD[i]] || {}};
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

  for (let i = 0; i < METHOD.length; i ++) {
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
  return merge(
    header || {},
    header[method.toLowerCase()] || {}
  );
}

/**
 * 根据 baseUrl 和 url 拼接 url
 * @param {string} baseUrl 请求跟地址
 * @param {string} url 请求参数地址
 * @returns {string} 拼接后的地址
 */
function requestUrl(baseUrl = '', url = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(url)) return url;

  // 判断 baseUrl 是否 / 结尾 有则去除
  baseUrl = baseUrl.replace(/\/+$/, '');
  // 判断 url 是否 / 开头 有则去除
  url = url.replace(/^\/+/, '');

  return baseUrl + '/' + url;
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
 * 根据 baseUrl 获取源地址
 * @param {string} baseUrl 请求跟地址
 * @returns {string} 源地址
 */
function urlOrigin(baseUrl = '') {
  // 判断是否 http:// 或 https:// 开头
  if (!/^https?:\/\//.test(baseUrl)) return '';
  const u = baseUrl.split('/');
  return u[0] + '//' + u[2];
}

/**
 * 返回数据类型
 * @param {any} val 需要判断的值
 * @returns {string} 数据类型字符串 (英文小写)
 */
function retType(val) {
  const type = typeof val;
  if (type !== 'object') return type;

  let temp = Object.prototype.toString.call(val).split(' ')[1] || '';
  return temp.substr(0, temp.length - 1).toLowerCase();
}

/**
 * 对象深合并
 * @param  {...any}  对象
 * @returns {object} 合并后的对象
 */
function merge(...arg) {
  let result = {};
  for (let i = 0; i < arg.length; i ++) {
    for (let key in arg[i]) {
      if (arg[i].hasOwnProperty(key)) {
        const val = arg[i][key];
        if (typeof result[key] === 'object' && typeof val === 'object') {
          result[key] = merge(result[key], val);
        } else {
          result[key] = val;
        }
      }
    }
  }
  return result;
}

/**
 * 对象深拷贝
 * @param {object} obj 对象
 * @returns 拷贝后的对象
 */
function clone(obj) {
  // 原始类型直接返回
  if(typeof obj !== 'object' && typeof obj !== 'function') return obj;
  let result = retType(obj) === 'array' ? [] : {};
  for(let i in obj) {
    if(obj.hasOwnProperty(i)){
      result[i] = typeof obj[i] === 'object' ? clone(obj[i]) : obj[i];
    }
  }
  return result;
}

export {
  detachRequest,
  cleanHeader,
  mergeHeader,
  requestUrl,
  isCallback,
  urlOrigin,
  retType,
  merge,
  clone
};
