<template>
  <div class="purchase-order-detail table">
    <div class="down-content">
      <div class="down-item-text">
        <span class="down-text">采购单号：T27218-CGD-2019-03-04-00001</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">采购商品数：2018</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">预采购金额：￥209.00</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">供应商：水果供应商B</span>
      </div>
      <div class="down-item-text">
        <span class="down-text">状态：待入库</span>
      </div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">采购单详情</p>
        </div>
        <div class="function-btn">
          <div class="btn-main">导入采购单</div>
        </div>
      </div>
      <div class="big-list">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div class="list-content list-box">
            <div class="list-item">阿克苏苹果克苏苹果克(肉脆汁多)阿克苏苹果克苏苹果克(肉脆汁多)…</div>
            <div class="list-item">2018-12-07 15:00</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">item</div>
            <div class="list-item">￥100.00</div>
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
  const PAGE_NAME = 'PURCHASE_ORDER_DETAIL'
  const TITLE = '采购单详情'
  const COMMODITIES_LIST = [
    '商品',
    '分类',
    '采购数量(采购单位)',
    '采购数量(销售单位)',
    '采购单价',
    '采购金额'
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
  .purchase-order-detail
    .list-box
      .list-item
        padding-right: 14px
        &:nth-child(1)
          flex: 2
</style>
