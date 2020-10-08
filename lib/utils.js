/**
 * 遍历
 * @param {object|array} obj 要迭代的对象
 * @param {function} fn 为每个项调用的回调
 */
export function forEach(obj, fn) {
  if (obj === null || typeof obj === 'undefined') return;
  if (typeof obj !== 'object') obj = [obj];
  if (type(obj) === 'array') {
    for (let i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    for (const k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        fn.call(null, obj[k], k, obj);
      }
    }
  }
}

/**
 * 对象深合并
 * @param  {...any} 对象
 * @returns {object} 合并后的对象
 */
export function merge(...arg) {
  let result = {};

  for (let i = 0, l = arg.length; i < l; i++) {
    forEach(
      arg[i] || {},
      (val, key) =>
        (result[key] =
          typeof result[key] === 'object' && typeof val === 'object'
            ? merge(result[key], val)
            : val)
    );
  }
  return result;
}

/**
 * 返回数据类型
 * @param {any} val 需要判断的值
 * @returns {string} 数据类型字符串 (英文小写)
 */
export function type(val) {
  const t = typeof val;
  if (t !== 'object') return t;

  let temp = Object.prototype.toString.call(val).replace(/^\[|\]$/g, '');
  return temp.split(' ')[1].toLowerCase();
}
