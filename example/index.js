import ajax from 'uni-ajax';

// Default configuration
const _ajax = ajax.create({
  // baseURL: 'https://example.com/'
});

_ajax.interceptors.request.use(
  request => {
    // Do something before request is sent
    return request;
  },
  error => {
    // Do something with request error
    return error;
  }
);

_ajax.interceptors.response.use(
  response => {
    // Do something with response data
    return response;
  },
  error => {
    // Do something with response error
    return error;
  }
);

export default _ajax;
