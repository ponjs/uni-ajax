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

    result[method.toLowerCase()] = (url = '', data = {}, options = {}) =>
      typeof url === 'string' ? fn(url, data, { ...options, method }) : fn(url);
  }
  return result;
}
