<template>
  <ul class="tab-list">
    <li v-for="(flow,idx) in tabList" :key="flow.text" :ref="'activeTab'+idx" :class="['tab-item', activeIdx===getId(flow,idx) ?'tab-item-active':'']" :style="{color:defaultColor}"
        @click.capture="changeTab(getId(flow,idx),$event)"
    >
      <span v-if="isShowMark" class="idx-mark">{{idx +1}}</span>
      <span class="text">{{flow.text}}</span>
    </li>
    <span class="tab-active-line" :style="{'left': activeLine.left + 'px', width: activeLine.lineWidth + 'px',background:activeColor}"></span>
  </ul>
</template>
<script>
  const COMPONENT_NAME = 'BASE_TAB_SELECT'
  export default {
    name: COMPONENT_NAME,
    props: {
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
        default: ""
      },
      defaultColor: {
        type: String,
        default: ""
      },
      isShowMark: {
        type: Boolean,
        default: true
      },
      id: {
        type: [String, Number],
        default: ""
      }
    },
    data() {
      return {
        activeIdx: 0,
        activeLine: {
          left: "",
          lineWidth: 100
        },
      }
    },
    mounted() {
      window.onresize = () => {
        return (() => {
          this.getWidthAndPositon()
        })()
      }

      this.activeIdx = this.defaultTab
      if (this.tabList.length) {
        this.getWidthAndPositon()
      }
    },
    methods: {
      getId(item, idx) {
        return this.id ? item[this.id] : idx
      },
      getWidthAndPositon() {
        var el = this.$refs['activeTab' + this.activeIdx][0]
        if (!el) return
        this.activeLine.lineWidth = el.offsetWidth
        this.activeLine.left = el.offsetLeft
      },
      changeTab(idx) {
        this.activeIdx = idx
        this.$emit('tab-change', idx)
        this.$nextTick(() => {
          this.getWidthAndPositon()
        })
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  $tabs-default-color = #999
  .tab-list
    width: 100%
    display: flex
    align-items: center
    position: relative
    justify-content: center;

    .tab-active-line {
      transition: all .3s
      background: $color-positive
      height: 2px
      width: 40px
      position: absolute
      left: 8px
      bottom: 0
      border-radius: 2px
      z-index: 10
    }

    .tab-item
      padding: 20px 69px
      text-align: center
      cursor: pointer

      .text
        display: inline-block
        font-size: $font-size-16
        font-family: $font-family-medium
        color: $tabs-default-color

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
