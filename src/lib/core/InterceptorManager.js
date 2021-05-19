/**
 * 拦截器类
 */
export default class InterceptorManager {
  handlers = []

  constructor() {
    this.forEach = {
      asc: fn => {
        for (let i = 0, l = this.handlers.length; i < l; i++) {
          this.handlers[i] !== null && fn(this.handlers[i])
        }
      },
      desc: fn => {
        for (let i = this.handlers.length - 1; i >= 0; i--) {
          this.handlers[i] !== null && fn(this.handlers[i])
        }
      }
    }
  }

  use(fulfilled, rejected) {
    this.handlers.push({
      fulfilled,
      rejected
    })
    return this.handlers.length - 1
  }
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }
}
