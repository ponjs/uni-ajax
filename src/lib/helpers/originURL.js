/**
 * 根据 baseURL 获取源地址
 * @param {string} baseURL 请求跟地址
 * @returns {string} 源地址
 */
export default function originURL(baseURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (!/^https?:\/\//.test(baseURL)) return ''
  const u = baseURL.split('/')
  return u[0] + '//' + u[2]
}
