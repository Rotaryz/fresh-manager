<template>
  <div class="status-tab">
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
        default: 0
      },
      marginRight: {
        type: Number,
        default: 60
      }
    },
    data() {
      return {
        tabIndex: this.infoTabIndex,
        left: 0,
        tabArr: null
      }
    },
    watch: {
      infoTabIndex(newVal) {
        this.tabIndex = newVal
      }
    },
    mounted() {
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
            left += (item.offsetWidth - 34) / 2
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
  .hand
    cursor: pointer
  .status-tab
    margin-left: 11px
    display: flex
    font-size: $font-size-16
    line-height: 16px
    font-family: $font-family-regular
    color: $color-text-main
    position: relative
    border-bottom: 0.5px solid $color-line
    .status-item
      margin-right: 60px
      height: 62px
      box-sizing: border-box
      transition: all 0.3s
      .status-txt
        padding-top: 30px
        padding-bottom: 16px
        height: 62px
        box-sizing: border-box
    .status-item-active
      color: $color-text-main
      font-family: $font-family-medium
    .line
      transition: all .3s
      background: $color-positive
      height: 2px
      width: 34px
      position: absolute
      left: 0
      bottom: 0


</style>
