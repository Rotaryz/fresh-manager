<template>
  <div class="status-tab" :style="{'width': width}">
    <div v-for="(item, index) in tabStatus" :key="index" :style="{'margin-right': marginRight + 'px'}" :class="{'status-item-active': tabIndex === index}" class="status-item hand">
      <div class="status-txt" @click="_setTab(index, item)">{{item.text}}</div>
    </div>
    <span class="line" :style="{'left': left + 'px'}"></span>
  </div>
</template>

<script>
  export default {
    name: 'StatusTab',
    props: {
      tabStatus: {
        type: Array,
        default: () => []
      },
      infoTabIndex: {
        type: Number,
        default: 14
      },
      marginRight: {
        type: Number,
        default: 40
      }
    },
    data() {
      return {
        tabIndex: this.infoTabIndex,
        left: 8,
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
            left += (item.offsetWidth - 40) / 2 + 14
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
  .status-tab
    width: 100%
    user-select: none
    margin: -20px -20px 20px -20px
    background: $color-white
    display: flex
    font-size: $font-size-16
    line-height: 16px
    font-family: $font-family-regular
    color: $color-text-main
    position: relative
    padding: 0 14px
    box-sizing: border-box
    border-left-1px($color-line)
    .status-item
      margin-right: 40px
      height: 38px
      box-sizing: border-box
      transition: all 0.3s
      .status-txt
        font-size: $font-size-14
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


</style>
