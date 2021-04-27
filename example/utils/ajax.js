import Vue from 'vue'
import ajax from '@/uni_modules/u-ajax/js_sdk'

// 创建请求实例
const instance = ajax.create({
  // 默认配置
  baseURL: 'https://otheve.beacon.qq.com/analytics'
})

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    console.log('发送请求前', config)
    return config
  },
  error => {
    // 对请求错误做些什么
    console.log('发请求错误', error)
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    console.log('响应成功后', response)
    return response
  },
  error => {
    // 对响应错误做点什么
    console.log('响应错误后', error)
    return Promise.reject(error)
  }
)

// 如果您是像我下面这样挂载在 Vue 原型链上，则通过 this.$ajax 调用
Vue.prototype.$ajax = instance

export default instance
