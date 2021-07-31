<template>
  <view
    class="popup"
    :class="[className, dragging ? 'popup-drag' : open ? 'popup-open' : '']"
    hover-stop-propagation
  >
    <view
      class="popup-mask"
      v-if="maskShow"
      :style="[maskStyle, { zIndex: zIndex - 1 }]"
      @tap="closeMask"
    ></view>
    <view class="popup-drawer" :style="[drawerStyle]" @touchmove.stop.prevent @tap.stop.prevent>
      <view
        class="popup-drag"
        :class="{ 'popup-arrow': arrow }"
        :hover-class="arrow ? 'popup-arrow__active' : 'none'"
        :style="[dragStyle]"
        @touchstart.stop.prevent="touchstart"
        @touchmove.stop.prevent="touchmove"
        @touchend.stop.prevent="touchend"
      ></view>
      <scroll-view :scroll-y="!dragging" style="height: 100%">
        <view
          v-if="dragPlaceholder"
          class="popup-drag__placeholder"
          :style="{ height: `${dragHeight}rpx` }"
        ></view>
        <slot></slot>
        <view :style="{ height: `${bounceHeight}rpx` }"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
/**
 * 可拖动的弹出层
 *
 * @author ponjs <https://github.com/ponjs>
 */
export default {
  name: 'Popup',
  props: {
    // 通过 v-model 控制显示
    value: {
      type: Boolean,
      default: false
    },
    // 自定义组件最外层类名
    className: {
      type: String
    },
    // 弹出层z-index层级，遮罩层根据该值-1
    zIndex: {
      type: Number,
      default: 999
    },
    // 弹出层高度，单位rpx
    height: {
      type: Number,
      default: 800
    },
    // 顶部可拖动的区域高度，单位rpx
    dragHeight: {
      type: Number,
      default: 80
    },
    // 拖动到顶部的回弹高度，单位rpx
    bounceHeight: {
      type: Number,
      default: 100
    },
    // 收起时的高度，单位rpx，包含dragHeight
    stowedHeight: {
      type: Number,
      default: 300
    },
    // 弹窗圆角值，单位rpx
    borderRadius: {
      type: Number,
      default: 30
    },
    // 拖动距离的阈值，单位rpx，当拖动距离大于该值时控制显示隐藏
    threshold: {
      type: Number,
      default: 200
    },
    // 动画过渡时间，单位ms
    duration: {
      type: Number,
      default: 300
    },
    // 是否显示提示箭头
    arrow: {
      type: Boolean,
      default: false
    },
    // 是否显示遮罩
    mask: {
      type: Boolean,
      default: false
    },
    // 点击遮罩是否可以关闭弹出层，当传入mask为true时有效
    maskCloseAble: {
      type: Boolean,
      default: true
    },
    // 弹出层背景色
    bgColor: {
      type: String,
      default: '#ffffff'
    },
    // 顶部可拖动的区域背景色，当传入dragPlaceholder为true时有效
    dragBgColor: {
      type: String,
      default: 'inherit'
    },
    // 是否出现顶部可拖动的占位块
    dragPlaceholder: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      maskStyle: { transition: 'none', opacity: 0 }, // 遮罩显示过渡样式
      maskShow: false, // 是否显示遮罩
      dragging: false, // 是否处于拖动中
      started: false, // 是否开始触摸，用于判断短按和长按
      offsetTop: 0, // 开始拖动时刻的高度
      dragOffset: 0, // 拖动距离
      moved: 0, // 控制样式的移动距离
      open: false // 控制是否展开
    }
  },
  computed: {
    // 同步状态是否显示遮罩，但是关闭时需要关闭动画后不显示，否则很突兀，所以下方需要监听该值，并设定延迟改变
    maskShowSync() {
      if (this.mask) {
        this.maskStyle.transition = this.dragging
          ? 'none'
          : `${this.duration / 1000}s opacity ease-out`
      }

      return this.mask && (this.dragging || this.open)
    },
    drawerStyle() {
      const height = this.height + 'rpx'
      const stowedHeight = this.stowedHeight + 'rpx'
      const bounceHeight = this.bounceHeight + 'rpx'
      const borderRadius = this.borderRadius + 'rpx'
      const scope = this.open ? bounceHeight : `100% - ${stowedHeight}`

      return {
        height: `calc(${height} + ${bounceHeight})`,
        transform: `translateY(clamp(0px, calc(${scope} + ${this.moved}px), 100vh))`,
        transition: this.dragging ? 'none' : `${this.duration / 1000}s transform ease-out`,
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        backgroundColor: this.bgColor,
        zIndex: this.zIndex
      }
    },
    dragStyle() {
      return {
        height: `${this.dragHeight}rpx`,
        backgroundColor: this.dragPlaceholder ? this.dragBgColor : 'transparent'
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(v) {
        this.open = v
      }
    },
    maskShowSync: {
      immediate: true,
      handler(v) {
        if (v) this.maskShow = v
        else setTimeout(() => (this.maskShow = v), this.duration) // 关闭时先通过动画隐藏弹窗和遮罩，再移除遮罩
        this.$nextTick(this.setMaskOpacity)
      }
    }
  },
  methods: {
    touchstart(e) {
      this.dragging = true
      this.offsetTop = e.touches[0].pageY
      this.dragOffset = 0
      this.started = true
      setTimeout(() => (this.started = false), 350) // 延迟后设为false，用于区分短按和长按
    },
    touchmove(e) {
      if (!this.dragging) return
      this.moved = this.dragOffset = e.touches[0].pageY - this.offsetTop
      this.setMaskOpacity() // 拖动时改变遮罩透明度
    },
    touchend() {
      const dragOffset = Math.abs(this.dragOffset) // 拖动的位移

      // 开启提示箭头 && 是短按 && 拖动位移小于2认定为非拖动 ==> 认定为点击事件 ==> 切换显示隐藏
      this.arrow && this.started && dragOffset < 2 && (this.open = !this.open)

      if (!this.dragging) return

      this.dragging = false
      this.offsetTop = 0

      if (dragOffset > uni.upx2px(this.threshold)) {
        this.$emit('input', (this.open = this.dragOffset <= 0))
      }

      this.moved = 0
      this.maskStyle.opacity = this.open ? 1 : 0 // 解决拖动松手且恢复原状时过渡不自然的问题
    },
    closeMask() {
      this.maskCloseAble && this.$emit('input', (this.open = false))
    },
    setMaskOpacity() {
      const diff = uni.upx2px(this.height) - uni.upx2px(this.stowedHeight)
      let opacity = (diff - Math.abs(this.moved)) / diff
      opacity = this.open ? (this.moved < 0 ? 1 : opacity) : this.moved > 0 ? 0 : 1 - opacity
      this.maskStyle.opacity = opacity
    }
  }
}
</script>

<style scoped>
.popup .popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  width: 100%;
  height: 100%;
}

.popup .popup-drawer {
  position: fixed;
  overflow: auto;
  bottom: 0;
  left: 0;
  width: 100%;
  transform: translateZ(0); /** 采用 GPU 渲染 */
}

.popup .popup-drag {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100rpx;
  z-index: 1;
  transform: translateZ(0); /** 解决 scroll-view 层级冲突问题 */
}

.popup .popup-arrow {
  --arrow-height: 10rpx;
  --arrow-width: 40rpx;
  --arrow-angle: 20;
  --arrow-offset: calc(50% - var(--arrow-width) + var(--arrow-height) / 180 * var(--arrow-angle));
}

.popup .popup-arrow::before,
.popup .popup-arrow::after {
  content: '';
  position: absolute;
  top: 50%;
  width: var(--arrow-width);
  height: var(--arrow-height);
  background-color: #e5e5e5;
  transition: 0.3s transform ease-out;
}

.popup .popup-arrow__active.popup-arrow::before,
.popup .popup-arrow__active.popup-arrow::after {
  opacity: 0.75;
}

.popup .popup-arrow::before {
  left: var(--arrow-offset);
  border-top-left-radius: var(--arrow-height);
  border-bottom-left-radius: var(--arrow-height);
  transform: rotate(calc(0deg - var(--arrow-angle) * 1deg));
  transform-origin: right center;
}
.popup .popup-arrow::after {
  right: var(--arrow-offset);
  border-top-right-radius: var(--arrow-height);
  border-bottom-right-radius: var(--arrow-height);
  transform: rotate(calc(var(--arrow-angle) * 1deg));
  transform-origin: left center;
}

.popup.popup-drag .popup-arrow::before,
.popup.popup-drag .popup-arrow::after {
  transform: none;
}

.popup.popup-open .popup-arrow::before {
  transform: rotate(calc(var(--arrow-angle) * 1deg));
}
.popup.popup-open .popup-arrow::after {
  transform: rotate(calc(0deg - var(--arrow-angle) * 1deg));
}
</style>
