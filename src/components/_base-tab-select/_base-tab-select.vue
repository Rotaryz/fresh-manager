<template>
  <div>
    <div class="status-tab">
      <div v-for="(item, index) in tabStatus" :key="index" :style="{'margin-right': marginRight + 'px'}" :class="{'status-item-active': tabIndex === index}" class="status-item hand">
        <div class="status-txt" @click="_setTab(index, item)">{{item.text}}</div>
      </div>
      <span class="line" :style="{'left': left + 'px', width: lineWidth + 'px'}"></span>
    </div>
    <div class="status-top"></div>
  </div>
</template>

<script>
  const COMPONENT_NAME = 'BASE_TAB_SELECT'

  export default {
    name: COMPONENT_NAME,
    props: {
      tabStatus: {
        type: Array,
        default: () => []
      },
      infoTabIndex: {
        type: Number,
        default: 0
      },
      marginRight: {
        type: Number,
        default: 40
      },
      lineWidth: {
        type: Number,
        default: 40
      }
    },
    data() {
      return {
        tabIndex: this.infoTabIndex,
        left: 22,
        tabArr: null,
        width: 0
      }
    },
    watch: {
      infoTabIndex(newVal) {
        this.tabIndex = newVal
      }
    },
    mounted() {
      window.onResize = () => {
        this.width = `${document.querySelector('.container').offsetWidth}px`
      }
      this.width = `${document.querySelector('.container').offsetWidth}px`
      setTimeout(() => {
        this.tabArr = document.querySelectorAll('.status-item')
        this._setLeft()
      }, 20)
    },
    methods: {
      _setLeft() {
        let left = 0
        this.tabArr.forEach((item, idx) => {
          if (this.tabIndex > idx) {
            left += item.offsetWidth + this.marginRight
          } else if (this.tabIndex === idx) {
            left += (item.offsetWidth - this.lineWidth) / 2 + 26
          }
        })
        this.left = left
      },
      _setTab(index, item) {
        this.tabIndex = index
        this._setLeft()
        this.$emit('getStatusTab', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .status-top
    height: 40px
    width: 100%

  .status-tab
    border-bottom-1px($color-line)
    position: fixed
    top: 39px
    left: 210px
    z-index: 501
    width: 100%
    user-select: none
    background: $color-white
    display: flex
    font-size: $font-size-16
    line-height: 16px
    font-family: $font-family-regular
    color: $color-text-main
    padding: 0 26px
    box-sizing: border-box
    .status-item
      margin-right: 40px
      height: 38px
      box-sizing: border-box
      transition: all 0.3s
      .status-txt
        font-size: $font-size-16
        padding: 12px 0
        box-sizing: border-box
    .status-item-active
      color: $color-main
      font-family: $font-family-medium
    .line
      transition: all .3s
      background: $color-positive
      height: 2px
      width: 40px
      position: absolute
      left: 8px
      bottom: 0
      border-radius: 2px
      z-index: 10
</style>
