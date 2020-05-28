import createAjax from 'uni-ajax';

// Default configuration
const ajax = createAjax({
  // baseUrl: 'https://example.com/',
  // header: {
  //   'Content-Type': 'application/x-www-form-urlencoded'
  // },
  // method: 'POST'
});

ajax.interceptors.request.use(request => {
  // Do something before request is sent
  return request;
}, error => {
  // Do something with request error
  return error;
});

ajax.interceptors.response.use(response => {
  // Do something with response data
  return response;
}, error => {
  // Do something with response error
  return error;
});

const request = ajax.request;

export default request;
