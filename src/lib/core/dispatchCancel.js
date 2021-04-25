/**
 * 派发请求拒绝方法，处理发起请求前错误，取消执行请求，并防止进入响应拦截器
 * @param {*} reason 错误原因
 * @returns {Promise} 封装了 __CANCEL__ 的失败对象
 */
export default function dispatchCancel(reason) {
  return Promise.reject({
    reason,
    __CANCEL__: true
  })
}
