<template>
  <div class="switch-item hand" :style="{'background': status ? switchColor : closeColor, 'width': width, 'height': height}" @click="_changeSwitch">
    <span class="circular" :class="{'move': status}" :style="{'transform': `translateX(${transform})`}"></span>
    <span class="status" :class="status ? 'status-right' : 'status-left'">{{status ? confirmText: cancelText}}</span>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'BASE_SWITCH'

  export default {
    name: COMPONENT_NAME,
    props: {
      status: {
        type: Number,
        default: 1
      },
      width: {
        // 组件宽度
        type: String,
        default: '69px'
      },
      height: {
        // 组件高度
        type: String,
        default: '28px'
      },
      switchColor: {
        // 组件打开背景色
        type: String,
        default: '#4DBD65'
      },
      closeColor: {
        // 组件关闭背景色
        type: String,
        default: '#E1E1E1'
      },
      transform: {
        // 按钮位移距离
        type: String,
        default: '40px'
      },
      confirmText: {
        // 打开按钮默认文字
        type: String,
        default: '上架'
      },
      cancelText: {
        // 关闭按钮默认文字
        type: String,
        default: '下架'
      }
    },
    methods: {
      _changeSwitch() {
        this.$emit('changeSwitch')
      // this.switchStatus = status
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .switch-item
    height: 28px
    width: 69px
    border-radius: @height
    transition: background 1s
    text-align: left
    position: relative
    user-select: none
    .circular
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.10)
      display: inline-block
      height: 22px
      width: 22px
      margin: 3px 4px
      border-radius: 50%
      background: $color-white
      transition: transform .5s
    .move
      transform: translateX(0px) !important
    .status
      font-size: 14px
      col-center()
      font-family: $fontFamilyRegular
      color: #fff
    .status-right
      right: 9px
    .status-left
      color: $color-text-assist
      left: 9px
</style>
