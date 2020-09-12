export const METHOD = ['get', 'post', 'put', 'delete', 'connect', 'head', 'options', 'trace'];

let config = {
  method: 'GET',
  timeout: 30000,
  dataType: 'json',
  responseType: 'text',
  sslVerify: true,
  withCredentials: false,
  firstIpv4: false,
  header: {}
};

// 给请求头加上对应的请求方式 用于请求拦截器中给请求方式加上请求头
for (let i = 0; i < METHOD.length; i++) {
  config.header[METHOD[i]] = {};
}

export default config;
