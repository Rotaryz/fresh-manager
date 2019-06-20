<template>
  <ul class="data-date-picker">
    <li v-for="(item, index) in arrTitle"
        :key="index"
        class="date-item hand"
        :class="{'date-item-active': tabIndex === index}"
        @click="checkTab(index)"
        @mouseenter="mouseEnter(item.status, index)"
        @mouseleave="mouseLeave(item.status, index)"
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
      <!--以下内容暂时无用-->
      <transition name="fade">
        <!-- v-show=""-->
        <div v-if="item.status === 'day' && tabIndex === index && showDate" class="block day">
          <!--<base-date-select :clearable="false" :disabledDate="disabledDate" :placeHolder="text" @getTime="_getCustomTime"></base-date-select>-->
          <date-picker :ref="item.status"
                       v-model="item.date"
                       :clearable="false"
                       type="date"
                       :placeholder="text"
                       @change="_getDayDate"
          ></date-picker>
        </div>
        <div v-if="item.status === 'week' && tabIndex === index && showDate" class="block week">
          <date-picker ref="week"
                       v-model="week"
                       :clearable="false"
                       type="week"
                       format="yyyy 第 WW 周"
                       :placeholder="text"
                       @change="_getWeekDate"
          ></date-picker>
        </div>
        <div v-if="item.status === 'month' && tabIndex === index && showDate" class="block month">
          <date-picker ref="month"
                       v-model="month"
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
  import {formatNumber} from '@utils/common'
  // import moment from 'moment'
  // import DatePicker from './date-picker/src/picker'
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
        tempIndex: '',
        dateOptions: {
          disabledDate: (date) => {
            switch (+this.tempIndex) {
            case 0:
              return date.valueOf() > Date.now() - 86400000
            case 1:
              return date.valueOf() > new Date().valueOf() - new Date().getDay() * 84600000
            case 2:
              return date.valueOf() > new Date().valueOf() - (new Date().getDate() + 1) * 84600000
            }

          }
        },
        showPicker: true,
        moreTime: '',
        showDate: false,
        enterName: '',
        timer: '',
        clickTab: false,
        date: {
          day: new Date().valueOf() - 84600000,
          week: new Date().valueOf() - new Date().getDay() * 84600000,
          month: new Date().valueOf() - (new Date().getDate()+1) * 84600000
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
      mouseEnter(name, index) {
        if (name !== this.enterName && this.enterName) {
          this.$refs[this.enterName] && this.$refs[this.enterName][0] && this.$refs[this.enterName][0].handleClose()
        }
        clearTimeout(this.timer)
        this.tempIndex = index
        this.$refs[name] && this.$refs[name][0].$refs.reference.focus()
        this.enterName = name
      },
      mouseLeave(name) {
        this.timer = setTimeout(() => {
          this.$refs[name] && this.$refs[name][0] && this.$refs[name][0].handleClose()
        },2500)
      },
      checkTab(index) {
        this.clickTab = true
        setTimeout(() => {
          this.clickTab = false
        }, 500)
        this.$refs[this.enterName] && this.$refs[this.enterName][0] && this.$refs[this.enterName][0].handleClose()
        this.tabIndex = index
        let date = ''
        switch (index) {
        case 0:
          this.$set(this.date, NAV[this.tabIndex].status, new Date(Date.now() - 86400000))
          date = new Date(this.date[NAV[this.tabIndex].status]).toLocaleDateString().replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
          break
        case 1:
          this.$set(this.date, NAV[this.tabIndex].status, new Date(new Date().valueOf() - (new Date().getDay() + 6) * 84600000))
          date = new Date(this.date[NAV[this.tabIndex].status]).toLocaleDateString().replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
          break
        case 2:
          this.$set(this.date, NAV[this.tabIndex].status, new Date(new Date().valueOf() - (new Date().getDate() + 1) * 84600000))
          date = new Date(this.date[NAV[this.tabIndex].status]).getFullYear() + '-' + formatNumber(new Date(this.date[NAV[this.tabIndex].status]).getMonth() + 1) + '-01'
        }
        this.$emit('checkTime', date, NAV[this.tabIndex].status)
        // this.clickTab = false
      },
      _getDate(time) {
        if (this.clickTab) return
        this.tabIndex = this.tempIndex
        let date = ''
        switch (+this.tabIndex) {
        case 0:
          date = new Date(time).toLocaleDateString().replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
          break
        case 1:
          date = new Date(time).toLocaleDateString().replace(/\//g, '-').replace(/\b\d\b/g, '0$&')
          break
        case 2:
          date = new Date(time).getFullYear() + '-' + formatNumber(new Date(time).getMonth() + 1) + '-01'
        }
        this.$emit('checkTime', date, NAV[this.tabIndex].status)
      },
      _getCustomTime(time) {
        this.showDate = false

        // this.$emit('checkTime', time, NAV[this.tabIndex].status)
      },
      firstUppercase(str) {
        let first = str[0].toUpperCase()
        return first+str.slice(1)
      },
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
        padding: 4px 32px 4px 7px
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
