// 根据 baseUrl 和 url 拼接 url
function requestUrl(baseUrl = '', url = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(url)) return url;

  // 判断 baseUrl 是否 / 结尾 有则去除
  baseUrl = baseUrl.replace(/\/$/, '');
  // 判断 url 是否 / 开头 有则去除
  url = url.replace(/^\//, '');

  return baseUrl + '/' + url;
}

// 判断参数是否含有回调参数 success / fail / complete
function isCallback(field) {
  return ['success', 'fail', 'complete'].includes(field);
}

// 根据 baseUrl 获取地址源
function urlOrigin(baseUrl = '') {
  // 判断是否 http:// 或 https:// 开头
  if (!/^https?:\/\//.test(baseUrl)) return '';
  const u = baseUrl.split('/');
  return u[0] + '//' + u[2];
}

// 返回数据类型
function retType(val) {
  const type = typeof val;
  if (type !== 'object') return type;

  let temp = Object.prototype.toString.call(val).split(' ')[1] || '';
  return temp.substr(0, temp.length - 1).toLowerCase();
}

export {
  requestUrl,
  isCallback,
  urlOrigin,
  retType
};
