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
    return this.handlers.length - 1
  }
  forEach(fn) {
    for (let i = 0, l = this.handlers.length; i < l; i++) {
      if (this.handlers[i] !== null) {
        fn(this.handlers[i])
      }
    }
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }
}
