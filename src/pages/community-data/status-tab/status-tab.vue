<template>
  <div class="status-tab" :style="{opacity: show ? 1 : 0}">
    <div v-for="(item, index) in statusList" :key="index" class="status-tab-item hand"
         :class="{'status-tab-item-active': statusIndex === index}" @click="checkStatus(index, item)"
    >
      {{item.name}}
    </div>
    <span class="status-slider" :style="style"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'STATUS_TAB'

  export default {
    name: COMPONENT_NAME,
    props: {
      statusList: {
        type: Array,
        default: () => {
          return [{name: '全部', value: '', num: 0}]
        }
      },
      infoTabIndex: {
        type: Number,
        default: 0
      },
      show: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        statusIndex: this.infoTabIndex,
        style: '',
        el: null
      }
    },
    watch: {
      infoTabIndex(newVal) {
        // console.log(newVal)
        this.statusIndex = newVal
      }
    },
    mounted() {
      this.el = document.querySelector('.status-tab-item')
      this.style = `left: ${this.el.offsetWidth * this.statusIndex}px; width: ${this.el.offsetWidth}px`
    },
    methods: {
      checkStatus(index, item) {
        let el = document.querySelector('.status-tab-item')
        this.statusIndex = index
        this.style = `left: ${this.el.offsetWidth * index}px; width: ${el.offsetWidth}px`
        this.$emit('setStatus', item, index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .status-tab
    margin-left: 30px
    display: flex
    background: #F6F6F6
    border-radius: 100px
    height: 24px
    box-sizing: border-box
    position: relative
    .status-tab-item
      border-radius: 100px
      width: 84px
      color: #666
      line-height: 24px
      text-align: center
      transition: 0.2s all
      font-size: $font-size-12
      font-family: $font-family-regular
      background: transparent
      position: relative
      z-index: 1
    .status-tab-item-active
      color: $color-white
  .status-slider
    width: 84px
    position: absolute
    top: 0
    left: 0
    height: 24px
    border-radius: 100px
    transition: left 0.2s
    background: $color-main
</style>
