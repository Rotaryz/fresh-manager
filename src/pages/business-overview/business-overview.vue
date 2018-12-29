<template>
  <div class="business-overview">
    <div class="tab-header">
      <base-option-box></base-option-box>
    </div>
    <div class="content-header">
      <div class="content-title">营收概况</div>
    </div>
    <div class="survey">
      <div class="survey-item">
        <div class="survey-money">3255</div>
        <div class="survey-title">净利润(元)</div>
      </div>
      <div class="survey-item">
        <div class="survey-money">3255</div>
        <div class="survey-title">
          商品销售收入(元)
          <router-link tag="span" to="operating-cost" append class="detail hand">明细</router-link>
        </div>
      </div>
      <div class="survey-item">
        <div class="survey-money">3255</div>
        <div class="survey-title">营业成本(元)</div>
      </div>
    </div>
    <div class="content-header">
      <div class="content-title">营收趋势</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'BUSINESS_OVERVIEW'
  const TITLE = '营业概况'

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {}
    }
    // mounted() {
    //   this.$emit('setRoutine', true)
    // },
    // destroyed() {
    //   this.$emit('setRoutine', false)
    // }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .business-overview
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    align-items: center
    box-sizing: border-box
    position: relative
    .tab-box
      margin-right: 10px

  /*基本信息类头部盒子样式*/
  .content-header
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    justify-content: space-between
    padding-bottom: 15px
    position: relative
    box-sizing: border-box
    &:after
      content: ''
      position: absolute
      width: 34px
      height: 2px
      background: $color-main
      border-radius: 1px
      bottom: -1px
      left: 0
    .content-title
      color: $color-text-main
      font-family: $font-family-medium
      font-size: $font-size-16

  .survey
    height: 182px
    box-sizing: border-box
    display: flex
    align-items: center
    justify-content: space-around
    .survey-item
      .survey-money
        font-family: $font-family-bold
        font-size: 36px
        color: $color-text-main
      .survey-title
        color: #82899C
        font-family: $font-family-regular
        font-size: $font-size-14
        .detail
          color: $color-sub
          display: inline-block
          margin-left: 10px
          text-decoration: underline
          font-family: $font-family-regular
          font-size: $font-size-14
</style>
