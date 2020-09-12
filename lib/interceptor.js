class Interceptor {
  constructor() {
    this.fulfilled = async res => res;
    this.rejected = async err => err;
  }
  /**
   * 拦截器
   * @param {function} fulfilled 请求拦截
   * @param {function} rejected 响应拦截
   */
  use(fulfilled, rejected) {
    if (typeof fulfilled === 'function') {
      this.fulfilled = fulfilled;
    }
    if (typeof rejected === 'function') {
      this.rejected = rejected;
    }
  }
}

export default Interceptor;
