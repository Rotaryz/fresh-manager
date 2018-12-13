<template>
  <div class="purchase-management">
    <div class="tab-header">
      <base-search></base-search>
      <div class="btn-main">导入采购单</div>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in listTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">DDH20188832770043</p>
          <p class="item-sub">2018-12-08 15:00:00</p>
        </div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" to="purchase-detail" append class="list-operation">详情</router-link>
          <span class="list-operation">导出</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination></base-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const PAGE_NAME = 'PURCHASE_MANAGEMENT'
  const TITLE = '采购管理'
  const LIST_TITLE = ['采购单号', '计划交货时间', '总采购项', '已采购项', '收货金额', '操作']
  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    data() {
      return {
        listTitle: LIST_TITLE
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .purchase-management
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
    justify-content: space-between
    align-items: center
    box-sizing: border-box

  .list-header
    height: 50px
    font-size: $font-size-16
    font-family: $font-family-regular
    color: $color-text-main
    background: $color-list-header

  .list-box
    line-height: 1
    padding: 0 30px
    box-sizing: border-box
    border-bottom: 1px solid $color-line
    display: flex
    align-items: center
    .list-item
      box-sizing: border-box
      padding-right: 10px
      flex: 1
      &:last-child
        flex: 0.6

  .list
    flex: 1
    .list-content
      font-family: $font-family-regular
      color: $color-text-main
      height: 70px
      border-bottom: 1px solid $color-line
      .list-item
        no-wrap()
        font-size: $font-size-14
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
          color: $color-text-assist
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
