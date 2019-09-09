<template>
  <ul class="data-date-picker">
    <li class="date-view">统计时间 {{viewDate}}</li>
    <li v-for="(item, index) in arrTitle"
        :key="index"
        class="date-item hand"
        :class="{'date-item-active': tabIndex === index}"
        @click="checkTab(index)"
    >
      <date-picker :ref="item.status"
                   v-model="date[item.status]"
                   :clearable="false"
                   :type="item.status === 'day' ? 'date' : item.status"
                   :placeholder="text"
                   class="date"
                   :pickerOptions="dateOptions"
                   @change="_getDate"
      ></date-picker>
      {{item.title}}
    </li>
  </ul>

</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'element-ui'
  import {formatNumber} from '@utils/common'
  import moment from 'moment'
  // import DatePicker from './date-picker/src/picker'
  const COMPONENT_NAME = 'BASE_OPTION_BOX'
  const NAV = [{title: '日', status: 'day'}, {title: '周', status: 'week'}, {title: '月', status: 'month'}]

  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker
    },
    props: {
      arrTitle: {
        // 日周月配置
        type: Array,
        default: () => NAV
      },
      infoTab: {
        // Tab值
        type: Number,
        default: 0
      },
      disabledDate: {
        // 是否禁用
        type: Object,
        default: () => {
          return {}
        }
      },
      text: {
        // 输入框默认文字
        type: String,
        default: '请选择时间'
      },
      disabledCurDate: {
        // 是否禁用到时间
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        tabIndex: this.infoTab,
        tempIndex: '',
        dateOptions: {
          disabledDate: (date) => {
            if (this.disabledCurDate) {
              switch (+this.tempIndex) {
              case 0:
                return date.valueOf() > Date.now() - 86400000
              case 1:
                return date.valueOf() > new Date().valueOf() - new Date().getDay() * 86400000
              case 2:
                return date.valueOf() > new Date().valueOf() - (new Date().getDate() + 1) * 86400000
              }
            } else {
              switch (+this.tempIndex) {
              case 0:
                return date.valueOf() > Date.now()
              case 1:
                return date.valueOf() > new Date().valueOf() + (7 - new Date().getDay()) * 86400000
              case 2:
                return date.valueOf() > Date.now()
              }
            }
          },
          firstDayOfWeek: 1
        },
        showPicker: true,
        moreTime: '',
        showDate: false,
        enterName: '',
        timer: '',
        clickTab: false,
        viewDate: moment(new Date().valueOf() - (this.disabledCurDate ? 86400000 : 0)).format('YYYY-MM-DD'),
        date: {
          day: new Date().valueOf() - (this.disabledCurDate ? 86400000 : 0),
          week: '',
          month: ''
        }
      }
    },
    computed: {
      dateIndex() {
        return this.tabIndex
      }
    },
    watch: {
      infoTab(news) {
        this.tabIndex = news
      }
    },
    methods: {
      checkTab(index) {
        this.tempIndex = index
      },
      _getDate(time) {
        this.tabIndex = this.tempIndex
        let date = ''
        let startDate = ''
        let endDate = ''
        switch (+this.tabIndex) {
        case 0:
          date = moment(time).format('YYYY-MM-DD')
          this.date = {
            day: time,
            week: '',
            month: ''
          }
          this.viewDate = date
          break
        case 1:
          date = moment(time)
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          startDate = moment(time)
            .subtract(1, 'days')
            .format('YYYY-MM-DD')
          if (!this.disabledCurDate) {
            let day = moment() < moment(time).subtract(-5, 'days') ? new Date().getDay() : 7
            endDate = moment(time)
              .subtract(7 - day - 5, 'days')
              .format('YYYY-MM-DD')
          } else {
            endDate = moment(time)
              .subtract(-5, 'days')
              .format('YYYY-MM-DD')
          }
          this.viewDate = startDate + ' ~ ' + endDate
          this.date = {
            day: '',
            week: time,
            month: ''
          }
          break
        case 2:
          date = new Date(time).getFullYear() + '-' + formatNumber(new Date(time).getMonth() + 1) + '-01'
          startDate = moment()
            .month(moment(time).month())
            .startOf('month')
            .format('YYYY-MM-DD')
          if (!this.disabledCurDate) {
            endDate =
              moment() <
              moment()
                .month(moment(time).month())
                .endOf('month')
                ? moment().format('YYYY-MM-DD')
                : moment()
                  .month(moment(time).month())
                  .endOf('month')
                  .format('YYYY-MM-DD')
          } else {
            endDate = moment()
              .month(moment(time).month())
              .endOf('month')
              .format('YYYY-MM-DD')
          }
          this.viewDate = startDate + ' ~ ' + endDate
          this.date = {
            day: '',
            week: '',
            month: time
          }
        }
        this.$emit('checkTime', date, NAV[this.tabIndex].status)
      },
      _getCustomTime(time) {
        this.showDate = false

      // this.$emit('checkTime', time, NAV[this.tabIndex].status)
      },
      firstUppercase(str) {
        let first = str[0].toUpperCase()
        return first + str.slice(1)
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
      .date
        width: 28px
        height: 28px
        position: absolute
        left: 0
        top: 0
        opacity: 0
    .date-view
      line-height: 28px
      font-size: $font-size-14
      font-family: $font-family-regular
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
      width: 28px
      height: 28px
      overflow: hidden
      .el-input__inner
        font-size: $font-size-12
        line-height: 28px
        height: 28px
        width: 28px
        border-radius: 2px
        color: $color-text-main
        box-sizing: border-box
        cursor: pointer
        padding: 0
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
  .el-popper[x-placement^='bottom']
    margin-left: -28px
</style>
