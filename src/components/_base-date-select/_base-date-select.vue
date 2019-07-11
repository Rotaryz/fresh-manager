<template>
  <div class="base-date-select">
    <date-picker :placeholder="placeHolder"
                 :options="disabledDate"
                 :type="dataPickerType"
                 :value="value || dateInfo"
                 :style="{height: `${height}px`, width: `${width}px`}"
                 :clearable="clearable"
                 :format="format"
                 :editable="editable"
                 :disabled="disabled"
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
        // 是否可以输入
        type: Boolean,
        default: true
      },
      disabled: {
        // 是否禁用时间组件
        type: Boolean,
        default: false
      },
      format: {
        // 返回数据格式
        type: String,
        default: 'yyyy-MM-dd'
      },
      height: {
        // 样式
        type: Number,
        default: 28
      },
      width: {
        // 组件宽度
        type: Number,
        default: 187
      },
      dataPickerType: {
        // 组件高度
        type: String,
        default: 'daterange'
      },
      placeHolder: {
        // 时间组件默认文字
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
      value: {
        // value 使用 v-model 时，值是 Date 类型，可以配合 @on-change 使用
        type: undefined,
        default: null
      },
      disabledDate: {
        // 选择器额外配置，比如不可选日期与快捷选项
        type: Object,
        default: () => {
          return {}
        }
      },
      clearable: {
        // 是否显示清除按钮
        type: Boolean,
        default: true
      }
    },
    data() {
      return {}
    },
    watch: {
      disabledDate(news) {}
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
