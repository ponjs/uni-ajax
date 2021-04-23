import { forEach, isArray } from '../utils'

/**
 * 根据params编译请求URL
 * @param {string} url 请求URL
 * @param {*} params URL参数
 */
export default function buildURL(url, params) {
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

function encode(val) {
  return encodeURIComponent(val)
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}
