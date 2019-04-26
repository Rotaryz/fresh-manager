<template>
  <ul class="date">
    <li v-for="(item, index) in arrTitle" :key="index" class="date-item hand" :class="{'date-item-active': tabIndex === index}" @click="checkTab(index)">
      {{item.title}}
      <transition name="fade">
        <!-- v-show=""-->
        <div v-if="item.status === 'custom' && tabIndex === tabActive" class="block">
          <base-date-select :clearable="false" :disabledDate="disabledDate" :placeHolder="text" @getTime="_getCustomTime"></base-date-select>
        </div>
      </transition>
    </li>
  </ul>

</template>

<script type="text/ecmascript-6">
  const COMPONENT_NAME = 'BASE_OPTION_BOX'
  const NAV = [
    {title: '今天', status: 'today'},
    {title: '昨天', status: 'yesterday'},
    {title: '7天', status: 'week'},
    {title: '30天', status: 'month'},
    {title: '自定义', status: 'custom'}
  ]

  export default {
    name: COMPONENT_NAME,
    props: {
      arrTitle: {
        type: Array,
        default: () => NAV
      },
      tabActive: {
        // 自定义时间的tabIndex值
        type: Number,
        default: 4
      },
      newPickerOptions: {
        type: Number,
        default: 0
      },
      infoTab: {
        type: Number,
        default: 0
      },
      disabledDate: {
        type: Object,
        default: () => {
          return {}
        }
      },
      text: {
        type: String,
        default: '请选择时间'
      }
    },
    data() {
      return {
        tabIndex: this.infoTab,
        showPicker: true,
        moreTime: ''
      }
    },
    watch: {
      infoTab(news) {
        this.tabIndex = news
      }
    },
    methods: {
      checkTab(index) {
        this.tabIndex = index
        let status = this.arrTitle[index].status
        if (status === 'custom') {
          return
        }
        this.$emit('checkTime', status)
      },
      _getCustomTime(time) {
        this.$emit('checkTime', time)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .date
    display: flex
    .date-item
      line-height: 28px
      font-size: $font-size-14
      color: #666
      margin-left: 20px
      height: 28px
      position: relative
      transition: all 0.3s ease-out
      border-left: none
      text-align: center
      &:after
        content: ''
        border-top: 0.5px solid transparent
        border-bottom: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 100%
        width: 0
        right: 0
        top: -0.5px
        box-sizing: content-box
        transition: all 0.3s ease-out
      &:before
        content: ''
        border-right: 0.5px solid transparent
        border-left: 0.5px solid transparent
        position: absolute
        z-index: 5
        height: 0
        width: 100%
        bottom: 0
        left: 0
        box-sizing: content-box
        transition: all 0.3s ease-out

    .date-item-active
      transition: all 0.3s ease-out
      color: #4DBD65
      &:after
        border-color: transparent
        transition: all 0.3s ease-out
        width: 100%
      &:before
        border-color: transparent
        transition: all 0.3s ease-out
        height: 100%

  .block
    row-center()
    left: -80%
    z-index: 10
    &.fade-enter, &.fade-leave-to
      opacity: 0
      height: 0
    &.fade-enter-to, &.fade-leave-to
      transition: all .3s ease-in-out
</style>
