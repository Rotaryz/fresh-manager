<template>
  <div class="base-date-select">
    <date-picker :placeholder="placeHolder" type="daterange" :value="dateInfo" :style="{'height': '28px'}" :clearable="false"
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
      }
    },
    data() {
      return {}
    },
    methods: {
      _getTime(time) {
        this.$emit('getTime', time)
        console.log(time)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~@design"
  .base-date-select
    .ivu-date-picker
      height: 100%
      width: 244px
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
          border-color: $color-sub !important
        &:hover
          border: 1px solid #ACACAC
</style>
