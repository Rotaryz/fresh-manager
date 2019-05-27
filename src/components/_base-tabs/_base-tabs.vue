<template>
  <div :class="['tab-wrap',tabAlign]">
    <ul :class="['tab-list',tabAlign]">
      <li v-for="(flow,idx) in tabList" :key="flow.text" :ref="'activeTab'+idx"
          :class="['tab-item', defaultTab===getId(flow,idx) ?'tab-item-active':'']"
          :style="{color:defaultColor,padding:padding,margin:margin}"
          @click.capture="changeTab(getId(flow,idx),$event)"
      >
        <span v-if="isShowMark" class="idx-mark">{{idx +1}}</span>
        <span class="text">{{flow.text}}</span>
      </li>
      <span class="tab-active-line" :style="{'left': activeLine.left + 'px', width: activeLine.lineWidth + 'px',background:activeColor}"></span>
    </ul>
  </div>
</template>
<script>
  const COMPONENT_NAME = 'BASE_TAB_SELECT'
  export default {
    name: COMPONENT_NAME,
    props: {
      padding:{
        type: String,
        default: '20px 69px'
      },
      margin:{
        type: String,
        default: '0px'
      },
      tabAlign:{
        type: String,
        default: 'center'
      },
      defaultTab: {
        type: [Number, String],
        default: 0
      },
      tabList: {
        type: Array,
        default: () => []
      },
      activeColor: {
        type: String,
        default: ''
      },
      defaultColor: {
        type: String,
        default: ''
      },
      isShowMark: {
        type: Boolean,
        default: true
      },
      id: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        // activeIdx: 0,
        activeLine: {
          left: '',
          lineWidth: 100
        }
      }
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.getWidthAndPositon(this.defaultTab)
        })()
      }
      if (this.tabList.length) {
        this.getWidthAndPositon(this.defaultTab)
      }
    },
    methods: {
      getId(item, idx) {
        return this.id ? item[this.id] : idx
      },
      getWidthAndPositon(id) {
        let el = this.$refs['activeTab' + id][0]
        if (!el) return
        this.activeLine.lineWidth = el.offsetWidth
        this.activeLine.left = el.offsetLeft
      },
      changeTab(idx) {
        this.getWidthAndPositon(idx)
        this.$emit('tab-change', idx)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $tabs-default-color = #999
  .tab-wrap
    width: 100%
    border-bottom 1px solid #E9ECEE
    display: flex;
    justify-content: center
    background-color :$color-white
    &.center
      justify-content: center
    &.left
      justify-content: flex-start
    &.right
      justify-content: flex-end
  .tab-list
    display inline-block
    display: flex
    align-items: center
    position: relative
    .tab-active-line {
      transition: all .3s
      background: $color-positive
      height: 2px
      width: 40px
      position: absolute
      left: 8px
      bottom: -2px
      border-radius: 2px
      z-index: 10
    }

    .tab-item
      padding: 20px 69px
      text-align: center
      cursor: pointer
      color: $tabs-default-color
      .text
        display: inline-block
        font-size: $font-size-16
        font-family: $font-family-medium

      .idx-mark
        display: inline-block
        margin-right: 4px
        font-size: $font-size-12
        height: 16px;
        width: 16px;
        text-align: center
        border-radius: 50%
        color: #fff
        background: $tabs-default-color

    .tab-item-active
      .text
        color: $color-main

      .idx-mark
        background: $color-main


</style>
