import { forEach } from './utils'

export const METHOD = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace']
export const HEADER = [...METHOD, 'common']

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
}

forEach(HEADER, header => (defaults.header[header] = {}))

export default defaults
