<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">商户名称：广海花园社区</div>
      <div class="enter-title">订单号：BL343543444</div>
      <div class="enter-title">下单时间：——</div>
      <div class="enter-title">状态：待提交</div>
      <div class="enter-title">销售金额：<span class="enter-title-money">￥209.00</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
          </div>
        </div>
      </div>
      <div class="pagination-box">
        <base-pagination ref="pages"></base-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '商品',
    '商品编码',
    '分类',
    '销售数量',
    '销售单价',
    '销售金额'
  ]
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        commodities: COMMODITIES_LIST
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px
        &:last-child
          flex: 0.4
        &:nth-child(4), &:nth-child(2), &:nth-child(5), &:nth-child(6)
          flex: 1.5
  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    margin-right: 130px
    .enter-title-money
      color: #F84E3C
  .tip
    margin :0 2px
    font-size: $font-size-14
</style>
