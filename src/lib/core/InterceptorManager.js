/**
 * 拦截器类
 */
export default class InterceptorManager {
  handlers = []
  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    })
  }
  forEach(fn) {
    for (let i = 0, l = this.handlers.length; i < l; i++) {
      fn(this.handlers[i])
    }
  }
}
