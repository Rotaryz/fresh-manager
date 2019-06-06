<template>
  <div class="base-blank" :style="blackStyle">
    <img src="./pic-zanwu@2x.png" class="blank-img">
    <p class="blank-text">暂无数据</p>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_BLANK'

  export default {
    name: COMPONENT_NAME,
    props: {
      blackStyle: {
        type: String,
        default: ''
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .base-blank
    top: 0
    left: 0
    width: 100%
    height: 100%
    position: absolute
    display: flex
    align-items: center
    flex-direction: column
    user-select: none
    .blank-img
      width: 88px
      display: block
      margin-top: 15%
    .blank-text
      color: $color-text-assist
      margin-top: 20px
      font-size: $font-size-14
</style>
