const PROMISE = Symbol('$$promise')

export default class Fetcher {
  get [Symbol.toStringTag]() {
    return '[object Fetcher]'
  }

  constructor() {
    this[PROMISE] = new Promise((resolve, reject) => {
      this.resolve = resolve
      this.reject = reject
    })
  }

  async source() {
    return this[PROMISE]
  }

  aborted = false
  async abort() {
    this.aborted = true
    ;(await this.source())?.abort()
  }
}
