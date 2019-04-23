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
        type: String,
        default: '69px'
      },
      height: {
        type: String,
        default: '28px'
      },
      switchColor: {
        type: String,
        default: '#4DBD65'
      },
      closeColor: {
        type: String,
        default: '#E1E1E1'
      },
      transform: {
        type: String,
        default: '40px'
      },
      confirmText: {
        type: String,
        default: '上架'
      },
      cancelText: {
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
