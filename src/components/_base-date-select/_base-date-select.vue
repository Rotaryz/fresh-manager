<template>
  <div class="base-date-select">
    <date-picker :placeholder="placeHolder"
                 :options="disabledDate"
                 :type="dataPickerType"
                 :value="dateInfo"
                 :style="{height: `${height}px`, width: `${width}px`}"
                 :clearable="clearable"
                 :format="format"
                 :editable="editable"
                 @on-change="_getTime"
    ></date-picker>
  </div>
</template>

<script type="text/ecmascript-6">
  import {DatePicker} from 'iview'

  const COMPONENT_NAME = 'BASE_DATE_SELECT'

  export default {
    name: COMPONENT_NAME,
    components: {
      DatePicker
    },
    props: {
      editable: {
        type: Boolean,
        default: true
      },
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      height: {
        type: Number,
        default: 28
      },
      width: {
        type: Number,
        default: 187
      },
      dataPickerType: {
        type: String,
        default: 'daterange'
      },
      placeHolder: {
        type: String,
        default: '选择申请日期'
      },
      dateInfo: {
        // 初始化时间 -> eg: ['2016-01-01', '2016-02-15']
        type: Array,
        default: () => {
          return []
        }
      },
      disabledDate: {
        type: Object,
        default: () => {
          return {}
        }
      },
      clearable: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    watch: {
      disabledDate(news) {
      }
    },
    methods: {
      _getTime(time) {
        // console.log(this.disabledDate)
        this.$emit('getTime', time)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .base-date-select
    .ivu-date-picker
      height: 100%
      width: 100%
      .ivu-date-picker-cells-cell,.ivu-date-picker-header-label
        color: $color-text-main
      .ivu-date-picker-rel, .ivu-input-wrapper, .ivu-input
        height: 100%
      .ivu-input-icon
        height: 100%
        line-height: 28px
      .ivu-input
        color: $color-text-main
        outline: none
        box-shadow: none
        &:focus
          outline: none
          border-color: $color-main !important
        &:hover
          border: 1px solid #ACACAC

</style>
