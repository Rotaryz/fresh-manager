<template>
  <div class="rush-purchase">
    <div class="tab-header">
      <!--<div class="btn-main">新建活动 +</div>-->
      <base-search></base-search>
    </div>
    <div class="list-header list-box">
      <div v-for="(item,index) in rushTitle" :key="index" class="list-item">{{item}}</div>
    </div>
    <div class="list">
      <div class="list-content list-box">
        <div class="list-item list-double-row">
          <p class="item-dark">2018-12-08 15:00:00</p>
          <p class="item-sub">2018-12-08 15:00:00</p>
        </div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item">DDH20188832770043DDH20188832770043</div>
        <div class="list-item"><span class="list-status"></span>咖啡机</div>
        <div class="list-item">2018-12-07 15:00</div>
        <div class="list-item list-operation-box">
          <router-link tag="span" to="purchase-detail" append class="list-operation">编辑</router-link>
          <span class="list-operation">删除</span>
        </div>
      </div>
    </div>
    <div class="pagination-box">
      <base-pagination></base-pagination>
    </div>
    <default-confirm></default-confirm>
  </div>
</template>

<script type="text/ecmascript-6">
  import DefaultConfirm from '@components/default-confirm/default-confirm'

  const PAGE_NAME = 'RUSH_PURCHASE'
  const TITLE = '今日抢购'
  const RUSH_TITLE = ['活动时间', '活动商品数', '销量', '预计到货时间', '状态', '创建时间', '操作']

  export default {
    name: PAGE_NAME,
    page: {
      title: TITLE
    },
    components: {
      DefaultConfirm
    },
    data() {
      return {
        rushTitle: RUSH_TITLE
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .rush-purchase
    overflow: hidden
    flex: 1
    display: flex
    flex-direction: column

  .tab-header
    height: 80px
    display: flex
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
    padding-left: 30px
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
        .list-status
          display: inline-block
          width: 9px
          height: 9px
          border-radius: 50%
          background: #E1E1E1
          margin-right: 6px
        .list-status-fail
          background: $color-negative
        .list-status-success
          background: $color-positive
      // 双行样式
      .list-double-row
        .item-sub
          margin-top: 8px
          font-size: $font-size-14
        .item-dark
          font-size: $font-size-14

  .pagination-box
    height: 70px
    align-items: center
    display: flex
</style>
