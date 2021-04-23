/**
 * 根据 baseURL 和 url 拼接
 * @param {string} baseURL 请求跟地址
 * @param {string} relativeURL 请求参数地址
 * @returns {string} 拼接后的地址
 */
export default function combineURL(baseURL = '', relativeURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(relativeURL)) return relativeURL
  // 去除 baseURL 结尾斜杠，去除 relativeURL 开头斜杠，再判断拼接
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}
