<template>
  <div class="procurement-task table">
    <div class="down-content">
      <div class="enter-title">商户名称：{{detail.buyer_name}}</div>
      <div class="enter-title">订单号：{{detail.order_sn}}</div>
      <div class="enter-title">下单时间：{{detail.created_at}}</div>
      <div class="enter-title">状态：{{detail.status_str}}</div>
      <div class="enter-title">销售金额：<span class="enter-title-money">{{detail.total && `￥${detail.total}`}}</span></div>
    </div>
    <div class="table-content">
      <div class="identification">
        <div class="identification-page">
          <img src="./icon-inventory@2x.png" class="identification-icon">
          <p class="identification-name">商品明细</p>
        </div>
      </div>
      <div class="big-list" :class="detail.details.length > 10 ? 'big-list-max' : ''">
        <div class="list-header list-box">
          <div v-for="(item,index) in commodities" :key="index" class="list-item">{{item}}</div>
        </div>
        <div class="list">
          <div v-for="(item, index) in detail.details" :key="index" class="list-content list-box">
            <div class="list-item">{{item.goods_name}}</div>
            <div class="list-item">{{item.goods_sku_code}}</div>
            <div class="list-item">{{item.goods_category}}</div>
            <div class="list-item">{{item.sale_num}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {omsComputed} from '@state/helpers'

  const PAGE_NAME = 'PROCUREMENT_TASK'
  const TITLE = '商品详情'
  const COMMODITIES_LIST = [
    '商品',
    '商品编码',
    '分类',
    '销售数量'
    // '销售单价',
    // '销售金额'
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
    },
    computed: {
      ...omsComputed
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~@design"

  .procurement-task
    .list-box
      .list-item
        padding-right: 14px

  .down-content
    align-items: flex-start
    padding:5px 20px 25px
    box-sizing: border-box
  .enter-title
    font-size: $font-size-14
    font-family: $font-family-regular
    color: $color-text-main
    white-space: nowrap
    margin: 20px 80px 0 0
    .enter-title-money
      color: #F84E3C

  .tip
    margin: 0 2px
    font-size: $font-size-14
</style>
