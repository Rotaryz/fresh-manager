<template>
  <ul class="data-date-picker">
    <li v-for="(item, index) in arrTitle" :key="index" class="date-item hand" :class="{'date-item-active': tabIndex === index}" @click="checkTab(index)">
      {{item.title}}
      <transition name="fade">
        <!-- v-show=""-->
        <div v-if="item.status === 'day' && tabIndex === index && showDate" class="block day">
          <!--<base-date-select :clearable="false" :disabledDate="disabledDate" :placeHolder="text" @getTime="_getCustomTime"></base-date-select>-->
          <date-picker v-model="date"
                       :clearable="false"
                       type="date"
                       :placeholder="text"
                       @change="_getDayDate"
          ></date-picker>
        </div>
        <div v-if="item.status === 'week' && tabIndex === index && showDate" class="block week">
          <date-picker v-model="week"
                       :clearable="false"
                       type="week"
                       format="yyyy 第 WW 周"
                       :placeholder="text"
                       @change="_getWeekDate"
          ></date-picker>
        </div>
        <div v-if="item.status === 'month' && tabIndex === index && showDate" class="block month">
          <date-picker v-model="month"
                       :clearable="false"
                       type="month"
                       :placeholder="text"
                       @change="_getMonthDate"
          ></date-picker>
        </div>
      </transition>
    </li>
  </ul>

</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'element-ui'
  const COMPONENT_NAME = 'BASE_OPTION_BOX'
  const NAV = [
    {title: '日', status: 'day'},
    {title: '周', status: 'week'},
    {title: '月', status: 'month'}
  ]

  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker
    },
    props: {
      arrTitle: {
        type: Array,
        default: () => NAV
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
        moreTime: '',
        showDate: false,
        date: '',
        week: '',
        month: ''
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
        // this.week = ''
        // this.month = ''
        let status = this.arrTitle[index].status
        this.showDate = true
        console.log(status)
        // this.$emit('checkTime', status)
      },
      _getCustomTime(time) {
        this.showDate = false

        // this.$emit('checkTime', time)
      },
      _getDayDate(time) {
        let date = new Date(time).getDate()
        console.log(date)
        this.showDate = true
        // this.$emit('checkTime', time)
      },
      _getWeekDate(time) {
        let date = new Date(time).getDate()
        console.log(date)
        // this.week = time
        this.showDate = true
        // this.$emit('checkTime', time)
      },
      _getMonthDate(time) {
        let date = new Date(time).getMonth() + 1
        console.log(date)
        // this.month = time
        this.showDate = true
        // this.$emit('checkTime', date)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .data-date-picker
    display: flex
    .date-item
      line-height: 28px
      font-size: $font-size-14
      font-family: $font-family-regular
      color: #666
      margin-left: 20px
      height: 28px
      width: 28px
      text-align: center
      border-radius: 50%
      border-1px($color-line, 50%)
      position: relative
      transition: all 0.3s ease-out
      border-left: none

    .date-item-active
      color: #FFF
      background: #6EBA6E
      border-1px(#6EBA6E, 50%)

    .block
      row-center()
      left: -80%
      top: 34px
      z-index: 10
      &.fade-enter, &.fade-leave-to
        opacity: 0
        height: 0
      &.fade-enter-to, &.fade-leave-to
        transition: all .3s ease-in-out
      .el-date-editor.el-input
        width: 187px
        height: 28px
      .el-input__inner
        font-size: $font-size-12
        line-height: 28px
        border-radius: 2px
        color: $color-text-main
        padding: 4px 32px 4px 7px
        &::placeholder
          font-family: $font-family-regular
          color: $color-text-assist
          line-height: 24px
        &:focus
          outline: none
          border-color: 1px solid $color-main !important
        &:hover
          border: 1px solid #ACACAC
      .el-input__prefix
        left: auto
        right: 2px
      .el-input__icon
        line-height: 2.2
    .day
      left: 170%
    .week
      left: -2%
    .month
      left: -174%
</style>
