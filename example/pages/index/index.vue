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
       * 查看源码 uni-ajax/lib/ajax.js 有代码注释（您这么聪明肯定看得明白啦）
       */
      this.request = this.$ajax('rest', {
        api: 'mtop.common.getTimestamp'
      }).then(res => {
        this.result = res.data.data.t
      })

      /**
       * 上下两种写法都可以，但是是有一些差异的，具体可看文档
       * 主要差异在于执行请求方法返回的 request 的 Promise.resolve 返回值
       * 下面的 getRequestTask 函数中的方法一就是一个简单的例子
        this.request = this.$ajax({
          url: 'rest',
          data: { api: 'mtop.common.getTimestamp' },
          success: res => {
            this.result = res.data.data.t
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
    async getRequestTask() {
      // 定义接口所需参数（这里这么定义只是方法下面多个方法使用，您在实际使用中并非一定要求这么写）
      const config = {
        url: 'rest',
        data: {
          api: 'mtop.common.getTimestamp'
        }
      }

      /**
       * 方法一
       *
       * 如果希望返回一个真正的 RequestTask 对象，则传参为一个对象
       * 该对象至少传入 success / fail / complete 参数中的一个
       * 然后接收 Promise.resolve 的返回值
       */

      // await 需写在 async 函数里（看到 getRequestTask 前那个 async 了吗）
      const requestTask = await this.$ajax({
        ...config,
        success: res => (this.result = res.data.data.t)
      })
      console.log(requestTask)

      // 如果不想用 async await，则用 then 接收，则无需写 async await
      this.$ajax({
        ...config,
        success: res => (this.result = res.data.data.t)
      }).then(requestTask => {
        console.log(requestTask)
      })

      /**
       * 方法二
       *
       * 通过请求配置的 xhr 回调参数也可以获取 requestTask 对象
       */

      // 通过传参一个对象使用
      this.$ajax({
        ...config,
        xhr: (requestTask, config) => {
          console.log(requestTask)
        }
      })

      // 通过传参多个参数使用
      this.$ajax(config.url, conif.data, {
        xhr: (requestTask, config) => {
          console.log(requestTask)
        }
      })
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
