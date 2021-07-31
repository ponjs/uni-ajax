<template>
  <view class="guide" :class="className">
    <view
      v-if="show"
      class="guide-mask"
      :style="[{ zIndex }]"
      @touchmove.stop.prevent
      @tap.stop.prevent
    >
      <view class="guide-content" :style="[contentStyle]"></view>
    </view>

    <view class="guide-info" :style="[infoStyle]">
      <text class="guide-text">{{ text }}</text>
      <view class="guide-btn" @tap.stop="nextClick">
        {{ isDone ? '我知道了' : '下一步' }}
      </view>
    </view>
  </view>
</template>

<script>
/**
 * 引导操作
 *
 * @author ponjs <https://github.com/ponjs>
 *
 * @description
 * 通过 id="guide-顺序" 实现引导顺序，从0开始递增；
 * 通过 data-guide-text 属性设置提示文字；
 * 注意使用必须进入页面scrollTop为0。
 *
 * @method start 通过ref调用开始引导
 *
 * @event done 完成事件
 * @event click 按钮点击事件，参数为当前按钮对应的引导序号
 *
 * @example
 * ```html
 * <view id="guide-0" data-guide-text="提示1"></view>
 * <view id="guide-1" data-guide-text="提示2"></view>
 *
 * <!-- this.$refs.guide.start() -->
 * <Guide ref="guide" :total="2" />
 * ```
 */
export default {
  name: 'Guide',
  props: {
    // 自定义组件最外层类名
    className: {
      type: String
    },
    // z-index 层级
    zIndex: {
      type: Number,
      default: 9999
    },
    // 内容区内边距，单位rpx
    padding: {
      type: Number,
      default: 0
    },
    // 默认圆角半径，单位rpx
    borderRadius: {
      type: Number,
      default: 0
    },
    // 动画时长，单位ms
    duration: {
      type: Number,
      default: 300
    },
    // 步骤总数，用于判断显示完成按钮文字
    total: {
      type: Number,
      default: -1
    },
    // 遮罩颜色
    maskColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.8)'
    },
    // 点击按钮后，在引导下一步之前判断。(step: number) => Promise<boolean> | boolean | void
    // 参数 step 为下一步的顺序，从“1”开始（第二个）；
    // 如果返回 true，或没有返回，则允许这次引导；
    // 如果返回 false，则跳过这次引导，然后继续执行下一个。
    beforeNext: {
      type: Function
    }
  },
  data() {
    return {
      windowTop: 0, // 可使用窗口的顶部位置
      windowHeight: 0, // 可使用窗口高度
      safeAreaHeight: 0, // 安全区域的高度
      contentStyle: {}, // 遮罩高亮内容样式
      infoStyle: {}, // 提示信息样式
      show: false, // 是否显示引导
      step: 0, // 当前引导第几步
      text: '' // 提示文字
    }
  },
  computed: {
    isDone() {
      return this.total > 0 ? this.step >= this.total : false
    }
  },
  methods: {
    start() {
      const { safeArea, screenHeight, windowHeight, windowTop } = uni.getSystemInfoSync()
      this.windowHeight = windowHeight
      this.windowTop = windowTop || 0
      this.safeAreaHeight = screenHeight - (safeArea?.bottom || 0)

      this.handle()
    },
    async handle(guideNode) {
      guideNode = guideNode === undefined ? await this.getGuideNode() : guideNode

      if (!guideNode) return this.notGuideNode()

      let { left = 0, top = 0, width = 0, height = 0, dataset, borderRadius } = guideNode
      const padding = uni.upx2px(this.padding)

      left = left - padding
      top = top - padding + this.windowTop
      width = width + padding * 2
      height = height + padding * 2
      borderRadius = borderRadius === '0px' ? `${this.borderRadius}rpx` : borderRadius

      this.text = dataset.guideText ?? ''

      await this.$nextTick() // 等待信息文字渲染完成后，再获取高度

      // 获取信息文字按钮高度
      const { height: infoHeight = 0 } = await new Promise(resolve =>
        uni.createSelectorQuery().in(this).select('.guide-info').boundingClientRect(resolve).exec()
      )

      const transitionDuration = this.duration / 1000 + 's'

      this.contentStyle = {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: `${this.maskColor} 0 0 0 100vh`,
        borderRadius,
        transitionDuration
      }

      this.infoStyle = {
        left: `${left}px`,
        top: `${top + height}px`,
        width: `${width}px`,
        transitionProperty: this.step ? 'all' : 'none', // 首个引导直接显示，不用动画，因为从 top:-100vh 过渡会显得突兀
        opacity: 1,
        zIndex: this.zIndex,
        transitionDuration
      }

      const offsetHeight = this.windowHeight + this.windowTop

      // 如果内容靠底部，需将提示文字置于内容上方
      if (offsetHeight < top + height + infoHeight + this.safeAreaHeight) {
        this.infoStyle.top = `${top - infoHeight}px`
        this.infoStyle.flexDirection = 'column-reverse'
      }

      // 内容在可视区域以下
      if (offsetHeight < top + height) {
        this.infoStyle.top = `${this.windowHeight - height - infoHeight}px`
        this.contentStyle.top = `${this.windowHeight - height}px`
        uni.pageScrollTo({
          scrollTop: top - this.windowHeight + height,
          duration: 0
        })
      }

      // 内容在可视区域以上
      if (top < 0) {
        uni.pageScrollTo({
          scrollTop: 0,
          duration: 0,
          success: this.start
        })
        return
      }

      this.step++
      this.show = true
    },
    notGuideNode() {
      this.show = false
      this.contentStyle = {}
      this.infoStyle = {}
      uni.pageScrollTo({ scrollTop: 0, duration: 0 })
      this.step > 0 && this.$emit('done')
      this.step = 0
    },
    getGuideNode() {
      return new Promise(resolve =>
        uni
          .createSelectorQuery()
          .select(`#guide-${this.step}`)
          .fields(
            {
              dataset: true,
              rect: true,
              size: true,
              computedStyle: ['borderRadius']
            },
            resolve
          )
          .exec()
      )
    },
    async nextStep() {
      const node = await this.getGuideNode()
      if (!node) return this.notGuideNode()
      const can = await this.beforeNext?.(this.step)
      if (can || can === undefined) {
        this.handle(node)
      } else {
        this.step++
        this.nextStep()
      }
    },
    nextClick() {
      this.$emit('click', this.step - 1)
      this.nextStep()
    }
  }
}
</script>

<style scoped>
.guide .guide-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.guide .guide-content {
  position: absolute;
}
.guide .guide-info {
  position: fixed;
  top: -100vh;
  opacity: 0;
  z-index: -999;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.guide .guide-text {
  font-size: 24rpx;
  padding: 20rpx 0;
}

.guide .guide-btn {
  padding: 15rpx 20rpx;
  border-radius: 10rpx;
  border: 1px solid #ffffff;
  font-size: 26rpx;
  width: 4em;
  box-sizing: content-box;
  text-align: center;
}
</style>
