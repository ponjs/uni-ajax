<script setup>
/*!
 * 该示例中使用了两个组件，这些组件仅供学习和参考使用。
 * 严禁发布到各平台以及开源！
 */

import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'

/** 配置的接口根地址 */
const baseURL = ref('')
/** 发起请求对象 */
const request = ref(null)
/** 请求服务端返回的结果 */
const result = ref('...')

/** 获取接口根地址 */
const getBaseURL = async () => {
  // 该方法可传入一个请求配置对象（baseURL、url、params、query），并返回最终的请求地址。
  // 这里没有传入参数，且实例配置只配置了 baseURL，则返回实例的 baseURL
  const url = await uni.$ajax.getURL()
  baseURL.value = url

  // 也可以直接读取请求实例的 baseURL
  // baseURL.value = uni.$ajax.config.baseURL
}

/** 发起请求 */
const initiate = () => {
  /**
   * 执行方法返回的 request 是在继承 Promise 的基础上，挂载 RequestTask 的一些方法
   * 所以可以下面的 abort() 这样直接调用中断请求
   * 参见源码 /lib/adapters/Request.js
   *
   * 这里通过 Promise 链式，将请求成功或失败的结果都 JSON.stringify
   */
  request.value = uni
    .$ajax('api.do', {
      api: 'mtop.common.getTimestamp'
    })
    .then(({ data }) => data)
    .catch(({ config, ...error }) => error)
    .then(res => {
      result.value = JSON.stringify(res, null, 4)
    })

  /**
   * 上下两种写法都可以，但是是有一些差异的，具体可看文档
   * 主要差异在于执行请求方法返回的 request 的 Promise.resolve 返回值
   * 这里的 Promise.resolve 返回值为 undefined，仅表示所有回调参数执行完成，且不会发生 rejected 状态
   * 上面的 Promise.resolve 返回值为请求成功对象，表示发起请求成功后返回服务端数据
   */
  // request.value = uni.$ajax({
  //   url: 'api.do',
  //   data: { api: 'mtop.common.getTimestamp' },
  //   success: ({ data }) => {
  //     result.value = JSON.stringify(data, null, 4)
  //   },
  //   fail: ({ config, ...error }) => {
  //     result.value = JSON.stringify(error, null, 4)
  //   }
  // })
}

/** 中断请求 */
const abort = () => {
  /**
   * ?. 是 es2020 的新语法可选链
   * 大概意思是，判断 this.request 是否有 abort 属性（通过判断 this.request 是否为 null 或 undefined），有的话则获取该属性
   * 这样可以防止还未请求就先点击取消请求而发生报错的情况
   *
   * 您可以通过 chrome 调试，打开 Network，将网络状态改为 Slow 3G
   * 然后发起请求后立即点击取消请求方便查看效果
   */
  request.value?.abort()
}

const getRequestTask = () => {
  /**
   * 通过请求配置的 xhr 回调参数可以获取 RequestTask 对象
   *
   * 虽然有提供获取 RequestTask 对象属性方法 xhr，
   * 但没有上面 abort() 那样直接调用 RequestTask 上的方法来的方便，
   * 所以有直接中断请求这种操作推荐上面那样直接调用。
   */

  // 通过传参一个对象参数使用
  uni.$ajax({
    url: 'api.do',
    data: { api: 'mtop.common.getTimestamp' },
    xhr: (requestTask, config) => {
      console.log(requestTask)
    },
    success: res => {
      console.log(res)
    }
  })

  // 通过传参多个参数使用
  // uni.$ajax(
  //   'api.do',
  //   { api: 'mtop.common.getTimestamp' },
  //   {
  //     xhr: (requestTask, config) => {
  //       console.log(requestTask)
  //     }
  //   }
  // ).then(res => {
  //   console.log(res)
  // })
}

const guideRef = ref(null)

onReady(() => {
  getBaseURL()
  setTimeout(() => guideRef.value?.start(), 300) // 开启操作引导
})
</script>

<template>
  <view class="page">
    <view id="guide-2" class="preview" data-guide-text="请求结果">{{ result }}</view>

    <popup arrow drag-placeholder :stowed-height="350">
      <view id="guide-0" class="button" data-guide-text="点击请求服务端数据" @tap="initiate">
        发起请求
      </view>
      <view id="guide-1" class="button" data-guide-text="发起请求后可点击中断请求" @tap="abort">
        中断请求
      </view>
      <view class="text">接口根地址：{{ baseURL }}</view>
    </popup>

    <guide ref="guideRef" :total="3" />
  </view>
</template>

<style>
.page {
  padding-top: 30rpx;
  font-size: 28rpx;
  line-height: 1.15;
}

.preview {
  border-radius: 10rpx;
  margin: 0 30rpx;
  min-height: 16em;
  padding: 20rpx;
  background-color: #f5f5f5;
  color: #666666;
  font-size: 24rpx;
  white-space: break-spaces;
  line-height: 1.6;
}

.popup::v-deep .popup-drawer {
  box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, 0.2);
  padding: 30rpx;
  box-sizing: border-box;
}

.button {
  background: rgb(66, 185, 131);
  box-shadow: 0 10rpx 20rpx rgba(10, 43, 245, 0.2);
  border-radius: 10rpx;
  color: #ffffff;
  font-size: 30rpx;
  text-align: center;
  line-height: 90rpx;
  transition: background-color 0.3s;
  height: 90rpx;
  margin-bottom: 30rpx;
}
.button:active {
  background-color: rgba(66, 185, 131, 0.8);
}

.text {
  color: #999999;
  padding: 0 10rpx;
}
</style>
