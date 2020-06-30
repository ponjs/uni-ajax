class Interceptor {
  constructor() {
    this.fulfilled = async res => res;
    this.rejected = async err => err;
  }
  /**
   *
   * @param {function} fulfilled
   * @param {function} rejected
   */
  use(fulfilled, rejected) {
    if (typeof fulfilled === 'function') {
      this.fulfilled = fulfilled;
    }
    if (typeof rejected === 'function') {
      this.rejected = rejected;
    }
  }
};

export default Interceptor;
