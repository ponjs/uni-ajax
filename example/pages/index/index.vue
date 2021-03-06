<template>
  <view class="page">
    <view class="text">
      <text>接口根地址：</text>
      <text>{{ baseURL }}</text>
    </view>
    <view class="text">
      <text>接口源地址：</text>
      <text>{{ origin }}</text>
    </view>
    <view class="time">{{ result }}</view>
    <view class="button" @tap="initiate">发起请求</view>
    <view class="button" @tap="abort">取消请求</view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      baseURL: '', // 配置的接口根地址
      origin: '', // 根据配置的接口根地址获取源地址
      result: '', // 接口返回的结果
      request: null // 发起请求对象
    }
  },
  methods: {
    // 发起请求
    initiate() {
      /**
       * 执行方法返回的 request 是在继承 Promise 的基础上，挂载 RequestTask 的一些方法
       * 所以可以下面的 abort() 这样直接调用中断请求
       * 参见源码 /src/lib/adapters/Request.js
       */
      this.request = this.$ajax('upload', { tp: 'json' }).then(res => {
        this.result = res.data.serverTime
      })

      /**
       * 上下两种写法都可以，但是是有一些差异的，具体可看文档
       * 主要差异在于执行请求方法返回的 request 的 Promise.resolve 返回值
       * 这里的 Promise.resolve 返回值为 undefined，仅表示所有回调参数执行完成，且不会发生 rejected 状态
       * 上面的 Promise.resolve 返回值为请求成功对象，表示发起请求成功后返回服务端数据
        this.request = this.$ajax({
          url: 'upload',
          data: { tp: 'json' },
          success: res => {
            this.result = res.data.serverTime
          }
        })
      */
    },
    // 中断请求
    abort() {
      /**
       * ?. 是 es2020 的新语法可选链
       * 大概意思是，判断 this.request 是否有 abort 属性（通过判断 this.request 是否为 null 或 undefined），有的话则获取该属性
       * 这样可以防止还未请求就先点击取消请求而发生报错的情况
       *
       * 您可以通过 chrome 调试，打开 Network，将网络状态改为 Slow 3G
       * 然后发起请求后点击取消请求方便查看效果
       */
      this.request?.abort()
    },
    // 获取 RequestTask 对象
    getRequestTask() {
      /**
       * 通过请求配置的 xhr 回调参数可以获取 RequestTask 对象
       *
       * 虽然有提供获取 RequestTask 对象属性方法 xhr，
       * 但没有上面 abort() 那样直接调用 RequestTask 上的方法来的方便，
       * 所以有直接中断请求这种操作推荐上面那样直接调用。
       */

      // 通过传参一个对象参数使用
      this.$ajax({
        url: 'upload',
        data: { tp: 'json' },
        xhr: (requestTask, config) => {
          console.log(requestTask)
        },
        success: res => {
          this.result = res.data.serverTime
        }
      })

      /**
       * 通过传参多个参数使用
        this.$ajax(
          'upload',
          { tp: 'json' },
          {
            xhr: (requestTask, config) => {
              console.log(requestTask)
            }
          }
        ).then(res => {
          this.result = res.data.serverTime
        })
       */
    }
  },
  onLoad() {
    const { baseURL, origin } = this.$ajax
    this.baseURL = baseURL
    this.origin = origin
  }
}
</script>

<style>
.page {
  padding: 100rpx 30rpx;
  height: 100%;
}
.text {
  font-size: 28rpx;
  color: #999999;
}
.text + .text {
  margin-top: 30rpx;
}
.time {
  text-align: center;
  color: #666666;
  font-size: 30rpx;
  margin: 100rpx 0;
  height: 88rpx;
  border-radius: 10rpx;
  border: 2rpx solid #eeeeee;
  line-height: 88rpx;
}
.button {
  background: #376fee;
  box-shadow: 0 10rpx 20rpx rgba(10, 43, 245, 0.2);
  border-radius: 10rpx;
  color: #ffffff;
  font-size: 30rpx;
  text-align: center;
  padding: 25rpx;
  transition: background-color 0.3s;
}
.button:active {
  background-color: rgba(55, 111, 238, 0.8);
}
.button + .button {
  margin-top: 30rpx;
}
</style>
