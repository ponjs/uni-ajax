import { forEach, isArray } from '../utils'

/**
 * 根据 baseURL 和 url 拼接
 * @param {string} baseURL 请求根地址
 * @param {string} relativeURL 请求参数地址
 * @returns {string} 拼接后的地址
 */
function combineURL(baseURL = '', relativeURL = '') {
  // 判断是否 http:// 或 https:// 开头
  if (/^https?:\/\//.test(relativeURL)) return relativeURL
  // 去除 baseURL 结尾斜杠，去除 relativeURL 开头斜杠，再判断拼接
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

/**
 * 根据 baseURL、url、params 编译请求URL
 * @param {string} baseURL 请求根地址
 * @param {string} relativeURL 请求参数地址
 * @param {*} params URL参数
 * @returns {string} 处理后的地址
 */
export default function buildURL(baseURL, relativeURL, params) {
  let url = combineURL(baseURL, relativeURL)

  if (!params) return url

  let query

  const parts = []
  forEach(params, (val, key) => {
    if (val === null || typeof val === 'undefined') return

    if (isArray(val)) key = key + '[]'
    else val = [val]

    forEach(val, v => {
      if (v !== null && typeof v === 'object') {
        v = JSON.stringify(v)
      }
      parts.push(encode(key) + '=' + encode(v))
    })
  })
  query = parts.join('&')

  if (query) {
    const hashmarkIndex = url.indexOf('#')
    hashmarkIndex !== -1 && (url = url.slice(0, hashmarkIndex))
    url += (url.indexOf('?') === -1 ? '?' : '&') + query
  }

  return url
}
