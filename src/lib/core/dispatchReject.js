/**
 * 派发请求拒绝方法，处理发起请求前错误，防止进入响应拦截器
 * @param {*} reason 错误原因
 * @returns {Promise} 封装了 __REJECTED__ 的失败对象
 */
export default function dispatchReject(reason) {
  return Promise.reject({
    reason,
    __REJECTED__: true
  })
}
