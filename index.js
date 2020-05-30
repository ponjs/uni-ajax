import UniAjax from './lib/ajax';

/**
 *
 * @param {object} params
 * @param {string} params.baseUrl 请求地址的根域名
 * @param {object} [params.header] 设置请求的 header，header 中不能设置 Referer
 * @param {string} [params.method] 请求协议，必须大写
 * @param {number} [params.timeout] 超时时间，单位 ms
 * @param {string} [params.dataType] 如果设为 json，会尝试对返回的数据做一次 JSON.parse
 * @param {string} [params.responseType] 设置响应的数据类型。合法值：text、arraybuffer
 * @param {boolean} [params.sslVerify] 验证 ssl 证书
 * @param {boolean} [params.withCredentials] 跨域请求时是否携带凭证（cookies）
 */
function createInstance(params) {
  const context = new UniAjax(params);

  const request = context.request;

  context.request = function(params) {
    return request.call(context, params);
  };

  for (let item in request) {
    context.request[item] = request[item];
  }

  return context;
}

export default createInstance;
