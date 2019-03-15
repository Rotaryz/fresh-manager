<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">出库单号：T27218-CGD-2019-03-04-00001</div>
      <div class="enter-title">关联订单号：BL343543444</div>
      <div class="enter-title">商户名称：广海花园社区</div>
      <div class="enter-title">出库时间：——</div>
      <div class="enter-title">状态：待提交</div>
      <div class="enter-title">入库金额：<span class="enter-title-money">￥209.00</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">提交入库单<span class="add-icon"></span></div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">2018-12-07 15:00</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item list-operation-box">
              <span class="list-operation">入库</span>
            </div>
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
    '批次号',
    '商品',
    '分类',
    '入库数量(采购单位)',
    '入库单价(销售单位) ',
    '入库金额',
    '保质期',
    '存放库位',
    '操作'
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
