<script setup>
/*!
 * 该示例中使用了两个组件，这些组件仅供学习和参考使用。
 * 严禁发布到各平台以及开源！
 */

import { ref } from 'vue'
import { onReady } from '@dcloudio/uni-app'
import { Fetcher } from '@/uni_modules/u-ajax'

/** 配置的接口根地址 */
const baseURL = ref('')
/** 请求服务端返回的结果 */
const result = ref('...')
/** 请求任务抓取器 */
const fetcher = new Fetcher()

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
  // 这里通过 Promise 链式，将请求成功或失败的结果都 JSON.stringify
  uni
    .$ajax('api.do', { api: 'mtop.common.getTimestamp' }, { fetcher })
    .then(({ data }) => data)
    .catch(({ config, ...error }) => error)
    .then(res => {
      result.value = JSON.stringify(res, null, 4)
    })
}

/** 中断请求 */
const abort = () => {
  // 您可以通过 chrome 调试，打开 Network，将网络状态改为 Slow 3G
  // 然后发起请求后立即点击取消请求方便查看效果
  fetcher.abort()
}

/** 获取请求任务对象 */
const getRequestTask = async () => {
  const requestTask = await fetcher.source()
  console.log(requestTask)
}

const guideRef = ref(null)

onReady(() => {
  getBaseURL()
  getRequestTask()
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
